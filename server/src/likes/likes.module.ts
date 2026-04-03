import { Module } from '@nestjs/common';
import { LikesService } from './likes.service';
import { DatabaseModule } from '../database/database.module';
import { LikesController } from './likes.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [DatabaseModule, UsersModule],
  controllers: [LikesController],
  providers: [LikesService],
  exports: [LikesService],
})
export class LikesModule {}
