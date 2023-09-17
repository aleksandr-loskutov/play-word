import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request as RequestType } from 'express';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtPayload, JwtPayloadWithRt } from '../types';

@Injectable()
export default class RtStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh'
) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([RtStrategy.extractJWT]),
      secretOrKey: config.get<string>('RT_SECRET'),
      // Pass request object to the validate function
      passReqToCallback: true,
    });
  }

  private static extractJWT(request: RequestType): string | null {
    let token: string | null = null;

    // Check if 'refresh_token' is present in cookies
    if (request.cookies && 'refresh_token' in request.cookies) {
      token = request.cookies.refreshToken;
    }

    // Fallback: Check if 'refresh_token' is present in request headers
    if (!token && request.headers.cookie) {
      const cookies = request.headers.cookie
        .split(';')
        .map((cookie) => cookie.trim());
      const refreshTokenCookie = cookies.find((cookie) =>
        cookie.startsWith('refresh_token=')
      );
      if (refreshTokenCookie) {
        [, token] = refreshTokenCookie.split('=');
      }
    }

    return token && token.length > 0 ? token : null;
  }

  // eslint-disable-next-line class-methods-use-this
  validate(request: RequestType, payload: JwtPayload): JwtPayloadWithRt {
    const token = RtStrategy.extractJWT(request);

    if (token) {
      return {
        ...payload,
        refreshToken: token,
      };
    }
    throw new ForbiddenException('Refresh token malformed');
  }
}
