> **Warning:** This workflow destroys all existing migration history. Only use this while the server is **not deployed to production**.

## Logic

We want a single clean migration (.sql) file and drizzle entry instead of incremental diffs for every time we change a `*.schema.ts` file. Of course, incremental diffs are crucial when DB is deployed to prod though, but clean history is more important before DB is live.

## When to use

You've modified or added a `*.schema.ts` file to the project.

## Steps

1. Save your `*.schema.ts` changes.

2. Delete the entire drizzle output directory:

```bash
rm -rf drizzle
```

3. Regenerate a single migration from all schemas:

```bash
npx drizzle-kit generate --name=init_tables
```

4. Commit. Keep schema changes and migration output in separate commits when possible.

## Why this works

`drizzle-kit generate` reads every `*.schema.ts` matched by `drizzle.config.ts` and diffs against the latest snapshot in `drizzle/meta/`. With no existing snapshots, it treats all schema files as new — producing one `.sql` file, one snapshot, and one journal entry regardless of how many schema files or tables exist.

## Once in production

This workflow is no longer safe. Use incremental migrations (`drizzle-kit generate --name=describe_change`) and never delete existing migration files.
