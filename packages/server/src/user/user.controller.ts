import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserWithTrainingSettings } from 'user';
import { Response } from 'express';
import { EditUserDto, UserDto } from './dto';
import UserService from './user.service';
import { AtGuard, RtGuard } from '../common/guards';
import { GetCurrentUser } from '../common/decorators';
import setCookieToken from '../auth/utils/setCookieToken';
import { JwtPayloadWithRt } from '../auth/types';
import excludeFields from '../auth/utils/exludeFields';
import { disableCache } from '../common/utils';

@Controller('user')
export default class UserController {
  constructor(private userService: UserService) {}

  // eslint-disable-next-line class-methods-use-this
  @Get()
  @UseGuards(AtGuard)
  @HttpCode(HttpStatus.OK)
  getMe(
    @GetCurrentUser()
    user: UserWithTrainingSettings,
    @Res() response: Response
  ): void {
    excludeFields(user, ['iat', 'exp']);
    disableCache(response);
    response.json(user);
  }

  @Patch()
  @UseGuards(RtGuard)
  @HttpCode(HttpStatus.OK)
  async updateUser(
    @Res() response: Response,
    @Body() payload: EditUserDto,
    @GetCurrentUser() { id: userId, refreshToken }: JwtPayloadWithRt
  ): Promise<void> {
    const { user, tokens } = await this.userService.updateUser(
      userId,
      payload,
      refreshToken
    );
    if (tokens) setCookieToken(response, tokens);
    response.json(user);
  }
}
