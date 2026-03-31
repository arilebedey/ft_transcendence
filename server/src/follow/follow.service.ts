import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { eq, and, desc } from 'drizzle-orm';
import { DATABASE_CONNECTION } from '../database/database-connection';
import * as schema from './follow.schema';
import { userData } from '../users/user-data.schema';
import type { AppDatabase } from '../database/database.types';

@Injectable()
export class FollowService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: AppDatabase,
  ) {}

  findAll() {
    return this.db.query.follow.findMany({
      with: {
        follower: { columns: { id: true, name: true } },
        following: { columns: { id: true, name: true } },
      },
      orderBy: (f, { desc }) => [desc(f.createdAt)],
    });
  }

  async getFollowedUserIds(userId: string): Promise<string[]> {
    const follows = await this.db.query.follow.findMany({
      where: (f) => eq(f.followerId, userId),
      columns: { followingId: true },
    });
  
    return [userId, ...follows.map(f => f.followingId)];
  }

  async isFollowing(followerId: string, followingId: string): Promise<boolean> {
    const follow = await this.db.query.follow.findFirst({
      where: and(
        eq(schema.follow.followerId, followerId),
        eq(schema.follow.followingId, followingId)
      ),
      columns: { followerId: true },
    });
    return !!follow;
  }

  async countFollowers(userId: string): Promise<number> {
    const followers = await this.db.query.follow.findMany({
      where: (f) => eq(f.followingId, userId),
      columns: { followerId: true },
    });
    return followers.length;
  }

  async countFollowing(userId: string): Promise<number> {
    const following = await this.db.query.follow.findMany({
      where: (f) => eq(f.followerId, userId),
      columns: { followingId: true },
    });
    return following.length;
  }

  async listFollowers(userId: string) {
    return this.db
      .select({
        id: userData.id,
        name: userData.name,
        bio: userData.bio,
        avatarUrl: userData.avatarUrl,
        followedAt: schema.follow.createdAt,
      })
      .from(schema.follow)
      .innerJoin(userData, eq(schema.follow.followerId, userData.id))
      .where(eq(schema.follow.followingId, userId))
      .orderBy(desc(schema.follow.createdAt));
  }

  async listFollowing(userId: string) {
    return this.db
      .select({
        id: userData.id,
        name: userData.name,
        bio: userData.bio,
        avatarUrl: userData.avatarUrl,
        followedAt: schema.follow.createdAt,
      })
      .from(schema.follow)
      .innerJoin(userData, eq(schema.follow.followingId, userData.id))
      .where(eq(schema.follow.followerId, userId))
      .orderBy(desc(schema.follow.createdAt));
  }

  async create(followerId: string, followingId: string) {
    if (followerId === followingId) {
      throw new ForbiddenException('You cannot follow yourself');
    }

    try {
      await this.db.insert(schema.follow).values({ followerId, followingId });

      return this.db.query.follow.findFirst({
        where: and(
            eq(schema.follow.followerId, followerId),
            eq(schema.follow.followingId, followingId)
          ),
        with: {
          follower: { columns: { id: true, name: true } },
          following: { columns: { id: true, name: true } },
        },
      });
    } catch (err: any) {
      if (err.code === '23505') {
        throw new ForbiddenException('You are already following this user');
      }
      throw err;
    }
  }

  async delete(followerId: string, followingId: string) {
    const [deleted] = await this.db
    .delete(schema.follow)
    .where(
      and(
        eq(schema.follow.followerId, followerId),
        eq(schema.follow.followingId, followingId)
      )
    )
    .returning();

    if (!deleted) throw new NotFoundException('Follow not found');
    return deleted;
  }
}
