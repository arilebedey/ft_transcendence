import { relations } from 'drizzle-orm';
import { pgTable, text, timestamp, primaryKey, index } from 'drizzle-orm/pg-core';
import { user } from '../auth/better-auth.schema';

export const follow = pgTable(
  'follow',
  {
    followerId: text('follower_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    followingId: text('following_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.followerId, table.followingId] }),
    index('follow_followerId_idx').on(table.followerId),
    index('follow_followingId_idx').on(table.followingId),
  ],
);

export const followRelations = relations(follow, ({ one }) => ({
  follower: one(user, {
    fields: [follow.followerId],
    references: [user.id],
  }),
  following: one(user, {
    fields: [follow.followingId],
    references: [user.id],
  }),
}));