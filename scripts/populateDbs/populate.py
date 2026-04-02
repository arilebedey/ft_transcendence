import uuid
import random
import datetime
import argparse
import os
import psycopg2
import json
import urllib.request
import urllib.error
import urllib.parse
import re
import unicodedata
from typing import List, Tuple
from psycopg2.extras import execute_values
from names_dataset import NameDataset, NameWrapper

# Cache aprceque sinon ca prend 100 ans
_DS = NameDataset(load_first_names=True, load_last_names=True)
_FIRST_KEYS = list(_DS.first_names.keys())
_LAST_KEYS = list(_DS.last_names.keys())


def init_parser() -> argparse.Namespace:
    p = argparse.ArgumentParser(description="Populate DB with users, posts and likes (with timestamps)")
    p.add_argument("--users", type=int, default=1000, help="Number of users to create (default: 1000)")
    p.add_argument("--posts-per-user", type=int, default=1, help="Posts created per user (default: 1)")
    p.add_argument("--likes", type=int, default=5000, help="Number of likes to generate (default: 5000)")
    p.add_argument("--follows", type=int, default=0, help="Number of follows to generate (default: 0)")
    p.add_argument("--start-date", type=str, default=None, help="Start date for timestamps (ISO format) e.g. 2024-01-01")
    p.add_argument("--end-date", type=str, default=None, help="End date for timestamps (ISO format) e.g. 2024-12-31")
    p.add_argument("--user-id", type=str, default=None, help="If specified, create posts only for this user ID instead of all users")
    p.add_argument("--user", type=str, default=None, help="If specified, treat this as an existing username and create posts/likes/follows for that user")
    p.add_argument("--out", type=str, default="populate.sql", help="Write SQL to this file instead of executing")
    p.add_argument("--apply", action="store_true", help="Execute directly against DATABASE_URL (requires psycopg2)")
    p.add_argument("--api-url", type=str, default=None, help="If provided, POST generated payload to this backend API endpoint instead of direct DB SQL")
    p.add_argument("--api-token", type=str, default=None, help="Bearer token for API endpoint (falls back to POPULATE_API_TOKEN env)")
    p.add_argument("--batch-size", type=int, default=500, help="Batch size for DB inserts (default: 500)")
    return p.parse_args()


def _rand_name() -> Tuple[str, str]:
    first = random.choice(_FIRST_KEYS)
    last = random.choice(_LAST_KEYS)
    return first, last


def _generate_valid_username(
        uid: str,
        used_names: set) -> str:
    """Generate a username matching the validation schema: 3-12 chars, 
    lowercase, a-z0-9_, no leading underscore"""

    def _sanitize_component(s: str) -> str:
        # Normalize unicode characters (é -> e), drop non-ascii
        s2 = unicodedata.normalize('NFKD', s)
        s2 = s2.encode('ascii', 'ignore').decode('ascii')
        s2 = s2.lower()
        # Replace any character that's not a-z or 0-9 with underscore
        s2 = re.sub('[^a-z0-9]', '_', s2)
        # Collapse multiple underscores
        s2 = re.sub('_+', '_', s2)
        # Strip leading/trailing underscores
        s2 = s2.strip('_')
        return s2

    max_attempts = 100
    for attempt in range(max_attempts):
        first, last = _rand_name()
        f = _sanitize_component(first)
        l = _sanitize_component(last)

        # Combine components with optional underscore if both present
        if f and l:
            base = f + ('_' if len(f) + 1 + len(l) <= 12 else '') + l
        else:
            base = f or l or ''

        # Truncate to max 12 chars
        base = base[:12]

        # If base is too short, pad with digits from uid
        if len(base) < 1:
            base = uid.replace('-', '')[:8]
        if len(base) < 3:
            pad = uid.replace('-', '')[: (3 - len(base))]
            base = (base + pad)[:12]

        # Ensure first character is a-z or 0-9 (not underscore)
        base = re.sub('^[^a-z0-9]+', '', base)
        if not base:
            base = 'user' + uid.replace('-', '')[:8]
        base = base[:12]

        # Final validation against /^[a-z0-9][a-z0-9_]*$/
        if re.fullmatch(r'[a-z0-9][a-z0-9_]*', base) and base not in used_names:
            return base

    # Fallback: use uid-based username if generation fails
    fallback = f"user{uid[:8]}".lower()[:12]
    return fallback


