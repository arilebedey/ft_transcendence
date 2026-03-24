This folder contains a small utility to generate test data (users, posts and likes)
and produce SQL inserts or execute them directly against your PostgreSQL database.

Prerequisites
- Python 3.8+
- Optional: `name-dataset` (better random names)
- Optional (to execute SQL): `psycopg2-binary`

Quick setup
```bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip setuptools wheel
pip install -r requirements.txt
```

Usage
- Write SQL to a file (default `populate.sql`):
```bash
python3 populate.py --users 200 --posts-per-user 2 --likes 1000 --out populate.sql
```
- Execute directly against a DB: export `DATABASE_URL` and run with `--apply` (requires `psycopg2`):
```bash
export DATABASE_URL=postgres://user:pass@host:5432/dbname
python3 populate.py --users 200 --posts-per-user 2 --likes 1000 --apply
```
- Create data for testing with a specific registered user:
```bash
python3 populate.py --users 100 --posts-per-user 5 --likes 500 --follows 50 --user-id "your-user-uuid" --apply
```

Options (important ones)
- `--users`: number of users to generate (default 1000)
- `--posts-per-user`: posts per user (default 1). When `--user-id` is set, creates posts only for that user.
- `--likes`: total number of likes to generate (default 5000)
- `--follows`: total number of follow relationships to generate (default 0). When `--user-id` is set, creates follows TO that user.
- `--user-id`: if specified, create posts only for this user and generate follows/likes targeting them (for easier dashboard testing)
- `--start-date` / `--end-date`: ISO dates to bound generated timestamps
- `--out`: output SQL file path (default `populate.sql`)
- `--apply`: execute SQL directly using `DATABASE_URL` (requires `psycopg2`)

Notes
- The script generates unique user `id` values (UUIDs) and lets the `post` table assign serial `id`s.
- Likes are inserted by matching posts using their generated `link` values so ordering matters when executing the SQL directly.
- If you want realistic names install `name-dataset` (pip) — the script falls back to a small name list if unavailable.
- The SQL output is simple INSERT statements; review before running on production databases.

Example
```bash
python3 populate.py --users 500 --posts-per-user 1 --likes 2000 --start-date 2025-01-01 --end-date 2025-03-01 --out mydata.sql
```

Questions or changes? Open an issue or ask for adjustments (e.g., different distributions for timestamps, avoid self-likes, or seedable RNG).