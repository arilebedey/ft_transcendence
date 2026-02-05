import { Controller, Get } from '@nestjs/common';
import type { UserSession } from '../auth/auth.types';
import { GetSession } from '../auth/decorators/get-session.decorator';
import { RequirePlan } from '../subscriptions/decorators/require-plan.decorator';

@Controller('users')
export class UsersController {
  @Get('session')
  getSession(@GetSession() session: UserSession) {
    console.log('User plan:', session.user.plan);
    return { message: '/users/session endpoint' };
  }

  @Get('premium')
  @RequirePlan('premium', 'lifetime')
  premiumFeature() {
    return { data: 'Premium content' };
  }

  @Get('lifetime')
  @RequirePlan('lifetime')
  lifetimeFeature() {
    return { data: 'Lifetime exclusive' };
  }
}
