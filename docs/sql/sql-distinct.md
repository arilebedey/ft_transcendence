## DISTINCT

Regular `DISTINCT` removes duplicate rows from a result set:

```sql
SELECT DISTINCT country FROM users;
```

If 1000 users exist but only 3 unique countries, you get 3 rows back. It deduplicates across the **entire row**.

---

## DISTINCT ON

`DISTINCT ON` is a Postgres extension that says: **"give me one row per unique value of X, and let me control which row you pick from each group"**.

```sql
SELECT DISTINCT ON (conversation_id)
  conversation_id, content, seq
FROM chat_message
ORDER BY conversation_id, seq DESC;
```

Mentally, Postgres does this:

1. Groups all messages by `conversation_id`
2. Within each group, orders by `seq DESC`
3. Returns the **first row** from each group

So if you have:

```
conversation_id | seq | content
aaa             |  3  | "hello"
aaa             |  2  | "hey"
aaa             |  1  | "hi"
bbb             |  2  | "yo"
bbb             |  1  | "sup"
```

You get back:

```
aaa | 3 | "hello"
bbb | 2 | "yo"
```

One row per conversation — the latest one.

---

## Why the first argument

`DISTINCT ON` requires you to explicitly declare **which column(s) define a group**. This is the first argument in Drizzle:

```ts
.selectDistinctOn([chatMessage.conversationId], { ... })
//                 ^^^^^^^^^^^^^^^^^^^^^^^^^^^
//                 "one row per unique value of this"
```

Without it, Postgres wouldn't know what "distinct" means here. Are you deduplicating per conversation? Per sender? Per day? You have to say explicitly.

The constraint is that your `ORDER BY` **must start with the same column(s)** you put in `DISTINCT ON`. This is why:

```ts
.orderBy(chatMessage.conversationId, desc(chatMessage.seq))
//       ^^^^^^^^^^^^^^^^^^^^^^^^^^^  must come first
```

Postgres needs `conversation_id` first in the ORDER BY so it can process each group in order and know when one group ends and the next begins. Then `seq DESC` controls which row within the group gets picked — the highest seq, i.e. the latest message.

If you omit `conversation_id` from ORDER BY, Postgres throws an error. If you put `seq DESC` first, the grouping logic breaks down because rows from different conversations would be interleaved.