def generate_users(
        n: int, 
        created_at: datetime.datetime, 
        existing_user: dict | None = None) -> List[dict]:
    """Generate `n` users. If `existing_user` is provided, include it and 
    generate n-1 additional users. existing_user should be a dict with keys: id,
    name, email, created_at, updated_at.
    """
    print(f"Starting user generation")
    users = []
    used_names = set()

    if existing_user:
        users.append(existing_user)
        used_names.add(existing_user.get("name"))

    to_create = max(0, n - len(users))
    for _ in range(to_create):
        uid = str(uuid.uuid4())
        # Generate a valid username
        username = _generate_valid_username(uid, used_names)
        used_names.add(username)

        first_name = username.split("_")[0] if "_" in username else username[:6]
        email = f"{username}.{uid[:8]}@example.test"
        users.append({
            "id": uid,
            "name": username,
            "email": email,
            "created_at": created_at,
            "updated_at": created_at,
        })
    print(f"Generated {len(users)} users.")
    return users


def generate_posts(
        users: List[dict], 
        posts_per_user: int, 
        created_at: datetime.datetime, 
        target_user_id: str = None) -> List[dict]:
    print("Starting post generation")
    posts = []
    
    # If a target user is specified, create posts only for that user
    if target_user_id:
        target_user = next((u for u in users if u["id"] == target_user_id), None)
        target_name = target_user["name"] if target_user else f"user_{str(target_user_id)[:8]}"
        for _ in range(posts_per_user):
            posts.append({
                "link": "https://example.test/post/" + str(uuid.uuid4()),
                "content": f"Autogenerated post by {target_name}",
                "created_at": created_at,
                "user_id": target_user_id,
                "likes": 0,
            })
    else:
        # Create posts for all users
        for u in users:
            for _ in range(posts_per_user):
                posts.append({
                    "link": "https://example.test/post/" + str(uuid.uuid4()),
                    "content": f"Autogenerated post by {u['name']}",
                    "created_at": created_at,
                    "user_id": u["id"],
                    "likes": 0,
                })
    
    print(f"Generated {len(posts)} posts.")
    return posts


def random_timestamp_between(
        start: datetime.datetime, 
        end: datetime.datetime) -> datetime.datetime:
    delta = end - start
    seconds = random.randint(0, int(delta.total_seconds()))
    return start + datetime.timedelta(seconds=seconds)


def generate_likes(
        users: List[dict], 
        posts: List[dict], 
        likes_count: int, 
        start: datetime.datetime, 
        end: datetime.datetime) -> List[dict]:
    print("Starting like generation")
    likes = []
    user_ids = [u["id"] for u in users]
    post_indices = list(range(len(posts)))
    seen = set()
    attempts = 0
    while len(likes) < likes_count and attempts < likes_count * 10:
        attempts += 1
        user_id = random.choice(user_ids)
        post_idx = random.choice(post_indices)
        post = posts[post_idx]
        if post["user_id"] == user_id:
            continue
        key = (user_id, post_idx)
        if key in seen:
            continue
        seen.add(key)
        ts = random_timestamp_between(start, end)
        likes.append({"user_id": user_id, "post_id_idx": post_idx, "created_at": ts})
    likes.sort(key=lambda x: x["created_at"])
    print(f"Generated {len(likes)} likes.")
    return likes


def generate_follows(
        users: List[dict], 
        follows_count: int, 
        start: datetime.datetime, 
        end: datetime.datetime, 
        target_user_id: str = None) -> List[dict]:
    print("Starting follow generation")
    follows = []
    user_ids = [u["id"] for u in users]
    seen = set()
    attempts = 0
    
    # If a target user is specified, generate follows TO that user (other users following them)
    if target_user_id:
        other_user_ids = [u for u in user_ids if u != target_user_id]
        while len(follows) < follows_count and attempts < follows_count * 10:
            attempts += 1
            follower_id = random.choice(other_user_ids)
            following_id = target_user_id
            key = (follower_id, following_id)
            if key in seen:
                continue
            seen.add(key)
            ts = random_timestamp_between(start, end)
            follows.append({"follower_id": follower_id, "following_id": following_id, "created_at": ts})
    else:
        # Generate random follows
        while len(follows) < follows_count and attempts < follows_count * 10:
            attempts += 1
            follower_id = random.choice(user_ids)
            following_id = random.choice(user_ids)
            if follower_id == following_id:
                continue
            key = (follower_id, following_id)
            if key in seen:
                continue
            seen.add(key)
            ts = random_timestamp_between(start, end)
            follows.append({"follower_id": follower_id, "following_id": following_id, "created_at": ts})
    
    follows.sort(key=lambda x: x["created_at"])
    print(f"Generated {len(follows)} follows.")
    return follows


