### User search code

```ts
  async search(userId: string, query?: string) {
    if (!query || query.trim().length === 0) return [];

    const sanitized = query.trim().slice(0, 50);

    const results = await this.db
      .select({
        id: userData.id,
        name: userData.name,
      })
      .from(userData)
      .where(
        and(ne(userData.id, userId), ilike(userData.name, `%${sanitized}%`)),
      )
      .limit(40);

    return results;
  }

```

### Question

is `%${sanitized}%` regex?

### AI answer

No. It's specific to SQL `LIKE`/`ILIKE` syntax. There are only two wildcards:

- `%` — matches any sequence of characters (including empty)
- `_` — matches exactly one character

That's it. Much simpler than regex. It has no concept of character classes, quantifiers, groups, etc.

If you need actual pattern matching in PostgreSQL, it has `~` (regex match) and `~*` (case-insensitive regex match) operators.
