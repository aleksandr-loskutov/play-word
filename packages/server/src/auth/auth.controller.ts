import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Res,
  Get,
} from '@nestjs/common';

import type { Response } from 'express';
import { Public, GetCurrentUserId, GetCurrentUser } from '../common/decorators';
import { AtGuard, RtGuard } from '../common/guards';
import AuthService from './auth.service';
import { AuthDto, SignUpDto } from './dto';
import setCookieToken from './utils/setCookieToken';
import { disableCache } from '../common/utils';

@Controller('auth')
export default class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('/signup')
  @HttpCode(HttpStatus.CREATED)
  async signupLocal(
    @Res() response: Response,
    @Body() dto: SignUpDto
  ): Promise<void> {
    const { user, tokens } = await this.authService.signupLocal(dto);
    setCookieToken(response, tokens);
    response.json(user);
  }

  @Public()
  @Post('/signin')
  @HttpCode(HttpStatus.OK)
  async signinLocal(
    @Res() response: Response,
    @Body() dto: AuthDto
  ): Promise<void> {
    const { user, tokens } = await this.authService.signinLocal(dto);
    setCookieToken(response, tokens);
    response.json(user);
  }

  @UseGuards(AtGuard)
  @Post('/logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @Res() response: Response,
    @GetCurrentUserId() userId: number
  ): Promise<void> {
    await this.authService.logout(userId);
    setCookieToken(response, { accessToken: '', refreshToken: '' });
    response.end();
  }

  @UseGuards(RtGuard)
  @Get('/refresh')
  @HttpCode(HttpStatus.OK)
  async refreshTokens(
    @Res() response: Response,
    @GetCurrentUserId() userId: number,
    @GetCurrentUser('refreshToken') refreshToken: string
  ): Promise<void> {
    const { user, tokens } = await this.authService.refreshTokens(
      userId,
      refreshToken
    );
    disableCache(response);
    setCookieToken(response, tokens);
    response.json(user);
  }
}
