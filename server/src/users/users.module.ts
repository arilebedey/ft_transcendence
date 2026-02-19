import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UserDataService } from './user-data.service';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [UsersController],
  providers: [UserDataService],
})
export class UsersModule {}
