### Example in code

```ts
const [updated] = await tx
  .update(conversation)
  .set({
    lastSeq: sql`${conversation.lastSeq} + 1`,
  })
  .where(eq(conversation.id, conversationId))
  .returning({ lastSeq: conversation.lastSeq });
```

### Explanation

It's a [tagged template literal](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#tagged_templates). `sql` here isn't a regular function call — it's a **tag function**.

When you write:

```ts
sql`${conversation.lastSeq} + 1`;
```

TypeScript/JavaScript calls `sql` as a function with two arguments:

1. An array of static string parts: `["", " + 1"]`
2. The interpolated expressions as rest params: `conversation.lastSeq`

Roughly equivalent to:

```ts
sql(["", " + 1"], conversation.lastSeq);
```

Drizzle's `sql` tag function uses this to build **parameterized SQL safely**. It sees `conversation.lastSeq` as a column reference object (not a raw string) and produces:

```sql
"last_seq" + 1
```

If it were a regular function call with a template string like `sql("${conversation.lastSeq} + 1")`, the interpolation would happen _before_ `sql` sees it — it would just receive a pre-baked string, losing all type info and column reference metadata. That's also how SQL injection happens in other contexts.

Tagged template literals are a standard JavaScript feature (ES2015+), fully supported by TypeScript. Other well-known examples: `styled.div` `` `color: red` `` in styled-components, and `gql` `` `query { ... }` `` in GraphQL.
