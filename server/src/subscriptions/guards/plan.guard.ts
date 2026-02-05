import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Plan } from '../plan.types';

interface RequestWithSession {
  session?: {
    user?: {
      id?: string;
      email?: string;
      plan?: Plan;
    };
  };
}

@Injectable()
export class PlanGuard implements CanActivate {
  private readonly logger = new Logger(PlanGuard.name);

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPlans = this.reflector.get<Plan[]>(
      'required-plans',
      context.getHandler(),
    );

    if (!requiredPlans || requiredPlans.length === 0) return true;

    const request = context.switchToHttp().getRequest<RequestWithSession>();
    const user = request.session?.user;
    const userPlan = user?.plan ?? 'trial';

    if (!requiredPlans.includes(userPlan)) {
      this.logger.warn(
        `Plan access denied: ${user?.email ?? 'unknown'} (plan: ${userPlan}) requires ${requiredPlans.join(
          ' | ',
        )}`,
      );
      throw new ForbiddenException('Upgrade required');
    }

    return true;
  }
}
