import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { EditUserDto } from './dto';
import { UserService } from './user.service';
import { AtGuard } from '../common/guards';
import { GetCurrentUser, GetCurrentUserId } from '../common/decorators';

//protected route /users/me
@UseGuards(AtGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}
  @Get('me')
  getMe(@GetCurrentUser() user: User) {
    return user;
  }

  @Patch()
  editUser(@GetCurrentUserId() userId: string, @Body() dto: EditUserDto) {
    return this.userService.editUser(userId, dto);
  }
}
