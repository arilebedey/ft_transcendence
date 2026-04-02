import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthGuard, AuthModule } from '@thallesp/nestjs-better-auth';
import { apiKey } from '@better-auth/api-key';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { createAuthMiddleware, APIError } from 'better-auth/api';
import { APP_GUARD } from '@nestjs/core';
import { eq } from 'drizzle-orm';
import { DatabaseModule } from '../database/database.module';
import { DATABASE_CONNECTION } from '../database/database-connection';
import type { AppDatabase } from '../database/database.types';
import { userData } from '../users/user-data.schema';

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
          ],
          hooks: {
            before: createAuthMiddleware(async (ctx) => {
              // --- SIGN-UP ---
              if (ctx.path.startsWith('/sign-up')) {
                const body = ctx.body as { name?: string } | undefined;
                if (!body?.name) return;
          
                const existing = await database
                  .select({ id: userData.id })
                  .from(userData)
                  .where(eq(userData.name, body.name))
                  .limit(1);
          
                if (existing.length > 0) {
                  throw new APIError('UNPROCESSABLE_ENTITY', {
                    message: 'Username already taken',
                  });
                }
                return;
              }
            }),
            after: createAuthMiddleware(async (ctx) => {
              const newSession = ctx.context.newSession;
              if (!newSession) return;

              const { id, name, email } = newSession.user;
              let username = (name?.split(" ")[0] ?? email?.split("@")[0] ?? `user_${id}`)
                .toLowerCase()
                .replace(/[^a-z0-9_]/g, "");
              
              if (username[0] === "_") username = username.slice(1);
              username = username.slice(0, 12);
              
              const existing = await database
                .select({ id: userData.id })
                .from(userData)
                .where(eq(userData.name, username))
                .limit(1);
                  
              if (existing.length > 0) {
                const base = username.slice(0, 12 - 7);
                username = `${base}_${id.toString().slice(0, 6)}`;
              }
              await database
                .insert(userData)
                .values({ id, name: username, email })
                .onConflictDoNothing();
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
