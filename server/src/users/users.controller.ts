import { Body, Controller, Get, Patch } from '@nestjs/common';
import { GetUser } from 'src/auth/get-user.decorator';
import { UserDataService } from './user-data.service';
import type { AuthUser } from 'src/auth/auth.types';
import { UpdateUserDataDto } from './dto/update-user-data.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly userDataService: UserDataService) {}

  @Get('me')
  async getMe(@GetUser() user: AuthUser) {
    return this.userDataService.get(user.id);
  }

  @Patch('me')
  async updateMe(@GetUser() user: AuthUser, @Body() dto: UpdateUserDataDto) {
    return this.userDataService.update(user.id, dto);
  }

  @Get('session')
  getSession() {
    return { message: 'Called /users/session endpoint!' };
  }
}
