import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EditUserDto, UserDto } from './dto';
import * as argon from 'argon2';
import excludeFields from '../auth/utils/exludeFields';
import { UserWithTrainingSettings } from 'user';
import { AuthService } from '../auth/auth.service';
import { Tokens } from '../auth/types';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private authService: AuthService,
  ) {}

  async updateUser(
    userId: number,
    dto: EditUserDto,
    refreshToken: string,
  ): Promise<{ user: UserDto; tokens?: Tokens }> {
    let user = await this.getUserFromDb(userId);
    let tokens; //will exist only if user is really updated and new tokens generated - needed for setting them in cookie by user controller
    const shouldUpdateUser = await this.shouldUpdateUser(user, dto);

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
            'Password must be at least 8 characters long and contain at least one number',
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
            'Could not create or update training settings',
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
        refreshToken,
      );
      tokens = authRes.tokens;
    }

    excludeFields(user, ['hash', 'hashedRt', 'updatedAt']);
    return { user, tokens };
  }

  async getUserFromDb(userId: number): Promise<UserWithTrainingSettings> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { trainingSettings: true },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async shouldUpdateUser(
    user: UserWithTrainingSettings,
    dto: EditUserDto,
  ): Promise<boolean> {
    // Check basic fields
    const basicFields = ['email', 'name'];
    for (let field of basicFields) {
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

      for (let setting in dto.trainingSettings) {
        if (
          dto.trainingSettings[setting] !== currentTrainingSettings[setting]
        ) {
          return true;
        }
      }
    }

    return false;
  }
}
