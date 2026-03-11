import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { DatabaseModule } from '../database/database.module';
import { FollowModule } from '../follow/follow.module';

@Module({
  imports: [DatabaseModule, FollowModule],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
