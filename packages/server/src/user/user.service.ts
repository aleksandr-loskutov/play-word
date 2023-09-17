import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as argon from 'argon2';
import { UserWithTrainingSettings } from 'user';
import PrismaService from '../prisma/prisma.service';
import { EditUserDto, TrainingSettingsDto, UserDto } from './dto';
import excludeFields from '../auth/utils/exludeFields';
import AuthService from '../auth/auth.service';
import { Tokens } from '../auth/types';
import { handleError } from '../common/utils';

type CommonFields = keyof EditUserDto & keyof UserWithTrainingSettings;
type TrainingSettingKeys = keyof TrainingSettingsDto;

@Injectable()
export default class UserService {
  constructor(
    private prisma: PrismaService,
    private authService: AuthService
  ) {}

  async updateUser(
    userId: number,
    dto: EditUserDto,
    refreshToken: string
  ): Promise<{ user: UserDto; tokens?: Tokens }> {
    try {
      let user = await this.getUserFromDb(userId);
      let tokens; // will exist only if user is really updated and new tokens generated - needed for setting them in cookie by user controller
      const shouldUpdateUser = await UserService.shouldUpdateUser(user, dto);

      if (shouldUpdateUser) {
        if (dto.email !== user.email) {
          const existingUser = await this.prisma.user.findUnique({
            where: { email: dto.email },
          });
          if (existingUser) {
            throw new ConflictException('Email already exists');
          }
          user.email = dto.email;
        }

        // Validate and update the password if provided
        if (dto.password && dto.passwordRepeat) {
          if (dto.password !== dto.passwordRepeat) {
            throw new BadRequestException('Passwords do not match');
          }
          if (dto.password.length < 8 || !/\d/.test(dto.password)) {
            throw new BadRequestException(
              'Password must be at least 8 characters long and contain at least one number'
            );
          }
          const hashedPassword = await argon.hash(dto.password);
          if (hashedPassword !== user.hash) {
            user.hash = hashedPassword;
          }
        }

        if (dto.trainingSettings) {
          let trainingSettings;
          if (!user.trainingSettings) {
            trainingSettings = await this.prisma.userTrainingSettings.create({
              data: {
                ...dto.trainingSettings,
                user: { connect: { id: userId } },
              },
            });
          } else {
            trainingSettings = await this.prisma.userTrainingSettings.update({
              where: { userId },
              data: dto.trainingSettings,
            });
          }
          if (!trainingSettings) {
            throw new BadRequestException(
              'Could not create or update training settings'
            );
          }
        }
        user = await this.prisma.user.update({
          where: { id: userId },
          data: { email: user.email, name: dto.name, hash: user.hash },
          include: { trainingSettings: true },
        });
        const authRes = await this.authService.refreshTokens(
          userId,
          refreshToken
        );
        tokens = authRes.tokens;
      }

      excludeFields(user, ['hash', 'hashedRt', 'updatedAt']);
      return { user, tokens };
    } catch (error: any) {
      handleError(error);
      throw new BadRequestException('Something went wrong');
    }
  }

  async getUserFromDb(userId: number): Promise<UserWithTrainingSettings> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: { trainingSettings: true },
      });
      if (!user) {
        throw new NotFoundException('Не найден пользователь');
      }
      return user;
    } catch (error: any) {
      handleError(error);
      throw new BadRequestException('Something went wrong');
    }
  }

  private static async shouldUpdateUser(
    user: UserWithTrainingSettings,
    dto: EditUserDto
  ): Promise<boolean> {
    try {
      // Check basic fields
      const basicFields: CommonFields[] = ['email', 'name'];

      // eslint-disable-next-line no-restricted-syntax
      for (const field of basicFields) {
        if (dto[field] && dto[field] !== user[field]) {
          return true;
        }
      }

      // Check password
      if (dto.password && dto.passwordRepeat) {
        const passwordMatches = await argon.verify(user.hash, dto.password);
        if (!passwordMatches) {
          return true;
        }
      }

      // Check training settings
      if (dto.trainingSettings) {
        const { trainingSettings: currentTrainingSettings } = user;
        // eslint-disable-next-line no-restricted-syntax
        for (const setting of Object.keys(
          dto.trainingSettings
        ) as TrainingSettingKeys[]) {
          if (
            dto.trainingSettings[setting] !== currentTrainingSettings[setting]
          ) {
            return true;
          }
        }
      }

      return false;
    } catch (error: any) {
      handleError(error);
      return false;
    }
  }
}
