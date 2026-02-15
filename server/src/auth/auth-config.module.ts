import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthGuard, AuthModule } from '@thallesp/nestjs-better-auth';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { expo } from '@better-auth/expo';
import { APP_GUARD } from '@nestjs/core';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DatabaseModule } from '../database/database.module';
import { DATABASE_CONNECTION } from '../database/database-connection';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    AuthModule.forRootAsync({
      imports: [ConfigModule, DatabaseModule],
      useFactory: (database: NodePgDatabase, configService: ConfigService) => ({
        auth: betterAuth({
          baseURL: configService.getOrThrow('BETTER_AUTH_URL'),
          plugins: [expo()],
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
          trustedOrigins: [
            configService.getOrThrow('CLIENT_URL'),
            'stashed://',
            ...(process.env.NODE_ENV === 'development'
              ? ['exp://192.168.*.*:*/**']
              : []),
          ],
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
