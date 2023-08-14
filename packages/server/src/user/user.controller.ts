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
import { EditUserDto, UserDto } from './dto';
import { UserService } from './user.service';
import { AtGuard, RtGuard } from '../common/guards';
import { GetCurrentUser } from '../common/decorators';
import setCookieToken from '../auth/utils/setCookieToken';
import { UserWithTrainingSettings } from 'user';
import { JwtPayloadWithRt } from '../auth/types';
import { Response } from 'express';

//protected route /user
@UseGuards(AtGuard)
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @Get('')
  @HttpCode(HttpStatus.OK)
  getMe(
    @GetCurrentUser()
    { id, name, email, createdAt, trainingSettings }: UserWithTrainingSettings,
  ): UserDto {
    return { id, name, email, createdAt, trainingSettings };
  }

  @Patch()
  @UseGuards(RtGuard)
  @HttpCode(HttpStatus.OK)
  async updateUser(
    @Res() response: Response,
    @Body() payload: EditUserDto,
    @GetCurrentUser() { id: userId, refreshToken }: JwtPayloadWithRt,
  ) {
    const { user, tokens } = await this.userService.updateUser(
      userId,
      payload,
      refreshToken,
    );
    if (tokens) setCookieToken(response, tokens);
    response.json(user);
    return response.end();
  }
}
