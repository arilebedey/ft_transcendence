import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { SendMessageDto } from './dto/send-message.dto';
import { UsePipes, ValidationPipe } from '@nestjs/common';

// @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
@WebSocketGateway()
export class ChatGateway {
  @SubscribeMessage('message')
  sendMessage(@MessageBody() body: SendMessageDto) {
    console.log('message body:', body);
  }
}
