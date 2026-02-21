Drizzle uses a **column mapping object** to define what you want to select.

For example, write:

```ts
.select({ id: user.id })
```

And you're telling Drizzle:

- **Key** (`id`): the name of the property in the returned object
- **Value** (`user.id`): the actual column to fetch

Under the hood, Drizzle uses this to:

1. **Generate the SQL** — it extracts the actual column reference from `user.id` and builds `SELECT user.id FROM ...`
2. **Type the result** — it knows the returned object will have an `id` property of type `string` (inferred from the schema)

If you did `.select()` with no argument, you'd get the full row:

```ts
.select()  // Returns { id: string, email: string, emailVerified: boolean, ... }
```

If you want multiple columns:

```ts
.select({ id: user.id, email: user.email, name: user.name })
```

So the object syntax is Drizzle's way of:

- Being **explicit** about what columns you need (performance)
- **Renaming** them if you want (key can differ from column name)
- **Type-safe** inference of the result shape
