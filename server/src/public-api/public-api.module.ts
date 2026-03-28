import { Module } from '@nestjs/common';
import { AuthConfigModule } from '../auth/auth-config.module';
import { DatabaseModule } from '../database/database.module';
import { FollowModule } from '../follow/follow.module';
import { LikesModule } from '../likes/likes.module';
import { PostsModule } from '../posts/posts.module';
import { UsersModule } from '../users/users.module';
import { PublicApiController } from './public-api.controller';
import { PublicApiKeyGuard } from './public-api-key.guard';
import { PublicApiService } from './public-api.service';

@Module({
  imports: [
    AuthConfigModule,
    DatabaseModule,
    PostsModule,
    LikesModule,
    FollowModule,
    UsersModule,
  ],
  controllers: [PublicApiController],
  providers: [PublicApiService, PublicApiKeyGuard],
})
export class PublicApiModule {}
