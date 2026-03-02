import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { AuthConfigModule } from './auth/auth-config.module';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { LikesModule } from './likes/likes.module';
import { ChatModule } from './chat/chat.module';
import { FollowModule } from './follow/follow.module';


@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    AuthConfigModule,
    UsersModule,
    PostsModule,
    LikesModule,
    ChatModule,
    FollowModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
