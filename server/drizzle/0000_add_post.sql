CREATE TABLE "post" (
  "id" SERIAL PRIMARY KEY,
  "link" VARCHAR(255) NOT NULL,
  "content" TEXT NOT NULL,
  "created_at" TIMESTAMP DEFAULT now() NOT NULL,
  "user_id" text NOT NULL,
  "likes" INTEGER DEFAULT 0 NOT NULL,
  CONSTRAINT "post_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE
);

CREATE INDEX "post_user_id_idx" ON "post" USING btree ("user_id");