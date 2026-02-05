import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { AuthConfigModule } from './auth/auth-config.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    AuthConfigModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