def to_sql(
        users: List[dict], 
        posts: List[dict], 
        likes: List[dict], 
        follows: List[dict] = None) -> str:
    parts = []
    # Insert into user table
    for u in users:
        parts.append(
            "INSERT INTO \"user\" (id, name, email, email_verified, image, created_at, updated_at) VALUES ({id}, {name}, {email}, false, NULL, {created}, {updated});".format(
                id=sql_val(u["id"]), name=sql_val(u["name"]), email=sql_val(u["email"]), created=sql_val(u["created_at"]), updated=sql_val(u["updated_at"])  # noqa: E501
            )
        )
    
    # Insert into user_data table
    for u in users:
        parts.append(
            "INSERT INTO user_data (id, name, email, theme, language, avatar_url, bio, created_at, updated_at) VALUES ({id}, {name}, {email}, 'light', 'en', NULL, NULL, {created}, {updated});".format(
                id=sql_val(u["id"]), name=sql_val(u["name"]), email=sql_val(u["email"]), created=sql_val(u["created_at"]), updated=sql_val(u["updated_at"])  # noqa: E501
            )
        )
    
    # Insert posts
    for p in posts:
        parts.append(
            "INSERT INTO post (link, content, created_at, user_id, likes) VALUES ({link}, {content}, {created}, {user_id}, {likes});".format(
                link=sql_val(p["link"]), content=sql_val(p["content"]), created=sql_val(p["created_at"]), user_id=sql_val(p["user_id"]), likes=p["likes"]
            )
        )
    
    # Insert likes and update post likes counter
    parts.append("\n-- Insert likes and update post likes counter\n")
    for l in likes:
        post = posts[l["post_id_idx"]]
        parts.append(
            "INSERT INTO post_like (user_id, post_id, created_at) SELECT {user_id}, id, {created} FROM post WHERE link = {link} LIMIT 1;".format(
                user_id=sql_val(l["user_id"]), created=sql_val(l["created_at"]), link=sql_val(post["link"])
            )
        )
    
    # Update post likes counter
    parts.append("\n-- Update post likes counter\n")
    parts.append("UPDATE post SET likes = (SELECT COUNT(*) FROM post_like WHERE post_like.post_id = post.id);")
    
    # Insert follows
    if follows:
        parts.append("\n-- Insert follows\n")
        for f in follows:
            parts.append(
                "INSERT INTO follow (follower_id, following_id, created_at) VALUES ({follower_id}, {following_id}, {created});".format(
                    follower_id=sql_val(f["follower_id"]), following_id=sql_val(f["following_id"]), created=sql_val(f["created_at"])
                )
            )
    
    return "\n".join(parts)


def sql_val(v):
    if v is None:
        return "NULL"
    if isinstance(v, bool):
        return "true" if v else "false"
    if isinstance(v, (int, float)):
        return str(v)
    if isinstance(v, datetime.datetime):
        return "'" + v.isoformat(sep=" ") + "'"
    s = str(v).replace("'", "''")
    return "'" + s + "'"


def execute_against_db(sql_statements: str):
    db_url = get_db_url()
    if not db_url:
        raise RuntimeError("No database URL found in environment (DATABASE_URL or POSTGRES_ variables)")
    conn = psycopg2.connect(db_url)
    try:
        with conn:
            with conn.cursor() as cur:
                cur.execute(sql_statements)
    finally:
        conn.close()


