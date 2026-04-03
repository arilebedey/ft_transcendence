import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { CustomLogger } from '../utils/custom-logger';
import { Inject } from '@nestjs/common';
import { eq, and, desc } from 'drizzle-orm';
import { DATABASE_CONNECTION } from '../database/database-connection';
import * as schema from './follow.schema';
import { userData } from '../users/user-data.schema';
import type { AppDatabase } from '../database/database.types';
import { UserDataService } from '../users/user-data.service';

@Injectable()
export class FollowService {
  private readonly logger = new CustomLogger(FollowService.name);

  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: AppDatabase,
    private readonly userDataService: UserDataService,
  ) {}

  private async resolveUser(
    userId: string,
  ): Promise<{ name: string; profileUrl: string }> {
    try {
      const user = await this.userDataService.get(userId);
      return {
        name: user.name ?? userId,
        profileUrl: `http://localhost:5173/profile/${user.name}`,
      };
    } catch {
      return { name: userId, profileUrl: '' };
    }
  }

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

    return [userId, ...follows.map((f) => f.followingId)];
  }

  async isFollowing(followerId: string, followingId: string): Promise<boolean> {
    const follow = await this.db.query.follow.findFirst({
      where: and(
        eq(schema.follow.followerId, followerId),
        eq(schema.follow.followingId, followingId),
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
      const u = await this.resolveUser(followerId);
      this.logger.warn(`[SECURITY] ${u.name} attempted to follow themselves`);
      this.logger.event('security.self_follow_attempt', {
        userId: followerId,
        userName: u.name,
        userProfileUrl: u.profileUrl,
        severity: 'medium',
      });
      throw new ForbiddenException('You cannot follow yourself');
    }

    try {
      await this.db.insert(schema.follow).values({ followerId, followingId });

      return this.db.query.follow
        .findFirst({
          where: and(
            eq(schema.follow.followerId, followerId),
            eq(schema.follow.followingId, followingId),
          ),
          with: {
            follower: { columns: { id: true, name: true } },
            following: { columns: { id: true, name: true } },
          },
        })
        .then(async (result) => {
          const [follower, following] = await Promise.all([
            this.resolveUser(followerId),
            this.resolveUser(followingId),
          ]);
          this.logger.log(`${follower.name} followed ${following.name}`);
          this.logger.event('user.followed', {
            followerId,
            followerName: follower.name,
            followerProfileUrl: follower.profileUrl,
            followingId,
            followingName: following.name,
            followingProfileUrl: following.profileUrl,
          });
          return result;
        });
    } catch (err: any) {
      if (err.code === '23505') {
        const [follower, following] = await Promise.all([
          this.resolveUser(followerId),
          this.resolveUser(followingId),
        ]);
        this.logger.warn(
          `[SECURITY] ${follower.name} tried to follow ${following.name} again (already following)`,
        );
        this.logger.event('security.duplicate_follow_attempt', {
          followerId,
          followerName: follower.name,
          followingId,
          followingName: following.name,
          severity: 'low',
        });
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
          eq(schema.follow.followingId, followingId),
        ),
      )
      .returning();

    if (!deleted) throw new NotFoundException('Follow not found');
    const [follower, following] = await Promise.all([
      this.resolveUser(followerId),
      this.resolveUser(followingId),
    ]);
    this.logger.log(`${follower.name} unfollowed ${following.name}`);
    this.logger.event('user.unfollowed', {
      followerId,
      followerName: follower.name,
      followerProfileUrl: follower.profileUrl,
      followingId,
      followingName: following.name,
      followingProfileUrl: following.profileUrl,
    });
    return deleted;
  }
}
