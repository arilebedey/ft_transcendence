import { Module } from '@nestjs/common';
import { LikesService } from './likes.service';
import { DatabaseModule } from '../database/database.module';
import { LikesController } from './likes.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [LikesController],
  providers: [LikesService],
  exports: [LikesService],
})
export class LikesModule {}
