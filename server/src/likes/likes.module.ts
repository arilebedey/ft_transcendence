import { Module } from '@nestjs/common';
import { LikesController } from './likes.controller';
import { LikesService } from './likes.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [LikesController],
  providers: [LikesService],
})
export class LikesModule {}
