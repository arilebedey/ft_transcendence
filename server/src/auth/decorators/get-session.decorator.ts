import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserSession } from '../auth.types';

export const GetSession = createParamDecorator(
  (data: keyof UserSession | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const session = request.session;

    if (!session) return null;

    return data ? session[data] : session;
  },
);
