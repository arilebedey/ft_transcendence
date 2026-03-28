import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { DatabaseModule } from '../database/database.module';
import { FollowModule } from '../follow/follow.module';
import { LikesModule } from '../likes/likes.module';
import { UsersModule } from '../users/users.module';


@Module({
  imports: [DatabaseModule, UsersModule, FollowModule, LikesModule],
  controllers: [PostsController],
  providers: [PostsService],
  exports: [PostsService],
})
export class PostsModule {}