def execute_batches(
        db_url: str, 
        users: List[dict], 
        posts: List[dict], 
        likes: List[dict], 
        follows: List[dict] = None, 
        batch_size: int = 500):
    conn = psycopg2.connect(db_url)
    try:
        with conn:
            with conn.cursor() as cur:
                # insert users in batches
                user_vals = [(
                    u["id"], u["name"], u["email"], False, None, u["created_at"], u["updated_at"]
                ) for u in users]
                for i in range(0, len(user_vals), batch_size):
                    batch = user_vals[i:i+batch_size]
                    execute_values(cur, "INSERT INTO \"user\" (id, name, email, email_verified, image, created_at, updated_at) VALUES %s ON CONFLICT (id) DO NOTHING", batch)
                
                # insert into user_data table in batches
                user_data_vals = [(
                    u["id"], u["name"], u["email"], "light", "en", None, None, u["created_at"], u["updated_at"]
                ) for u in users]
                for i in range(0, len(user_data_vals), batch_size):
                    batch = user_data_vals[i:i+batch_size]
                    # Use ON CONFLICT DO NOTHING to avoid failures on any unique constraint (id or name)
                    execute_values(cur, "INSERT INTO user_data (id, name, email, theme, language, avatar_url, bio, created_at, updated_at) VALUES %s ON CONFLICT DO NOTHING", batch)

                # insert posts in batches
                post_vals = [(
                    p["link"], p["content"], p["created_at"], p["user_id"], p["likes"]
                ) for p in posts]
                all_links = []
                for i in range(0, len(post_vals), batch_size):
                    batch = post_vals[i:i+batch_size]
                    links = [b[0] for b in batch]
                    all_links.extend(links)
                    execute_values(cur, "INSERT INTO post (link, content, created_at, user_id, likes) VALUES %s", batch)

                # fetch inserted post ids by link in batches
                link_to_id = {}
                for i in range(0, len(all_links), batch_size):
                    chunk = all_links[i:i+batch_size]
                    cur.execute("SELECT id, link FROM post WHERE link = ANY(%s)", (chunk,))
                    for row in cur.fetchall():
                        link_to_id[row[1]] = row[0]

                # prepare likes tuples (user_id, post_id, created_at)
                like_vals = []
                for l in likes:
                    post = posts[l["post_id_idx"]]
                    post_id = link_to_id.get(post["link"])
                    if post_id is None:
                        continue
                    like_vals.append((l["user_id"], post_id, l["created_at"]))

                # insert likes in batches
                for i in range(0, len(like_vals), batch_size):
                    batch = like_vals[i:i+batch_size]
                    execute_values(cur, "INSERT INTO post_like (user_id, post_id, created_at) VALUES %s ON CONFLICT DO NOTHING", batch)
                
                # insert follows in batches
                if follows:
                    follow_vals = [(f["follower_id"], f["following_id"], f["created_at"]) for f in follows]
                    for i in range(0, len(follow_vals), batch_size):
                        batch = follow_vals[i:i+batch_size]
                        execute_values(cur, "INSERT INTO follow (follower_id, following_id, created_at) VALUES %s ON CONFLICT DO NOTHING", batch)
                
                # update post likes counter
                cur.execute("UPDATE post SET likes = (SELECT COUNT(*) FROM post_like WHERE post_like.post_id = post.id)")
    finally:
        conn.close()


def fetch_user_by_id(
        db_url: str, 
        user_id: str) -> dict | None:
    """Fetch a user from the database by id. Returns a dict compatible with generate_users or None."""
    conn = psycopg2.connect(db_url)
    try:
        with conn:
            with conn.cursor() as cur:
                cur.execute('SELECT id, name, email, created_at, updated_at FROM "user" WHERE id = %s', (user_id,))
                row = cur.fetchone()
                if not row:
                    return None
                uid, name, email, created_at, updated_at = row
                return {
                    "id": uid,
                    "name": name,
                    "email": email,
                    "created_at": created_at,
                    "updated_at": updated_at,
                }
    finally:
        conn.close()


def fetch_user_by_name(db_url: str, username: str) -> dict | None:
    """Fetch a user from the database by username. Returns a dict compatible with generate_users or None."""
    conn = psycopg2.connect(db_url)
    try:
        with conn:
            with conn.cursor() as cur:
                cur.execute('SELECT id, name, email, created_at, updated_at FROM "user" WHERE name = %s', (username,))
                row = cur.fetchone()
                if not row:
                    return None
                uid, name, email, created_at, updated_at = row
                return {
                    "id": uid,
                    "name": name,
                    "email": email,
                    "created_at": created_at,
                    "updated_at": updated_at,
                }
    finally:
        conn.close()


