import { relations } from 'drizzle-orm';
import { pgTable, text, timestamp, primaryKey, index } from 'drizzle-orm/pg-core';
import { user } from '../auth/better-auth.schema';

export const follow = pgTable(
  'follow',
  {
    followerId: text('follower_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    followedId: text('followed_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [
    primaryKey(table.followerId, table.followedId), // ← clé composite
    index('follow_follower_idx').on(table.followerId),
    index('follow_followed_idx').on(table.followedId),
  ],
);

export const followRelations = relations(follow, ({ one }) => ({
  follower: one(user, {
    fields: [follow.followerId],
    references: [user.id],
  }),
  followed: one(user, {
    fields: [follow.followedId],
    references: [user.id],
  }),
}));