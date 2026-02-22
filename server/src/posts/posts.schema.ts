import { relations } from 'drizzle-orm';
import { pgTable, serial, text, timestamp, integer, index } from 'drizzle-orm/pg-core';
import { user } from '../auth/better-auth.schema';

export const post = pgTable(
  'post',
  {
    id: serial('id').primaryKey(),
    link: text('link').notNull(),
    content: text('content').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    likes: integer('likes').default(0).notNull(),
  },
  (table) => [index('post_userId_idx').on(table.userId)],
);

export const postRelations = relations(post, ({ one }) => ({
  author: one(user, {
    fields: [post.userId],
    references: [user.id],
  }),
}));
