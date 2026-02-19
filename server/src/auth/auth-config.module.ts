import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthGuard, AuthModule } from '@thallesp/nestjs-better-auth';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { createAuthMiddleware } from 'better-auth/api';
import { APP_GUARD } from '@nestjs/core';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DatabaseModule } from '../database/database.module';
import { DATABASE_CONNECTION } from '../database/database-connection';
import { userData } from '../users/user-data.schema';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    AuthModule.forRootAsync({
      imports: [ConfigModule, DatabaseModule],
      useFactory: (database: NodePgDatabase, configService: ConfigService) => ({
        auth: betterAuth({
          baseURL: configService.getOrThrow('BETTER_AUTH_URL'),
          database: drizzleAdapter(database, {
            provider: 'pg',
          }),
          emailAndPassword: {
            autoSignIn: true,
            enabled: true,
          },
          // socialProviders: {
          //   google: {
          //     clientId: readSecret('google-client-id.txt'),
          //     clientSecret: readSecret('google-client-secret.txt'),
          //     prompt: 'select_account',
          //   },
          // },
          trustedOrigins: [configService.getOrThrow('CLIENT_URL')],
          hooks: {
            after: createAuthMiddleware(async (ctx) => {
              if (!ctx.path.startsWith('/sign-up')) return;
              const newSession = ctx.context.newSession;
              if (!newSession) return;
              const { id, name, email } = newSession.user;
              await database
                .insert(userData)
                .values({ id, name, email })
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
