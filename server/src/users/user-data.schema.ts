import { relations } from 'drizzle-orm';
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { user } from '../auth/better-auth.schema';

export const userData = pgTable('user_data', {
  id: text('id')
    .primaryKey()
    .references(() => user.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  email: text('email').notNull(),
  theme: text('theme', { enum: ['light', 'dark-blue', 'forest'] })
    .default('light')
    .notNull(),
  language: text('language').default('en').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const userDataRelations = relations(userData, ({ one }) => ({
  user: one(user, {
    fields: [userData.id],
    references: [user.id],
  }),
}));
