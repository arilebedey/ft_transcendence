import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '@thallesp/nestjs-better-auth';
import type { Request } from 'express';
import type { AppAuth } from '../auth/auth';
import { UserDataService } from '../users/user-data.service';

type PublicApiRequest = Request & {
  apiKey?: unknown;
  user?: {
    id: string;
    name: string;
    email: string;
  };
};

@Injectable()
export class PublicApiKeyGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService<AppAuth>,
    private readonly userDataService: UserDataService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<PublicApiRequest>();
    const key = this.extractApiKey(request);

    if (!key) {
      throw new UnauthorizedException('Missing API key');
    }

    const result = await this.authService.api.verifyApiKey({
      body: { key },
    });

    if (!result.valid || !result.key) {
      if (result.error?.code === 'RATE_LIMIT_EXCEEDED') {
        throw new HttpException(
          'API key rate limit exceeded',
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }

      throw new UnauthorizedException(
        result.error?.message || 'Invalid API key',
      );
    }

    const owner = await this.userDataService.get(result.key.referenceId);

    request.apiKey = result.key;
    request.user = {
      id: owner.id,
      name: owner.name,
      email: owner.email,
    };

    return true;
  }

  private extractApiKey(request: Request): string | null {
    const authorization = request.headers.authorization;
    if (authorization?.startsWith('Bearer ')) {
      return authorization.slice('Bearer '.length).trim();
    }
    return null;
  }
}
