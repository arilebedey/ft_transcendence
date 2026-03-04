import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DATABASE_CONNECTION } from '../database/database-connection';
import * as likesSchema from './likes.schema';
import * as postsSchema from '../posts/posts.schema';

@Injectable()
export class LikesService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: NodePgDatabase<any>,
  ) {}

  async countForPost(postId: number) {
    const rows = await this.db.query.postLike.findMany({
      where: eq(likesSchema.post_like.postId, postId),
    });
    return rows.length;
  }

  async isLikedBy(postId: number, userId: string) {
    const found = await this.db.query.postLike.findFirst({
      where: (postLike, { and }) => and(eq(likesSchema.post_like.postId, postId), eq(likesSchema.post_like.userId, userId)),
    });
    return !!found;
  }

  async toggle(postId: number, userId: string) {
    // ensure post exists
    const post = await this.db.query.post.findFirst({ where: eq(postsSchema.post.id, postId) });
    if (!post) {
      throw new NotFoundException(`Post #${postId} not found`);
    }
    // Optimistic lock-free approach: attempt INSERT, on unique-violation delete existing (toggle)
    try {
      const [inserted] = await this.db.insert(likesSchema.post_like).values({ postId, userId }).returning();
      if (inserted) {
        await this.db.update(postsSchema.post).set({ likes: (post.likes || 0) + 1 }).where(eq(postsSchema.post.id, postId));
        return { liked: true };
      }
    } catch (err: any) {
      // Postgres unique violation code
      if (err?.code === '23505') {
        // Already exists -> treat as unlike: delete the existing like
        const [deleted] = await this.db
          .delete(likesSchema.post_like)
          .where((pl, { and }) => and(eq(likesSchema.post_like.postId, postId), eq(likesSchema.post_like.userId, userId)))
          .returning();
        if (deleted) {
          await this.db.update(postsSchema.post).set({ likes: Math.max(0, (post.likes || 0) - 1) }).where(eq(postsSchema.post.id, postId));
        }
        return { liked: false };
      }
      throw err;
    }

    // Fallback: if insert did not throw and returned nothing, consider it not liked
    return { liked: false };
  }

  async listForPost(postId: number, limit = 20) {
    return this.db.query.postLike.findMany({
      where: eq(likesSchema.post_like.postId, postId),
      limit,
      orderBy: (pl, { desc }) => [desc(pl.createdAt)],
      with: {
        user: {
          columns: {
            id: true,
            name: true,
          },
        },
      },
    });
  }
}
