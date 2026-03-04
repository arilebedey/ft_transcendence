-- Migration: create post_like table
CREATE TABLE IF NOT EXISTS post_like (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  post_id INTEGER NOT NULL REFERENCES post(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  CONSTRAINT post_like_user_post_uq UNIQUE (user_id, post_id)
);

CREATE INDEX IF NOT EXISTS post_like_postId_idx ON post_like(post_id);
CREATE INDEX IF NOT EXISTS post_like_userId_idx ON post_like(user_id);
