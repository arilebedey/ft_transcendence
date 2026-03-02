import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { eq, and } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DATABASE_CONNECTION } from '../database/database-connection';
import * as schema from './follow.schema';

@Injectable()
export class FollowService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  findAll() {
    return this.db.query.follow.findMany({
      with: {
        follower: { columns: { id: true, name: true } },
        followed: { columns: { id: true, name: true } },
      },
      orderBy: (f, { desc }) => [desc(f.createdAt)],
    });
  }

  async create(followerId: string, followedId: string) {
    if (followerId === followedId) {
      throw new ForbiddenException('You cannot follow yourself');
    }

    try {
      const [created] = await this.db.insert(schema.follow).values({
        followerId,
        followedId,
      }).returning();

      return this.db.query.follow.findFirst({
        where: and(
            eq(schema.follow.followerId, followerId),
            eq(schema.follow.followedId, followedId)
          ),
        with: {
          follower: { columns: { id: true, name: true } },
          followed: { columns: { id: true, name: true } },
        },
      });
    } catch (err: any) {
      if (err.code === '23505') {
        throw new ForbiddenException('You are already following this user');
      }
      throw err;
    }
  }

  async delete(followerId: string, followedId: string) {
    const [deleted] = await this.db
    .delete(schema.follow)
    .where(
      and(
        eq(schema.follow.followerId, followerId),
        eq(schema.follow.followedId, followedId)
      )
    )
    .returning();

    if (!deleted) throw new NotFoundException('Follow not found');
    return deleted;
  }
}