import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UserDataService } from './user-data.service';
import { DatabaseModule } from 'src/database/database.module';
import { StorageModule } from 'src/storage/storage.module';
import { ChatModule } from 'src/chat/chat.module';

@Module({
  imports: [DatabaseModule, StorageModule, ChatModule],
  controllers: [UsersController],
  providers: [UserDataService],
  exports: [UserDataService],
})
export class UsersModule {}
