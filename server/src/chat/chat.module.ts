import { Module } from '@nestjs/common';
import { ChatGateway } from './chat-gateway';
import { ChatService } from './chat.service';
import { DatabaseModule } from 'src/database/database.module';
import { ChatController } from './chat-controller';

@Module({
  imports: [DatabaseModule],
  controllers: [ChatController],
  providers: [ChatGateway, ChatService],
})
export class ChatModule {}
