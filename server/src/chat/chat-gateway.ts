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
import { PresenceService } from './presence.service';

type ChatMessage = InferSelectModel<typeof chatMessage>;
type ChatSocketData = {
  presenceCleanupRegistered?: boolean;
};

@UseGuards(AuthGuard)
@WebSocketGateway({
  cors: {
    origin: process.env.CLIENT_URL ?? true,
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
    private readonly presenceService: PresenceService,
  ) {}

  @OptionalAuth()
  @SubscribeMessage('joinRooms')
  async handleJoinRooms(
    @ConnectedSocket() client: Socket,
    @Session() session: UserSession,
  ) {
    const userId = session.user.id;
    const socketData = client.data as ChatSocketData;

    if (!userId) {
      this.logger.error('joinRooms called but session is missing');
      client.emit('unauthorized', { reason: 'missing_session' });
      client.disconnect(true);
      return;
    }

    // Register the disconnect cleanup only once per socket so we
    // unregister presence exactly once, even if joinRooms is called again.
    if (!socketData.presenceCleanupRegistered) {
      client.once('disconnect', () => {
        const { userId: disconnectedUserId, becameOffline } =
          this.presenceService.unregisterSocket(client.id);

        if (disconnectedUserId && becameOffline) {
          this.server.emit('presence:update', {
            userId: disconnectedUserId,
            online: false,
          });
        }
      });
      socketData.presenceCleanupRegistered = true;
    }

    const { becameOnline } = this.presenceService.registerSocket(
      userId,
      client.id,
    );

    const sharedRooms = await this.db
      .select()
      .from(conversationParticipant)
      .where(eq(conversationParticipant.userId, userId));

    await client.join(`user:${userId}`);

    for (const sr of sharedRooms) await client.join(sr.conversationId);

    if (becameOnline) {
      this.server.emit('presence:update', { userId, online: true });
    }
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
    const socketIds = this.server.sockets.adapter.rooms.get(`user:${userId}`);
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
