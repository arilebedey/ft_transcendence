```ts
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

    const result = await this.db.transaction(
      async (tx) => {
        const creatorConvos = await tx
          .select({
            conversationId: conversationParticipant.conversationId,
          })
          .from(conversationParticipant)
          .where(eq(conversationParticipant.userId, creatorId));

        if (creatorConvos.length > 0) {
          const creatorConvoIds = creatorConvos.map(
            (c) => c.conversationId,
          );

          const existing = await tx
            .select({
              conversationId:
                conversationParticipant.conversationId,
            })
            .from(conversationParticipant)
            .where(
              and(
                inArray(
                  conversationParticipant.conversationId,
                  creatorConvoIds,
                ),
                eq(
                  conversationParticipant.userId,
                  dto.participantId,
                ),
              ),
            )
            .limit(1);

          if (existing.length > 0) {
            const [convo] = await tx
              .select()
              .from(conversation)
              .where(eq(conversation.id, existing[0].conversationId))
              .limit(1);

            return { convo, created: false };
          }
        }

        const [newConvo] = await tx
          .insert(conversation)
          .values({})
          .returning();

        await tx.insert(conversationParticipant).values([
          { conversationId: newConvo.id, userId: creatorId },
          { conversationId: newConvo.id, userId: dto.participantId },
        ]);

        return { convo: newConvo, created: true };
      },
      { isolationLevel: 'serializable' },
    );

    if (result.created) {
      this.logger.log(
        `New conversation created between users ${creatorId} and ${dto.participantId}: ${result.convo.id}`,
      );

      this.chatGateway.joinConversationRoom(creatorId, result.convo.id);
      this.chatGateway.joinConversationRoom(
        dto.participantId,
        result.convo.id,
      );
      this.chatGateway.emitNewChat(creatorId, result.convo.id);
      this.chatGateway.emitNewChat(dto.participantId, result.convo.id);
    }

    return result.convo;
  }
```

The key points:

- **`isolationLevel: 'serializable'`** — if two concurrent requests both read the participant table and see no existing conversation, Postgres will detect the serialization anomaly and abort one of them with a serialization failure.
- **Check + insert moved inside the transaction** — the existence check is now covered by the isolation guarantee.
- **`created` flag** — gateway side effects only fire for genuinely new conversations, not when returning an existing one.

The aborted transaction surfaces as a Drizzle error. If you want automatic retries rather than a 500, wrap the call:

```ts
  private async withSerializableRetry<T>(
    fn: () => Promise<T>,
    maxRetries = 3,
  ): Promise<T> {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await fn();
      } catch (err: unknown) {
        const code = (err as { code?: string }).code;
        if (code === '40001' && attempt < maxRetries - 1) {
          this.logger.warn(
            `Serialization failure, retrying (${attempt + 1}/${maxRetries})`,
          );
          continue;
        }
        throw err;
      }
    }
    throw new Error('Unreachable');
  }
```

Then use it as:

```ts
const result = await this.withSerializableRetry(() =>
  this.db.transaction(
    async (tx) => {
      // ... same body
    },
    { isolationLevel: "serializable" },
  ),
);
```
