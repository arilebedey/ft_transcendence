import { relations } from 'drizzle-orm';
import { pgTable, serial, integer, text, timestamp, index, uniqueIndex } from 'drizzle-orm/pg-core';
import { user } from '../auth/better-auth.schema';
import { post } from '../posts/posts.schema';

export const post_like = pgTable(
	'post_like',
	{
		id: serial('id').primaryKey(),
		userId: text('user_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		postId: integer('post_id')
			.notNull()
			.references(() => post.id, { onDelete: 'cascade' }),
		createdAt: timestamp('created_at').defaultNow().notNull(),
	},
	(table) => [
		uniqueIndex('post_like_user_post_uq').on(table.userId, table.postId),
		index('post_like_postId_idx').on(table.postId),
		index('post_like_userId_idx').on(table.userId),
	],
);

export const postLikeRelations = relations(post_like, ({ one }) => ({
	user: one(user, {
		fields: [post_like.userId],
		references: [user.id],
	}),
	post: one(post, {
		fields: [post_like.postId],
		references: [post.id],
	}),
}));
