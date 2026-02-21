### Definition

`OR` means either condition can make a row qualify. Think of it as a row passing a test:

- Does this row have `createdAt < T`? ✓ include it
- **OR** does it have `createdAt = T` AND a different ID? ✓ also include it

A row only needs to satisfy **one** of the two branches to be returned. That's what OR means in set logic — the union of both groups.

It might feel confusing because in English "or" can be ambiguous, but in SQL/boolean logic it's always inclusive: pass either condition, you're in.

### Example

For our chat messages, we need to query the messages that are (1) older than cursorDate, or (2) messages that are equal to cursorDate, but with a different ID than cursorId.

This allows us to not skip the messages with duplicate createdAt Date by employing cursors.

```ts
const query = `
  SELECT *
  FROM chat_message
  WHERE conversation_id = $1
    AND (
      created_at < $2
      OR (
        created_at = $2
        AND id != $3
      )
    )
  ORDER BY created_at DESC
  LIMIT $4;
`;

const values = [conversationId, cursorDate, cursorId, safeLimit];
```

### Same example used in our code base using Drizzle ORM

```ts
const condition = cursor
  ? and(
      eq(chatMessage.conversationId, conversationId),
      or(
        lt(chatMessage.createdAt, cursorDate),
        and(
          eq(chatMessage.createdAt, cursorDate),
          ne(chatMessage.id, cursorId),
        ),
      ),
    )
  : eq(chatMessage.conversationId, conversationId);

const messages = await this.db
  .select()
  .from(chatMessage)
  .where(condition)
  .orderBy(desc(chatMessage.createdAt))
  .limit(safeLimit);
```
