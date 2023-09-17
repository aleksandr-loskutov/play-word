import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request as RequestType } from 'express';
import { JwtPayload } from '../types';

@Injectable()
export default class AtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([AtStrategy.extractJWT]),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('AT_SECRET'),
    });
  }

  // user object will append to request (req.user) and can be used further like in express
  // eslint-disable-next-line class-methods-use-this
  validate(payload: JwtPayload) {
    if (!payload) throw new ForbiddenException('Access token malformed');
    return payload;
  }

  private static extractJWT(request: RequestType): string | null {
    let token: string | null = null;

    // Check if 'access_token' is present in cookies array
    if (request.cookies && 'access_token' in request.cookies) {
      token = request.cookies.accessToken;
    }

    // Fallback: Check if 'access_token' is present in request headers
    if (!token && request.headers.cookie) {
      const cookies = request.headers.cookie
        .split(';')
        .map((cookie) => cookie.trim());
      const accessTokenCookie = cookies.find((cookie) =>
        cookie.startsWith('access_token=')
      );
      if (accessTokenCookie) {
        [, token] = accessTokenCookie.split('=');
      }
    }

    return token && token.length > 0 ? token : null;
  }
}
