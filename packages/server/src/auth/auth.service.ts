import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import * as argon from 'argon2';
import { PrismaService } from '../prisma/prisma.service';

import { AuthDto, SignUpDto, AuthResponse } from './dto';
import { JwtPayload, Tokens } from './types';
import excludeFields from './utils/exludeFields';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async signupLocal(dto: SignUpDto): Promise<AuthResponse> {
    const hash = await argon.hash(dto.password);

    const user = await this.prisma.user
      .create({
        data: {
          email: dto.email,
          name: dto.name,
          hash,
        },
      })
      .catch((error) => {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code === 'P2002') {
            throw new ForbiddenException(
              'User already exists or credentials are invalid',
            );
          }
        }
        throw error;
      });

    const tokens = await this.createTokens(user);
    await this.updateRtHash(user.id, tokens.refresh_token);
    excludeFields(user, ['hash', 'hashedRt', 'updatedAt']);
    return { user, tokens };
  }

  async signinLocal(dto: AuthDto): Promise<AuthResponse> {
    //find the user by email
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    //if user does not exist throw error
    if (!user) throw new ForbiddenException('Access Denied');
    //compare password
    const passwordMatches = await argon.verify(user.hash, dto.password);
    if (!passwordMatches) throw new ForbiddenException('Access Denied');
    //generate new tokens
    const tokens = await this.createTokens(user);
    //update refresh in db & return user & tokens
    await this.updateRtHash(user.id, tokens.refresh_token);
    excludeFields(user, ['hash', 'hashedRt', 'updatedAt']);
    return { user, tokens };
  }

  async logout(userId: number): Promise<boolean> {
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
  }

  async refreshTokens(userId: number, rt: string): Promise<AuthResponse> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user || !user.hashedRt) throw new ForbiddenException('Access Denied');

    const rtMatches = await argon.verify(user.hashedRt, rt);
    if (!rtMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.createTokens(user);
    await this.updateRtHash(user.id, tokens.refresh_token);
    excludeFields(user, ['hash', 'hashedRt', 'updatedAt']);
    return { user, tokens };
  }

  async updateRtHash(userId: number, rt: string): Promise<void> {
    const hash = await argon.hash(rt);
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        hashedRt: hash,
      },
    });
  }

  async createTokens({ id, email, name, createdAt }: User): Promise<Tokens> {
    const jwtPayload: JwtPayload = {
      id,
      name,
      email,
      createdAt,
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
      access_token: at,
      refresh_token: rt,
    };
  }
}
