import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthGuard, AuthModule } from '@thallesp/nestjs-better-auth';
import { apiKey } from '@better-auth/api-key';
import { betterAuth } from 'better-auth';
import argon2 from 'argon2';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { createAuthMiddleware, APIError } from 'better-auth/api';
import { APP_GUARD } from '@nestjs/core';
import { eq } from 'drizzle-orm';
import { DatabaseModule } from '../database/database.module';
import { DATABASE_CONNECTION } from '../database/database-connection';
import type { AppDatabase } from '../database/database.types';
import { userData } from '../users/user-data.schema';
import { CustomLogger } from '../utils/custom-logger';
import { fallbackUsername, normalizeUsername } from './username.utils';

// Instantiated directly (outside DI) because better-auth hooks are
// plain functions that have no access to the NestJS injector.
const authLogger = new CustomLogger('AuthHook');

/** Extrait l'IP réelle même derrière un proxy */
function getIp(ctx: any): string {
  const req = ctx.request?.raw ?? ctx.request;
  return (
    req?.headers?.['x-forwarded-for']?.split(',')[0]?.trim() ??
    req?.socket?.remoteAddress ??
    'unknown'
  );
}

/** Extrait le User-Agent */
function getUA(ctx: any): string {
  const req = ctx.request?.raw ?? ctx.request;
  return req?.headers?.['user-agent'] ?? 'unknown';
}

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    AuthModule.forRootAsync({
      imports: [ConfigModule, DatabaseModule],
      useFactory: (database: AppDatabase, configService: ConfigService) => ({
        auth: betterAuth({
          baseURL: configService.getOrThrow('BETTER_AUTH_URL'),
          database: drizzleAdapter(database, {
            provider: 'pg',
          }),
          emailAndPassword: {
            autoSignIn: true,
            enabled: true,
            password: {
              hash: async (password: string) => {
                return await argon2.hash(password, {
                  type: argon2.argon2id,
                  memoryCost: 1 << 16,
                  timeCost: 3,
                  parallelism: 1,
                });
              },
              verify: async (data: { password: string; hash: string }) => {
                return await argon2.verify(data.hash, data.password);
              },
            },
          },
          socialProviders: {
            google: {
              clientId: configService.getOrThrow('GOOGLE_CLIENT_ID'),
              clientSecret: configService.getOrThrow('GOOGLE_CLIENT_SECRET'),
            },
          },
          trustedOrigins: [configService.getOrThrow('CLIENT_URL')],
          plugins: [
            apiKey({
              defaultPrefix: 'seenit',
              requireName: true,
              rateLimit: {
                enabled: true,
                timeWindow: 60_000,
                maxRequests: 15,
              },
            }),
            // password handling moved to `emailAndPassword.password`
          ],
          hooks: {
            before: createAuthMiddleware(async (ctx) => {
              const ip = getIp(ctx);
              const ua = getUA(ctx);

              // Sign-up validation before insertion
              if (ctx.path.startsWith('/sign-up')) {
                const body = ctx.body as
                  | { name?: string; email?: string }
                  | undefined;

                // Missing required fields
                if (!body?.name || !body?.email) {
                  const missingFields = [
                    !body?.name && 'username',
                    !body?.email && 'email',
                  ]
                    .filter(Boolean)
                    .join(', ');

                  authLogger.warn(
                    `[SECURITY] Sign-up rejected: missing fields (${missingFields}) from ${ip}`,
                  );
                  authLogger.event('auth.signup_failed', {
                    reason: 'missing_required_fields',
                    missingFields,
                    ip,
                    userAgent: ua,
                  });
                  return;
                }

                // Username already taken
                const username = normalizeUsername(body.name);
                const existing = await database
                  .select({ id: userData.id })
                  .from(userData)
                  .where(eq(userData.name, username))
                  .limit(1);

                if (existing.length > 0) {
                  authLogger.warn(
                    `[SECURITY] Sign-up rejected: username "${body.name}" already taken from ${ip}`,
                  );
                  authLogger.event('auth.signup_failed', {
                    reason: 'username_already_taken',
                    attemptedUsername: body.name,
                    ip,
                    userAgent: ua,
                  });
                  throw new APIError('UNPROCESSABLE_ENTITY', {
                    message: 'Username already taken',
                  });
                }
              }

              // Log sign-in attempt before processing
              if (ctx.path.startsWith('/sign-in')) {
                const body = ctx.body as { email?: string } | undefined;
                authLogger.log(
                  `[AUTH] Sign-in attempt for "${body?.email ?? 'unknown'}" from ${ip}`,
                );
              }
            }),

            after: createAuthMiddleware(async (ctx) => {
              const ip = getIp(ctx);
              const ua = getUA(ctx);
              const newSession = ctx.context.newSession;

              // Failed sign-in (no session created)
              if (ctx.path.startsWith('/sign-in') && !newSession) {
                const body = ctx.body as { email?: string } | undefined;
                authLogger.warn(
                  `[SECURITY] Failed sign-in for "${body?.email ?? 'unknown'}" from ${ip}`,
                );
                authLogger.event('auth.signin_failed', {
                  reason: 'invalid_credentials',
                  attemptedEmail: body?.email ?? 'unknown',
                  ip,
                  userAgent: ua,
                  severity: 'high',
                });
                return;
              }

              if (!newSession) return;

              const { id, name, email } = newSession.user;
              let username = normalizeUsername(name ?? email ?? `user_${id}`);

              const existing = await database
                .select({ id: userData.id })
                .from(userData)
                .where(eq(userData.name, username))
                .limit(1);

              if (existing.length > 0) {
                username = fallbackUsername(username, id);
              }

              // Successful sign-up
              if (ctx.path.startsWith('/sign-up')) {
                await database
                  .insert(userData)
                  .values({ id, name: username, email })
                  .onConflictDoNothing();

                authLogger.log(
                  `[AUTH] New account: ${username} (${email}) from ${ip}`,
                );
                authLogger.event('auth.signup', {
                  userId: id,
                  userName: username,
                  email,
                  userProfileUrl: `http://localhost:5173/profile/${username}`,
                  ip,
                  userAgent: ua,
                });
              }

              // Successful sign-in
              if (ctx.path.startsWith('/sign-in')) {
                authLogger.log(
                  `[AUTH] Signed in: ${name} (${email}) from ${ip}`,
                );
                authLogger.event('auth.signin', {
                  userId: id,
                  userName: name,
                  email,
                  userProfileUrl: `http://localhost:5173/profile/${name}`,
                  ip,
                  userAgent: ua,
                });
              }
            }),
          },
        }),
      }),
      inject: [DATABASE_CONNECTION, ConfigService],
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AuthConfigModule {}
