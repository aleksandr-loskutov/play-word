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

import { Public, GetCurrentUserId, GetCurrentUser } from '../common/decorators';
import { AtGuard, RtGuard } from '../common/guards';
import { AuthService } from './auth.service';
import { AuthDto, SignUpDto, AuthResponse } from './dto';
import setCookieToken from './utils/setCookieToken';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('/signup')
  @HttpCode(HttpStatus.CREATED)
  async signupLocal(
    @Res() response,
    @Body() dto: SignUpDto,
  ): Promise<AuthResponse> {
    const { user, tokens } = await this.authService.signupLocal(dto);
    setCookieToken(response, tokens);
    response.json(user);
    return response.end();
  }

  @Public()
  @Post('/signin')
  @HttpCode(HttpStatus.OK)
  async signinLocal(
    @Res() response,
    @Body() dto: AuthDto,
  ): Promise<AuthResponse> {
    const { user, tokens } = await this.authService.signinLocal(dto);
    setCookieToken(response, tokens);
    response.json(user);
    return response.end();
  }

  @UseGuards(AtGuard)
  @Post('/logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @Res() response,
    @GetCurrentUserId() userId: number,
  ): Promise<boolean> {
    await this.authService.logout(userId);
    setCookieToken(response, { access_token: '', refresh_token: '' });
    return response.end();
  }

  @Public()
  @UseGuards(RtGuard)
  @Get('/refresh')
  @HttpCode(HttpStatus.OK)
  async refreshTokens(
    @Res() response,
    @GetCurrentUserId() userId: number,
    @GetCurrentUser('refreshToken') refreshToken: string,
  ): Promise<AuthResponse> {
    const { user, tokens } = await this.authService.refreshTokens(
      userId,
      refreshToken,
    );
    setCookieToken(response, tokens);
    response.json(user);
    return response.end();
  }
}