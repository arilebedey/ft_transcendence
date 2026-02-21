import {
  ConnectedSocket,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Inject, Logger, UseGuards } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { AuthGuard, OptionalAuth, Session } from '@thallesp/nestjs-better-auth';
import type { UserSession } from '@thallesp/nestjs-better-auth';
import { DATABASE_CONNECTION } from 'src/database/database-connection';
import type { AppDatabase } from 'src/database/database.types';
import { chatMessage, conversationParticipant } from './chat.schema';
import { eq, InferSelectModel } from 'drizzle-orm';
import { NewChatPayload } from './chat.types';

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
  private readonly userSockets = new Map<string, Set<string>>(); // Map client's chats
  private readonly socketUsers = new Map<string, string>(); // To detect duplicate joinRooms calls

  @WebSocketServer()
  server: Server;

  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: AppDatabase,
  ) {}

  @OptionalAuth()
  @SubscribeMessage('joinRooms')
  async handleJoinRooms(
    @ConnectedSocket() client: Socket,
    @Session() session: UserSession,
  ) {
    const userId = session.user.id;

    if (!userId) {
      this.logger.error('joinRooms called but session is missing');
      client.emit('unauthorized', { reason: 'missing_session' });
      client.disconnect(true);
      return;
    }

    // Register a cleanup handler that fires
    // once when the socket disconnects to free memory
    const existingUserId = this.socketUsers.get(client.id);
    if (!existingUserId) {
      client.once('disconnect', () => {
        const disconnectedUserId = this.socketUsers.get(client.id);
        this.socketUsers.delete(client.id);
        if (!disconnectedUserId) return;

        const sockets = this.userSockets.get(disconnectedUserId);
        sockets?.delete(client.id);
        if (sockets?.size === 0) this.userSockets.delete(disconnectedUserId);
      });
    }

    this.socketUsers.set(client.id, userId);

    let sockets = this.userSockets.get(userId);
    if (!sockets) {
      sockets = new Set();
      this.userSockets.set(userId, sockets);
    }
    sockets.add(client.id); // add current connection to user's sockets Set in userSockets

    const sharedRooms = await this.db
      .select()
      .from(conversationParticipant)
      .where(eq(conversationParticipant.userId, userId));

    await client.join(`user:${userId}`);

    for (const sr of sharedRooms) await client.join(sr.conversationId);
  }

  broadcastMessage(
    conversationId: string,
    message: ChatMessage,
    excludeSocketId?: string,
  ) {
    const emitter = excludeSocketId
      ? this.server.to(conversationId).except(excludeSocketId)
      : this.server.to(conversationId);
    emitter.emit('newMessage', { conversationId, message });
  }

  // Add user to created conversation
  joinConversationRoom(userId: string, conversationId: string) {
    const socketIds = this.userSockets.get(userId);
    if (!socketIds || socketIds.size === 0) {
      return;
    }
    for (const socketId of socketIds) {
      const sock = this.server.sockets.sockets.get(socketId); // check socket still exists
      if (sock) void sock.join(conversationId); // subs socket to room
    }
  }

  // Notify users about chat creation
  emitNewChat(userId: string, payload: NewChatPayload) {
    this.server.to(`user:${userId}`).emit('newChat', payload);
  }
}
