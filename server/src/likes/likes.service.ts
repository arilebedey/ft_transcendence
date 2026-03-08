import { Injectable, Inject } from '@nestjs/common';
import { eq, and } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { sql } from 'drizzle-orm';
import { DATABASE_CONNECTION } from '../database/database-connection';
import * as postsSchema from '../posts/posts.schema';
import * as likesSchema from './likes.schema';

@Injectable()
export class LikesService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: NodePgDatabase<any>,
  ) {}

  async toggleLike(userId: string, postId: number) {
    return this.db.transaction(async (tx) => {
      // Try to insert a like; if it already exists the onConflictDoNothing will
      // return no rows. If inserted, increment the post counter atomically.
      const [inserted] = await (tx.insert(likesSchema.post_like)
        .values({ userId, postId }) as any)
        .onConflictDoNothing()
        .returning();

      if (inserted) {
        const [updated] = await tx
          .update(postsSchema.post)
          .set({ likes: sql`${postsSchema.post.likes} + 1` })
          .where(eq(postsSchema.post.id, postId))
          .returning();
        return { liked: true, likes: updated?.likes ?? null };
      }

      // If insert didn't happen, try to delete the existing like (unlike)
      const [deleted] = await tx
        .delete(likesSchema.post_like)
        .where(and(eq(likesSchema.post_like.postId, postId), eq(likesSchema.post_like.userId, userId)))
        .returning();

      if (deleted) {
        const [updated] = await tx
          .update(postsSchema.post)
          .set({ likes: sql`${postsSchema.post.likes} - 1` })
          .where(eq(postsSchema.post.id, postId))
          .returning();
        return { liked: false, likes: updated?.likes ?? null };
      }

      // No-op (concurrent state changed between operations)
      return null;
    });
  }

  async countForPost(postId: number): Promise<number> {
    const [{ count }] = await this.db
      .select({ count: sql`count(*)` })
      .from(likesSchema.post_like)
      .where(eq(likesSchema.post_like.postId, postId));

    return Number((count as unknown) ?? 0);
  }

  async isLikedByUser(postId: number, userId: string): Promise<boolean> {
    const [row] = await this.db
      .select({ cnt: sql`count(*)` })
      .from(likesSchema.post_like)
      .where(and(eq(likesSchema.post_like.postId, postId), eq(likesSchema.post_like.userId, userId)));
    return Number((row?.cnt as unknown) ?? 0) > 0;
  }

  async listForPost(postId: number) {
    return this.db
      .select()
      .from(likesSchema.post_like)
      .where(eq(likesSchema.post_like.postId, postId))
      .orderBy(likesSchema.post_like.createdAt);
  }
}
