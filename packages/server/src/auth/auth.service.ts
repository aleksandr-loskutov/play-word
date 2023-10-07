import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';
import type { UserWithTrainingSettings } from 'user';
import PrismaService from '../prisma/prisma.service';

import type { AuthDto, SignUpDto, AuthResponse } from './dto';
import type { JwtPayload, Tokens } from './types';
import excludeFields from './utils/exludeFields';
import { handleError } from '../common/utils';

@Injectable()
export default class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService
  ) {}

  async signupLocal(dto: SignUpDto): Promise<AuthResponse> {
    try {
      const hash = await argon.hash(dto.password);
      const user = await this.prisma.user
        .create({
          data: {
            email: dto.email,
            name: dto.name,
            hash,
          },
        })
        .catch((_) => {
          throw new ForbiddenException('Такой пользователь уже существует');
        });
      // we create default training settings for the user
      await this.prisma.userTrainingSettings.create({
        data: {
          userId: user.id,
        },
      });

      const userWithSettings = await this.prisma.user.findUnique({
        where: {
          id: user.id,
        },
        include: {
          trainingSettings: true,
        },
      });
      const tokens = await this.createTokens(userWithSettings);
      await this.updateRtHash(user.id, tokens.refreshToken);
      const userData = excludeFields(userWithSettings, [
        'hash',
        'hashedRt',
        'updatedAt',
      ]);
      return { user: userData, tokens };
    } catch (error: any) {
      handleError(error);
      throw new NotFoundException('Unknown error.');
    }
  }

  async signinLocal(dto: AuthDto): Promise<AuthResponse> {
    let user;
    try {
      user = await this.prisma.user.findUnique({
        where: {
          email: dto.email,
        },
        include: {
          trainingSettings: true,
        },
      });

      if (!user || !(await argon.verify(user.hash, dto.password))) {
        throw new ForbiddenException('Неверный логин или пароль');
      }

      const tokens = await this.createTokens(user);
      await this.updateRtHash(user.id, tokens.refreshToken);
      const userData = excludeFields(user, ['hash', 'hashedRt', 'updatedAt']);
      return { user: userData, tokens };
    } catch (error: any) {
      handleError(error);
      throw new NotFoundException('Unknown error.');
    }
  }

  async logout(userId: number): Promise<boolean> {
    try {
      await this.prisma.user.updateMany({
        where: {
          id: userId,
          hashedRt: {
            not: null,
          },
        },
        data: {
          hashedRt: null,
        },
      });
      return true;
    } catch (error: any) {
      handleError(error);
      throw new NotFoundException('Unknown error.');
    }
  }

  async refreshTokens(userId: number, rt: string): Promise<AuthResponse> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
        include: {
          trainingSettings: true,
        },
      });
      if (!user || !user.hashedRt || !(await argon.verify(user.hashedRt, rt))) {
        throw new ForbiddenException('Доступ запрещен');
      }

      const tokens = await this.createTokens(user);
      await this.updateRtHash(user.id, tokens.refreshToken);
      const userData = excludeFields(user, ['hash', 'hashedRt', 'updatedAt']);
      return { user: userData, tokens };
    } catch (error: any) {
      handleError(error);
      throw new NotFoundException('Unknown error.');
    }
  }

  async updateRtHash(userId: number, rt: string): Promise<void> {
    try {
      const hash = await argon.hash(rt);
      await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          hashedRt: hash,
        },
      });
    } catch (error: any) {
      handleError(error);
    }
  }

  async createTokens({
    id,
    email,
    name,
    createdAt,
    trainingSettings,
  }: UserWithTrainingSettings): Promise<Tokens> {
    try {
      const jwtPayload: JwtPayload = {
        id,
        name,
        email,
        createdAt,
        trainingSettings,
      };
      // expiry 60m for access token
      const [at, rt] = await Promise.all([
        this.jwtService.signAsync(jwtPayload, {
          secret: this.config.get<string>('AT_SECRET'),
          expiresIn: '60m',
        }),
        this.jwtService.signAsync(jwtPayload, {
          secret: this.config.get<string>('RT_SECRET'),
          expiresIn: '7d',
        }),
      ]);

      return {
        accessToken: at,
        refreshToken: rt,
      };
    } catch (error: any) {
      handleError(error);
      throw new NotFoundException('Unknown error.');
    }
  }
}
