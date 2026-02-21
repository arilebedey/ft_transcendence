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
import { and, eq, inArray } from 'drizzle-orm';
import { user } from 'src/auth/better-auth.schema';
import { conversation, conversationParticipant } from './chat.schema';
import type { AppDatabase } from 'src/database/database.types';

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

        return convo;
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

    this.chatGateway.joinConversationRoom(creatorId, result.id);
    this.chatGateway.joinConversationRoom(dto.participantId, result.id);
    this.chatGateway.emitNewChat(creatorId, result.id);
    this.chatGateway.emitNewChat(dto.participantId, result.id);

    return result;
  }
}
