import { Module } from '@nestjs/common';
import { ChatGateway } from './chat-gateway';
import { ChatService } from './chat.service';
import { DatabaseModule } from 'src/database/database.module';
import { ChatController } from './chat-controller';
import { PresenceService } from './presence.service';

@Module({
  imports: [DatabaseModule],
  controllers: [ChatController],
  providers: [ChatGateway, ChatService, PresenceService],
  exports: [PresenceService],
})
export class ChatModule {}
