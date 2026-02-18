import { relations } from 'drizzle-orm';
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { user } from '../auth/better-auth.schema';

export const userData = pgTable('user_data', {
  id: text('id')
    .primaryKey()
    // This is a foreign key constraint. ( `.references()` )
    // It ensures this `id` actually exists in the `user` table
    // before allowing the insert. If you tried to insert with a fake id, it would fail.
    .references(() => user.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  email: text('email').notNull(),
  theme: text('theme', { enum: ['light', 'dark-blue', 'forest'] })
    .default('light')
    .notNull(),
  language: text('language', { enum: ['en', 'fr', 'it', 'es'] })
    .default('en')
    .notNull(),
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
