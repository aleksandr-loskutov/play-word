import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request as RequestType, Request } from 'express';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtPayload, JwtPayloadWithRt } from '../types';

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([RtStrategy.extractJWT]),
      secretOrKey: config.get<string>('RT_SECRET'),
      passReqToCallback: true,
    });
  }

  private static extractJWT(request: RequestType): string | null {
    if (
      request.cookies &&
      'refresh_token' in request.cookies &&
      request.cookies.refresh_token?.length > 0
    ) {
      return request.cookies.refresh_token;
    }
    return null;
  }

  validate(request: Request, payload: JwtPayload): JwtPayloadWithRt {
    if (
      request.cookies &&
      'refresh_token' in request.cookies &&
      request.cookies.refresh_token?.length > 0
    ) {
      return {
        ...payload,
        refreshToken: request.cookies.refresh_token,
      };
    }
    throw new ForbiddenException('Refresh token malformed');
  }
}
