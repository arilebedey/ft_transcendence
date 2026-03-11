import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ChatGateway } from './chat-gateway';
import { DATABASE_CONNECTION } from 'src/database/database-connection';
import { CreateChatDto } from './dto/create-chat.dto';
import {
  and,
  desc,
  eq,
  getTableColumns,
  inArray,
  lt,
  ne,
  sql,
} from 'drizzle-orm';
import { user } from 'src/auth/better-auth.schema';
import {
  chatMessage,
  conversation,
  conversationParticipant,
} from './chat.schema';
import type { AppDatabase } from 'src/database/database.types';
import { SendMessageDto } from './dto/send-message.dto';
import { userData } from 'src/users/user-data.schema';
import { NewChatPayload } from './chat.types';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: AppDatabase,
    private readonly chatGateway: ChatGateway,
  ) {}

  async createChat(creatorId: string, dto: CreateChatDto) {
    if (creatorId === dto.participantId)
      throw new BadRequestException('Cannot create chat with yourself');

    const participantExists = await this.db
      .select({ _: user.id })
      .from(user)
      .where(eq(user.id, dto.participantId))
      .limit(1);

    if (participantExists.length === 0)
      throw new NotFoundException('User not found');

    const creatorConvos = await this.db
      .select({ conversationId: conversationParticipant.conversationId })
      .from(conversationParticipant)
      .where(eq(conversationParticipant.userId, creatorId));

    if (creatorConvos.length > 0) {
      const creatorConvoIds = creatorConvos.map((c) => c.conversationId);

      const existing = await this.db
        .select({ conversationId: conversationParticipant.conversationId })
        .from(conversationParticipant)
        .where(
          and(
            inArray(conversationParticipant.conversationId, creatorConvoIds),
            eq(conversationParticipant.userId, dto.participantId),
          ),
        )
        .limit(1);

      if (existing.length > 0) {
        const [convo] = await this.db
          .select()
          .from(conversation)
          .where(eq(conversation.id, existing[0].conversationId))
          .limit(1);

        const [otherName] = await this.db
          .select({
            id: userData.id,
            name: userData.name,
          })
          .from(userData)
          .where(eq(userData.id, dto.participantId))
          .limit(1);

        const [lastMsg] = await this.db
          .select({
            content: chatMessage.content,
            createdAt: chatMessage.createdAt,
            senderId: chatMessage.senderId,
          })
          .from(chatMessage)
          .where(eq(chatMessage.conversationId, existing[0].conversationId))
          .orderBy(desc(chatMessage.seq))
          .limit(1);

        return {
          id: convo.id,
          createdAt: convo.createdAt,
          updatedAt: convo.updatedAt,
          participant: otherName
            ? { id: otherName.id, name: otherName.name }
            : null,
          lastMessage: lastMsg ?? null,
        };
      }
    }

    const result = await this.db.transaction(async (tx) => {
      const [newConvo] = await tx.insert(conversation).values({}).returning();

      await tx.insert(conversationParticipant).values([
        {
          conversationId: newConvo.id,
          userId: creatorId,
        },
        {
          conversationId: newConvo.id,
          userId: dto.participantId,
        },
      ]);

      return newConvo;
    });

    this.logger.log(
      `New conversation created between users ${creatorId} and ${dto.participantId}: ${result.id}`,
    );

    const participantNames = await this.db
      .select({
        id: userData.id,
        name: userData.name,
        avatarUrl: userData.avatarUrl,
      })
      .from(userData)
      .where(inArray(userData.id, [creatorId, dto.participantId]));

    const nameMap = new Map(participantNames.map((pn) => [pn.id, pn]));

    const basePayload = {
      id: result.id,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
      lastMessage: null,
    } as const;

    const creatorPayload: NewChatPayload = {
      ...basePayload,
      participant: {
        id: dto.participantId,
        name: nameMap.get(dto.participantId)?.name ?? '',
        avatarUrl: nameMap.get(dto.participantId)?.avatarUrl ?? null,
      },
    };

    const participantPayload: NewChatPayload = {
      ...basePayload,
      participant: {
        id: creatorId,
        name: nameMap.get(creatorId)?.name ?? '',
        avatarUrl: nameMap.get(creatorId)?.avatarUrl ?? null,
      },
    };

    this.chatGateway.joinConversationRoom(creatorId, result.id);
    this.chatGateway.joinConversationRoom(dto.participantId, result.id);
    this.chatGateway.emitNewChat(creatorId, creatorPayload);
    this.chatGateway.emitNewChat(dto.participantId, participantPayload);

    return creatorPayload;
  }

  async sendMessage(
    senderId: string,
    conversationId: string,
    dto: SendMessageDto,
  ) {
    const convo = await this.db
      .select()
      .from(conversationParticipant)
      .where(
        and(
          eq(conversationParticipant.conversationId, conversationId),
          eq(conversationParticipant.userId, senderId),
        ),
      )
      .limit(1);

    if (convo.length === 0) {
      throw new NotFoundException('Conversation not found');
    }

    const message = await this.db.transaction(async (tx) => {
      const [updated] = await tx
        .update(conversation)
        .set({
          lastSeq: sql`${conversation.lastSeq} + 1`,
          updatedAt: sql`now()`,
        })
        .where(eq(conversation.id, conversationId))
        .returning({ lastSeq: conversation.lastSeq });

      const [result] = await tx
        .insert(chatMessage)
        .values({
          seq: updated.lastSeq,
          conversationId: conversationId,
          senderId: senderId,
          content: dto.content,
        })
        .returning();

      return result;
    });

    this.chatGateway.broadcastMessage(conversationId, message);

    return message;
  }

  async getChat(
    userId: string,
    conversationId: string,
    cursor?: number,
    limit: number = 50,
  ) {
    const participation = await this.db
      .select({ conversation: conversation })
      .from(conversationParticipant)
      .innerJoin(
        conversation,
        eq(conversation.id, conversationParticipant.conversationId),
      )
      .where(
        and(
          eq(conversationParticipant.conversationId, conversationId),
          eq(conversationParticipant.userId, userId),
        ),
      )
      .limit(1);

    if (participation.length === 0) {
      throw new NotFoundException('Conversation not found');
    }

    // const conv = participation[0].conversation;

    // const [otherParticipant] = await this.db
    //   .select({
    //     id: conversationParticipant.userId,
    //     name: userData.name,
    //   })
    //   .from(conversationParticipant)
    //   .innerJoin(userData, eq(userData.id, conversationParticipant.userId))
    //   .where(
    //     and(
    //       eq(conversationParticipant.conversationId, conversationId),
    //       ne(conversationParticipant.userId, userId),
    //     ),
    //   )
    //   .limit(1);

    const safeLimit = Math.min(Math.max(limit, 1), 100);

    const condition =
      cursor !== undefined
        ? and(
            eq(chatMessage.conversationId, conversationId),
            lt(chatMessage.seq, cursor),
          )
        : eq(chatMessage.conversationId, conversationId);

    const messages = await this.db
      .select()
      .from(chatMessage)
      .where(condition)
      .orderBy(desc(chatMessage.seq))
      .limit(safeLimit);

    messages.reverse();

    const nextCursor = messages.length === safeLimit ? messages[0].seq : null;

    return {
      // conv,
      // participant: otherParticipant ?? null,
      messages,
      nextCursor,
    };
  }

  async getChats(userId: string) {
    const convos = await this.db
      .select({
        ...getTableColumns(conversation),
      })
      .from(conversationParticipant)
      .innerJoin(
        conversation,
        eq(conversation.id, conversationParticipant.conversationId),
      )
      .where(eq(conversationParticipant.userId, userId));

    if (convos.length === 0) return [];

    const convoIds = convos.map((c) => c.id);

    const otherParticipants = await this.db
      .select({
        conversationId: conversationParticipant.conversationId,
        userId: conversationParticipant.userId,
        name: userData.name,
        avatarUrl: userData.avatarUrl,
      })
      .from(conversationParticipant)
      .innerJoin(userData, eq(userData.id, conversationParticipant.userId))
      .where(
        and(
          inArray(conversationParticipant.conversationId, convoIds),
          ne(conversationParticipant.userId, userId),
        ),
      );

    const lastMessages = await this.db
      .selectDistinctOn([chatMessage.conversationId], {
        conversationId: chatMessage.conversationId,
        content: chatMessage.content,
        senderId: chatMessage.senderId,
        createdAt: chatMessage.createdAt,
      })
      .from(chatMessage)
      .where(inArray(chatMessage.conversationId, convoIds))
      .orderBy(chatMessage.conversationId, desc(chatMessage.seq));

    const othersMap = new Map(
      otherParticipants.map((op) => [op.conversationId, op]),
    );

    const messageMap = new Map(
      lastMessages.map((lm) => [lm.conversationId, lm]),
    );

    const result = convos
      .map((conv) => {
        const other = othersMap.get(conv.id);
        const lastMessage = messageMap.get(conv.id);

        return {
          id: conv.id,
          createdAt: conv.createdAt,
          updatedAt: conv.updatedAt,
          participant: other ? { id: other.userId, name: other.name, avatarUrl: other.avatarUrl ?? null } : null,
          lastMessage: lastMessage
            ? {
                content: lastMessage.content,
                createdAt: lastMessage.createdAt,
                senderId: lastMessage.senderId,
              }
            : null,
        };
      })
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

    return result;
  }
}
