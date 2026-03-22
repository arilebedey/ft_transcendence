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
   * Returns last 30 days of data
   */
  async getAccountLikesOverTime(userId: string): Promise<LikesOverTime[]> {
    const result = await this.db.execute(sql`
      SELECT 
        DATE(p.created_at)::TEXT as date,
        SUM(p.likes) as likes
      FROM post p
      WHERE p.user_id = ${userId}
        AND p.created_at >= NOW() - INTERVAL '30 days'
      GROUP BY DATE(p.created_at)
      ORDER BY DATE(p.created_at) ASC
    `);

    return (result.rows as any[]).map((row) => ({
      date: row.date,
      likes: parseInt(row.likes) || 0,
    }));
  }

  /**
   * Get followers count over time grouped by day
   * Returns last 30 days of data
   */
  async getFollowersOverTime(userId: string): Promise<FollowersOverTime[]> {
    const result = await this.db.execute(sql`
      SELECT 
        DATE(f.created_at)::TEXT as date,
        COUNT(*) as followers
      FROM follow f
      WHERE f.following_id = ${userId}
        AND f.created_at >= NOW() - INTERVAL '30 days'
      GROUP BY DATE(f.created_at)
      ORDER BY DATE(f.created_at) ASC
    `);

    return (result.rows as any[]).map((row) => ({
      date: row.date,
      followers: parseInt(row.followers) || 0,
    }));
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

    const result = await this.db.execute(sql`
      SELECT 
        DATE(pl.created_at)::TEXT as date,
        COUNT(*) as likes
      FROM post_like pl
      WHERE pl.post_id = ${postId}
      GROUP BY DATE(pl.created_at)
      ORDER BY DATE(pl.created_at) ASC
    `);

    return (result.rows as any[]).map((row) => ({
      date: row.date,
      likes: parseInt(row.likes) || 0,
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
      },
      orderBy: [desc(postsSchema.post.createdAt)],
      limit: 50,
    });
  }

  /**
   * Get user statistics for dashboard
   */
  async getUserStats(userId: string) {
    // Total likes on user's posts
    const likesRes = await this.db.execute(sql`
      SELECT SUM(p.likes) as total
      FROM post p
      WHERE p.user_id = ${userId}
    `);

    // Total followers
    const followersRes = await this.db.execute(sql`
      SELECT COUNT(*) as total
      FROM follow f
      WHERE f.following_id = ${userId}
    `);

    // Total posts
    const postsRes = await this.db.execute(sql`
      SELECT COUNT(*) as total
      FROM post p
      WHERE p.user_id = ${userId}
    `);

    const likesCount = (likesRes.rows as any[])[0]?.total;
    const followersCount = (followersRes.rows as any[])[0]?.total;
    const postsCount = (postsRes.rows as any[])[0]?.total;

    return {
      totalLikes: parseInt(likesCount) || 0,
      totalFollowers: parseInt(followersCount) || 0,
      totalPosts: parseInt(postsCount) || 0,
    };
  }
}
