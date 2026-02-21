import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { GetUser } from 'src/auth/get-user.decorator';
import type { AuthUser } from 'src/auth/auth.types';
import { CreateChatDto } from './dto/create-chat.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { ParseConversationIdPipe } from './pipes/parse-conversation-id.pipe';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  async createChat(@GetUser() user: AuthUser, @Body() dto: CreateChatDto) {
    return this.chatService.createChat(user.id, dto);
  }

  @Post(':conversationId/messages')
  async sendMessage(
    @GetUser() user: AuthUser,
    @Param('conversationId', ParseConversationIdPipe) conversationId: string,
    @Body() dto: SendMessageDto,
  ) {
    return this.chatService.sendMessage(user.id, conversationId, dto);
  }

  @Get()
  async getChats(@GetUser() user: AuthUser) {
    return this.chatService.getChats(user.id);
  }

  @Get(':conversationId')
  async getChat(
    @GetUser() user: AuthUser,
    @Param('conversationId', ParseConversationIdPipe) conversationId: string,
    @Query('cursor', new ParseIntPipe({ optional: true })) cursor?: number,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit?: number,
  ) {
    return this.chatService.getChat(user.id, conversationId, cursor, limit);
  }
}
