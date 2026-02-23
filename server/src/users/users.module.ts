import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UserDataService } from './user-data.service';
import { DatabaseModule } from 'src/database/database.module';
import { StorageModule } from 'src/storage/storage.module';

@Module({
  imports: [DatabaseModule, StorageModule],
  controllers: [UsersController],
  providers: [UserDataService],
  exports: [UserDataService],
})
export class UsersModule {}
