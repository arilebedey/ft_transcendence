import { Controller, Get } from '@nestjs/common';

@Controller('users')
export class UsersController {
  @Get('session')
  getSession() {
    return { message: '/users/session endpoint' };
  }

  @Get('premium')
  premiumFeature() {
    return { data: 'Premium content' };
  }

  @Get('lifetime')
  lifetimeFeature() {
    return { data: 'Lifetime exclusive' };
  }
}
