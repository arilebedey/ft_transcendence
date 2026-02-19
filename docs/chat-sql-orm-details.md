## Important SQL & Drizzle ORM concepts to understand the project's querying and DB architecture

**Table-level constraints**: if a constraint involves more than one column, it must be defined at the table level — you can't express "these two columns together must be unique" on a single column definition.

**Indices** are database structures that allow the engine to locate rows matching a condition without scanning the entire table — similar to a book's index. They are defined on one or more columns and trade slightly slower writes (the index must be kept in sync) for significantly faster reads on those columns.

**Drizzle ORM relation**: purely application-level metadata that tells Drizzle how to join tables when you use `with` in queries;

### The SQL `JOIN`s

**Joins** combine rows from two tables into one result set. Without a join, `SELECT * FROM conversation` only gives you columns from conversation — you'd need a separate query to fetch related data from another table.

A join lets you pull columns from multiple tables in a single query, by specifying how rows from each table relate to each other — the join condition

`INNER JOIN` aka `JOIN` returns only rows where the condition is satisfied on both sides:

```sql
SELECT * FROM conversation
INNER JOIN chat_message ON chat_message.conversation_id = conversation.id
```

If a conversation had no messages, it would be absent from the result entirely — because there's no matching row on the right side. That's the defining behavior of INNER JOIN.

`LEFT JOIN` relaxes that — it keeps all rows from the left table regardless, filling the right side with NULL where no match exists (e.g., for displaying chats with no participants in them)

## Implementation details

### `conversationParticipant` table

Since each conversation can have multiple users, and each user can be in multiple conversations, you can't store that relationship on either table directly.

In practice (2-user chat), each conversation will have exactly 2 rows in this table — one per participant. This is how you'd look up "all conversations for a given user" or "all users in a given conversation".

We define a composite primary key across `conversationId` and `userId`, meaning the combination of both columns must be unique. It is a table-level constraint because it involves more than one column. It is define via a callback in drizzle (`(table) => ...`).

Thus, one user can have many conversations, but only one belong be in the same conversation once.

If a conversation or user row that is referenced in a conversationParticipant row is deleted, then the conversationParticipant row(s) it is referenced in will be deleted too thanks to `onDelete: "cascade"`.

```ts
export const conversationParticipant = pgTable(
  "conversation_participant",
  {
    conversationId: text("conversation_id")
      .notNull()
      .references(() => conversation.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [primaryKey({ columns: [table.conversationId, table.userId] })],
);
```

### Indices on `chatMessage`

**`chat_message_conversation_id_idx`**: the most critical one. Nearly every chat query is "fetch messages for conversation X", so this index is essential for fast thread loading.

**`chat_message_sender_id_idx`**: optimizes queries like "all messages sent by user X" — useful for user-scoped analytics.

```ts
(table) => [
  index("chat_message_conversation_id_idx").on(table.conversationId),
  index("chat_message_sender_id_idx").on(table.senderId),
],
```

### `conversationRelations` Drizzle relation

```ts
export const conversationRelations = relations(conversation, ({ many }) => ({
  participants: many(conversationParticipant),
  messages: many(chatMessage),
}));
```

A conversation owns two one-to-many relationships: one to `conversationParticipant` (its members) and one to `chatMessage` (its messages). Declaring both under `relations()` lets Drizzle resolve them automatically when you use `with` in a query — no manual joins needed.

```ts
db.query.conversation.findFirst({
  where: eq(conversation.id, someId),
  with: {
    participants: true,
    messages: true,
  },
});
```
