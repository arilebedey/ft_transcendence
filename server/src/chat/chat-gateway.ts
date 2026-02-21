import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Inject, Logger, UseGuards } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { AuthGuard, Session } from '@thallesp/nestjs-better-auth';
import type { UserSession } from '@thallesp/nestjs-better-auth';
import { DATABASE_CONNECTION } from 'src/database/database-connection';
import type { AppDatabase } from 'src/database/database.types';
import { chatMessage, conversationParticipant } from './chat.schema';
import { eq, InferSelectModel } from 'drizzle-orm';

type ChatMessage = InferSelectModel<typeof chatMessage>;

@UseGuards(AuthGuard)
@WebSocketGateway({
  cors: {
    origin: true, // WARN: Set to client URL in prod!
    credentials: true,
  },
})
export class ChatGateway {
  private readonly logger = new Logger(ChatGateway.name);

  @WebSocketServer()
  server: Server;

  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: AppDatabase,
  ) {}

  @SubscribeMessage('joinRooms')
  async handleJoinRooms(@Session() session: UserSession, client: Socket) {
    const sharedRooms = await this.db
      .select()
      .from(conversationParticipant)
      .where(eq(conversationParticipant.userId, session.user.id));

    // The room used for the server to communicate with the client
    await client.join(`user:${session.user.id}`);

    for (const sr of sharedRooms) await client.join(sr.conversationId);

    this.logger.log(
      `User ${session.user.id} joined ${sharedRooms.length} conversation rooms`,
    );
  }

  broadcastMessage(conversationId: string, message: ChatMessage) {
    this.server.to(conversationId).emit('newMessage', message);
  }

  joinConversationRoom(userId: string, conversationId: string) {
    this.server.in(`user:${userId}`).socketsJoin(conversationId);
  }

  // Notify users about chat creation
  emitNewChat(userId: string, conversationId: string) {
    this.server.to(`user:${userId}`).emit('newChat', conversationId);
  }
}
