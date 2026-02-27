> **Warning:** This workflow destroys all existing migration history and database. Only use while server is **not deployed to production**.

## Logic

Generate a single clean migration file instead of incremental diffs for every schema change.

## When to use

You've modified or added a `*.schema.ts` file.

## Steps

1. Save your `*.schema.ts` changes.

2. Run the safest approach (wipes DB and migrations):

```bash
make re
```

This deletes the drizzle directory, regenerates migrations, applies them to the database, and spins up services in one command.

## Why this works

`drizzle-kit generate` reads every `*.schema.ts` and creates one `.sql` file from scratch with no existing snapshots. The makefile automatically migrates after regenerating.

## Once in production

Never use `make re`. Use incremental migrations (`drizzle-kit generate --name=describe_change`) instead.