def get_db_url() -> str | None:
    # prefer explicit DATABASE_URL
    db_url = os.environ.get("DATABASE_URL") or os.environ.get("PG_URI") or os.environ.get("PGDATABASE")
    if db_url:
        return db_url
    # fallback to Drizzle-style env vars if present
    user = os.environ.get("POSTGRES_USER")
    password = os.environ.get("POSTGRES_PASSWORD")
    host = os.environ.get("POSTGRES_HOST")
    port = os.environ.get("POSTGRES_PORT")
    database = os.environ.get("POSTGRES_DB")
    if user and password and host and port and database:
        return f"postgresql://{user}:{password}@{host}:{port}/{database}"
    return None


def send_payload_to_api(
        api_url: str, 
        api_token: str | None, 
        payload: dict) -> dict:
    """POST JSON payload to provided API URL with optional Bearer token. Returns parsed JSON response or raises."""
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(api_url, data=data, method="POST")
    req.add_header("Content-Type", "application/json")
    if api_token:
        req.add_header("Authorization", f"Bearer {api_token}")
    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            resp_data = resp.read().decode("utf-8")
            if not resp_data:
                return {}
            return json.loads(resp_data)
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8")
        raise RuntimeError(f"API request failed: {e.code} {e.reason} - {body}")
    except urllib.error.URLError as e:
        raise RuntimeError(f"API request failed: {e}")


def main():
    args = init_parser()
    if args.start_date:
        start = datetime.datetime.fromisoformat(args.start_date)
    else:
        start = datetime.datetime.utcnow() - datetime.timedelta(days=90)
    if args.end_date:
        end = datetime.datetime.fromisoformat(args.end_date)
    else:
        end = datetime.datetime.utcnow()

    # Resolve optional existing user by username or id (prefer --user)
    existing_user = None
    target_user_id = None
    db_url = get_db_url()
    if args.user:
        if db_url:
            existing_user = fetch_user_by_name(db_url, args.user)
            if existing_user:
                target_user_id = existing_user["id"]
                print(f"Found existing user {existing_user['name']} ({existing_user['id']}) in database; it will be included in generation pipeline.")
            else:
                print(f"Warning: provided username {args.user} not found in database; will proceed without it.")
        else:
            print("Warning: no DATABASE_URL/POSTGRES_* env found; cannot resolve provided --user against database.")
    elif args.user_id:
        if db_url:
            existing_user = fetch_user_by_id(db_url, args.user_id)
            if existing_user:
                target_user_id = existing_user["id"]
                print(f"Found existing user {existing_user['id']} in database; it will be included in generation pipeline.")
            else:
                print(f"Warning: provided user-id {args.user_id} not found in database; will proceed without it.")
        else:
            print("Warning: no DATABASE_URL/POSTGRES_* env found; cannot verify provided --user-id against database.")

    users = generate_users(args.users, start, existing_user=existing_user)
    posts = generate_posts(users, args.posts_per_user, start, target_user_id=target_user_id)
    likes = generate_likes(users, posts, args.likes, start, end)
    follows = generate_follows(users, args.follows, start, end, target_user_id=target_user_id) if args.follows > 0 else []

    sql = to_sql(users, posts, likes, follows)

    # always write SQL file for review
    with open(args.out, "w", encoding="utf-8") as f:
        f.write(sql)
    print(f"Wrote SQL to {args.out}")

    # Determine API settings (args override env)
    api_url = args.api_url or os.environ.get("POPULATE_API_URL")
    api_token = args.api_token or os.environ.get("POPULATE_API_TOKEN")

    if args.apply and api_url:
        # Send generated payload to backend admin API
        payload = {
            "users": users,
            "posts": posts,
            "likes": likes,
            "follows": follows,
        }
        print(f"Sending payload to API: {api_url} (users={len(users)}, posts={len(posts)}, likes={len(likes)}, follows={len(follows)})")
        resp = send_payload_to_api(api_url, api_token, payload)
        print("API response:", resp)
        print("API population complete.")
    elif args.apply:
        # Fallback to direct DB if no API URL provided
        db_url = get_db_url()
        if not db_url:
            raise RuntimeError("No database URL found in environment (DATABASE_URL or POSTGRES_ variables) and no API url provided")
        print("Applying changes to database in batches...")
        execute_batches(db_url, users, posts, likes, follows if follows else None, batch_size=args.batch_size)
        print("Database update complete.")
    else:
        print("Dry-run: no changes applied. Use --apply with --api-url or a DATABASE_URL to apply.")


if __name__ == "__main__":
    main()
