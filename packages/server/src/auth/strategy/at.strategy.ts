import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../types';
import { Request as RequestType } from 'express';

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([AtStrategy.extractJWT]),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('AT_SECRET'),
    });
  }
  //user object will append to request (req.user) and can be used further like in express
  validate(payload: JwtPayload) {
    if (!payload) throw new ForbiddenException('Access token malformed');
    return payload;
  }

  private static extractJWT(request: RequestType): string | null {
    if (
      request.cookies &&
      'access_token' in request.cookies &&
      request.cookies.access_token?.length > 0
    ) {
      return request.cookies.access_token;
    }
    return null;
  }
}
