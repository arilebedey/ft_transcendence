import { relations } from 'drizzle-orm';
import {
  index,
  pgTable,
  primaryKey,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';
import { user } from '../auth/better-auth.schema';

export const conversation = pgTable('conversation', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => `conv_${crypto.randomUUID()}`),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const conversationParticipant = pgTable(
  'conversation_participant',
  {
    conversationId: text('conversation_id')
      .notNull()
      .references(() => conversation.id, { onDelete: 'cascade' }),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
  },
  (table) => [primaryKey({ columns: [table.conversationId, table.userId] })],
);

export const chatMessage = pgTable(
  'chat_message',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => `msg_${crypto.randomUUID()}`),
    content: text('content').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    senderId: text('sender_id')
      .notNull()
      .references(() => user.id),
    conversationId: text('conversation_id')
      .notNull()
      .references(() => conversation.id, { onDelete: 'cascade' }),
  },
  (table) => [
    index('chat_message_conversation_id_idx').on(table.conversationId),
    index('chat_message_sender_id_idx').on(table.senderId),
  ],
);

export const conversationRelations = relations(conversation, ({ many }) => ({
  participants: many(conversationParticipant),
  messages: many(chatMessage),
}));

export const conversationParticipantRelations = relations(
  conversationParticipant,
  ({ one }) => ({
    conversation: one(conversation, {
      fields: [conversationParticipant.conversationId],
      references: [conversation.id],
    }),
    user: one(user, {
      fields: [conversationParticipant.userId],
      references: [user.id],
    }),
  }),
);

export const chatMessageRelations = relations(chatMessage, ({ one }) => ({
  conversation: one(conversation, {
    fields: [chatMessage.conversationId],
    references: [conversation.id],
  }),
  sender: one(user, {
    fields: [chatMessage.senderId],
    references: [user.id],
  }),
}));
