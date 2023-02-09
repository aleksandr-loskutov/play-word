import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { EditUserDto } from './dto';
import { UserService } from './user.service';
import { AtGuard } from '../common/guards';
import { GetCurrentUser, GetCurrentUserId } from '../common/decorators';

//protected route /user
@UseGuards(AtGuard)
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @Get('')
  getMe(@GetCurrentUser() { id, name, email, createdAt }: User) {
    return {
      id,
      name,
      email,
      createdAt,
    };
  }

  @Patch()
  editUser(@GetCurrentUserId() userId: number, @Body() dto: EditUserDto) {
    return this.userService.editUser(userId, dto);
  }
}
