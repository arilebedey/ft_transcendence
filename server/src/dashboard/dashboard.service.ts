import { Injectable, Inject, NotFoundException } from '@nestjs/common';
<<<<<<< HEAD
import { sql, eq, and, desc, count } from 'drizzle-orm';
=======
import { sql, eq, and, desc } from 'drizzle-orm';
>>>>>>> e4510cd (feature: Dashbaord works fine)
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
<<<<<<< HEAD
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
=======
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
>>>>>>> e4510cd (feature: Dashbaord works fine)
    }));
  }

  /**
   * Get followers count over time grouped by day
<<<<<<< HEAD
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

<<<<<<< HEAD
=======
    // compute cumulative followers
    let cumulative = 0;
    return (rows as any[]).map((row) => {
      cumulative += parseInt(String(row.count)) || 0;
      return { date: row.date, followers: cumulative };
    });
=======
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

>>>>>>> 8610d28 (feature: Dashbaord works fine)
    return (result.rows as any[]).map((row) => ({
      date: row.date,
      followers: parseInt(row.followers) || 0,
    }));
<<<<<<< HEAD
=======
>>>>>>> e4510cd (feature: Dashbaord works fine)
>>>>>>> 8610d28 (feature: Dashbaord works fine)
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

<<<<<<< HEAD
    const rows = await this.db
      .select({ date: sql`DATE(${likesSchema.post_like.createdAt})::TEXT`, likes: sql`COUNT(*)` })
      .from(likesSchema.post_like as any)
      .where(eq(likesSchema.post_like.postId, postId))
      .groupBy(sql`DATE(${likesSchema.post_like.createdAt})`)
      .orderBy(sql`DATE(${likesSchema.post_like.createdAt}) ASC`);

    return (rows as any[]).map((row) => ({
      date: row.date,
      likes: parseInt(String(row.likes)) || 0,
=======
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
>>>>>>> e4510cd (feature: Dashbaord works fine)
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
<<<<<<< HEAD
        link: true,
=======
>>>>>>> e4510cd (feature: Dashbaord works fine)
      },
      orderBy: [desc(postsSchema.post.createdAt)],
      limit: 50,
    });
  }

  /**
   * Get user statistics for dashboard
<<<<<<< HEAD
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
=======
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
>>>>>>> e4510cd (feature: Dashbaord works fine)
    };
  }
}
