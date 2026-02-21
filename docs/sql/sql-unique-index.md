### Example

Within a conversation, no two messages should ever share the same `seq`. The unique index enforces that at the database level — if a bug somehow produced a duplicate `(conversationId, seq)` pair, Postgres would reject the insert rather than silently corrupt your pagination.

It's both an index (for query performance) and a constraint (for data integrity) in one.

### In code

```sql
CREATE UNIQUE INDEX chat_message_conversation_seq_idx
  ON chat_message (conversation_id, seq);
```

```ts
export const chatMessage = pgTable(
  "chat_message",
  {
    // chat_message columns (id, created_at, seq,...)
  },
  (table) => [
    uniqueIndex("chat_message_conversation_seq_idx").on(
      table.conversationId,
      table.seq,
    ),
    // other indices
  ],
);
```
