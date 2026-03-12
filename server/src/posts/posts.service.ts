import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { eq, inArray } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DATABASE_CONNECTION } from '../database/database-connection';
import { FollowService } from '../follow/follow.service';

import * as schema from './posts.schema';

import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';


@Injectable()
export class PostsService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: NodePgDatabase<typeof schema>,
    private readonly followService: FollowService,

  ) {}

  findAll() {
    return this.db.query.post.findMany({
      with: {
        author: {
          columns: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: (post, { desc }) => [desc(post.createdAt)],
    });
  }

  async findOne(id: number) {
    const post = await this.db.query.post.findFirst({
      where: eq(schema.post.id, id),
    });

    if (!post) {
      throw new NotFoundException(`Post #${id} not found`);
    }

    return post;
  }

  async getFeed(userId: string) {
    const ids = await this.followService.getFollowedUserIds(userId);

    return this.db.query.post.findMany({
      where: (post) => inArray(post.userId, ids),
      with: {
        author: { columns: { id: true, name: true } },
      },
      orderBy: (post, { desc }) => [desc(post.createdAt)],
    });
  }

  async getPostsByUser(userId: string, filter: 'recent' | 'oldest' | 'most_liked' = 'recent') {
    let orderBy;
    if (filter === 'recent') orderBy = (p, { desc }) => [desc(p.createdAt)];
    else if (filter === 'oldest') orderBy = (p, { asc }) => [asc(p.createdAt)];
    else if (filter === 'most_liked') orderBy = (p, { desc }) => [desc(p.likes)];
  
    return this.db.query.post.findMany({
      where: (p) => eq(p.userId, userId),
      with: {
        author: { columns: { id: true, name: true } },
      },
      orderBy,
    });
  }

  async create(createPostDto: CreatePostDto, userId: string) {
    const [created] = await this.db
      .insert(schema.post)
      .values({ ...createPostDto, userId })
      .returning();

    return this.db.query.post.findFirst({
      where: eq(schema.post.id, created.id),
      with: {
        author: {
          columns: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async update(id: number, updatePostDto: UpdatePostDto, userId: string) {
    const post = await this.findOne(id);

    if (post.userId !== userId) {
      throw new ForbiddenException('You do not own this post');
    }

    const [updated] = await this.db
      .update(schema.post)
      .set(updatePostDto)
      .where(eq(schema.post.id, id))
      .returning();

    return updated;
  }

  async delete(id: number, userId: string) {
    const post = await this.findOne(id);

    if (post.userId !== userId) {
      throw new ForbiddenException('You do not own this post');
    }

    const [deleted] = await this.db
      .delete(schema.post)
      .where(eq(schema.post.id, id))
      .returning();

    return deleted;
  }
}
