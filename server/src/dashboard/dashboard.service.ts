import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { sql, eq, and, desc } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DATABASE_CONNECTION } from '../database/database-connection';
import type { AppDatabase } from '../database/database.types';
import * as postsSchema from '../posts/posts.schema';
import * as likesSchema from '../likes/likes.schema';
import * as followSchema from '../follow/follow.schema';

export interface LikesOverTime {
  date: string;
  likes: number;
}

export interface FollowersOverTime {
  date: string;
  followers: number;
}

export interface PostLikesData {
  date: string;
  likes: number;
}

@Injectable()
export class DashboardService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: AppDatabase,
  ) {}

  /**
   * Get account likes over time grouped by day
   * Uses post_like table to count actual likes with timestamps
   * Returns last 30 days of data
   */
  async getAccountLikesOverTime(userId: string): Promise<LikesOverTime[]> {
    const rows = await this.db
      .select({ date: sql`DATE(${likesSchema.post_like.createdAt})::TEXT`, likes: sql`COUNT(*)` })
      .from(likesSchema.post_like as any)
      .innerJoin(postsSchema.post, eq(postsSchema.post.id, likesSchema.post_like.postId))
      .where(
        and(
          eq(postsSchema.post.userId, userId),
          sql`${likesSchema.post_like.createdAt} >= NOW() - INTERVAL '30 days'`
        )
      )
      .groupBy(sql`DATE(${likesSchema.post_like.createdAt})`)
      .orderBy(sql`DATE(${likesSchema.post_like.createdAt}) ASC`);

    return (rows as any[]).map((row) => ({
      date: row.date,
      likes: parseInt(String(row.likes)) || 0,
    }));
  }

  /**
   * Get followers count over time grouped by day
   * Shows cumulative follower count at each point in time
   * Returns last 30 days of data
   */
  async getFollowersOverTime(userId: string): Promise<FollowersOverTime[]> {
    // Get daily follow counts for this user in the last 30 days, then compute cumulative in JS
    const rows = await this.db
      .select({ date: sql`DATE(${followSchema.follow.createdAt})::TEXT`, count: sql`COUNT(*)` })
      .from(followSchema.follow as any)
      .where(
        and(
          sql`${followSchema.follow.createdAt} >= NOW() - INTERVAL '30 days'`,
          eq(followSchema.follow.followingId, userId)
        )
      )
      .groupBy(sql`DATE(${followSchema.follow.createdAt})`)
      .orderBy(sql`DATE(${followSchema.follow.createdAt}) ASC`);

    // compute cumulative followers
    let cumulative = 0;
    return (rows as any[]).map((row) => {
      cumulative += parseInt(String(row.count)) || 0;
      return { date: row.date, followers: cumulative };
    });
  }

  /**
   * Get likes evolution for a specific post grouped by day
   * Returns data for the lifetime of the post
   */
  async getPostLikesOverTime(postId: number): Promise<PostLikesData[]> {
    // First verify the post exists
    const post = await this.db.query.post.findFirst({
      where: eq(postsSchema.post.id, postId),
    });

    if (!post) {
      throw new NotFoundException(`Post #${postId} not found`);
    }

    const rows = await this.db
      .select({ date: sql`DATE(${likesSchema.post_like.createdAt})::TEXT`, likes: sql`COUNT(*)` })
      .from(likesSchema.post_like as any)
      .where(eq(likesSchema.post_like.postId, postId))
      .groupBy(sql`DATE(${likesSchema.post_like.createdAt})`)
      .orderBy(sql`DATE(${likesSchema.post_like.createdAt}) ASC`);

    return (rows as any[]).map((row) => ({
      date: row.date,
      likes: parseInt(String(row.likes)) || 0,
    }));
  }

  /**
   * Get all posts by a user for the dropdown
   */
  async getUserPosts(userId: string) {
    return this.db.query.post.findMany({
      where: eq(postsSchema.post.userId, userId),
      columns: {
        id: true,
        content: true,
        link: true,
      },
      orderBy: [desc(postsSchema.post.createdAt)],
      limit: 50,
    });
  }

  /**
   * Get user statistics for dashboard
   * Calculates total likes from post_like table instead of static column
   */
  async getUserStats(userId: string) {
    const likesRow = await this.db
      .select({ total: sql`COUNT(*)` })
      .from(likesSchema.post_like as any)
      .innerJoin(postsSchema.post, eq(postsSchema.post.id, likesSchema.post_like.postId))
      .where(eq(postsSchema.post.userId, userId))
      .limit(1);

    const followersRow = await this.db
      .select({ total: sql`COUNT(*)` })
      .from(followSchema.follow as any)
      .where(eq(followSchema.follow.followingId, userId))
      .limit(1);

    const postsRow = await this.db
      .select({ total: sql`COUNT(*)` })
      .from(postsSchema.post as any)
      .where(eq(postsSchema.post.userId, userId))
      .limit(1);

    const likesCount = Number((likesRow as any[])[0]?.total) || 0;
    const followersCount = Number((followersRow as any[])[0]?.total) || 0;
    const postsCount = Number((postsRow as any[])[0]?.total) || 0;

    return {
      totalLikes: likesCount,
      totalFollowers: followersCount,
      totalPosts: postsCount,
    };
  }
}
