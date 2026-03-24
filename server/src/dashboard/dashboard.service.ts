import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { sql, eq, and, desc, count } from 'drizzle-orm';
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
    const result = await this.db.execute(sql`
      SELECT 
        DATE(pl.created_at)::TEXT as date,
        COUNT(*) as likes
      FROM post_like pl
      JOIN post p ON pl.post_id = p.id
      WHERE p.user_id = ${userId}
        AND pl.created_at >= NOW() - INTERVAL '30 days'
      GROUP BY DATE(pl.created_at)
      ORDER BY DATE(pl.created_at) ASC
    `);

    return (result.rows as any[]).map((row) => ({
      date: row.date,
      likes: parseInt(row.likes) || 0,
    }));
  }

  /**
   * Get followers count over time grouped by day
   * Shows cumulative follower count at each point in time
   * Returns last 30 days of data
   */
  async getFollowersOverTime(userId: string): Promise<FollowersOverTime[]> {
    // Get all follow events for this user in the last 30 days
    const result = await this.db.execute(sql`
      WITH follow_timeline AS (
        SELECT 
          DATE(f.created_at)::TEXT as date,
          COUNT(*) OVER (ORDER BY DATE(f.created_at)) as cumulative_followers
        FROM follow f
        WHERE f.following_id = ${userId}
          AND f.created_at >= NOW() - INTERVAL '30 days'
        GROUP BY DATE(f.created_at)
      )
      SELECT DISTINCT date, cumulative_followers as followers
      FROM follow_timeline
      ORDER BY date ASC
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
   * Calculates total likes from post_like table instead of static column
   */
  async getUserStats(userId: string) {
    // Total likes on user's posts (count from post_like table)
    const likesRes = await this.db.execute(sql`
      SELECT COUNT(*) as total
      FROM post_like pl
      JOIN post p ON pl.post_id = p.id
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
