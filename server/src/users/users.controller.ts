import { Controller, Get } from '@nestjs/common';
import { GetUser } from 'src/auth/get-user.decorator';
import { UserDataService } from './user-data.service';
import type { AuthUser } from 'src/auth/auth.types';

@Controller('users')
export class UsersController {
  constructor(private readonly userDataService: UserDataService) {}

  @Get('me')
  async getMe(@GetUser() user: AuthUser) {
    return this.userDataService.get(user.id);
  }

  @Get('session')
  getSession() {
    return { message: 'Called /users/session endpoint!' };
  }
}
