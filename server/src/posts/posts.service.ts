import { ForbiddenException, Inject, Logger, Injectable, NotFoundException } from '@nestjs/common';
import { eq, ilike, inArray, or, and} from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DATABASE_CONNECTION } from '../database/database-connection';
import { FollowService } from '../follow/follow.service';
import { LikesService } from '../likes/likes.service';
import { UserDataService } from '../users/user-data.service';

import * as schema from './posts.schema';

import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';


@Injectable()
export class PostsService {
  private readonly logger = new Logger(PostsService.name);

  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: NodePgDatabase<typeof schema>,
    private readonly followService: FollowService,
    private readonly likesService: LikesService,
    private readonly UserDataService: UserDataService,

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

    const posts = await this.db.query.post.findMany({
      where: (post) => inArray(post.userId, ids),
      with: {
        author: { columns: { id: true, name: true } },
      },
      orderBy: (post, { desc }) => [desc(post.createdAt)],
    });

    const postsComplete = await Promise.all(
      posts.map(async (post) => ({
        ...post,
        liked: await this.likesService.isLikedByUser(post.id, userId),
        author: post.author,
      }))
    );

    return postsComplete;
  }

  async getPostsByUser(userId: string, currentUserId: string, filter: 'recent' | 'oldest' | 'most_liked' = 'recent') {
    let orderBy;
    if (filter === 'recent') orderBy = (p, { desc }) => [desc(p.createdAt)];
    else if (filter === 'oldest') orderBy = (p, { asc }) => [asc(p.createdAt)];
    else if (filter === 'most_liked') orderBy = (p, { desc }) => [desc(p.likes)];
  
    const posts  = await this.db.query.post.findMany({
      where: (p) => eq(p.userId, userId),
      with: {
        author: { columns: { id: true, name: true } },
      },
      orderBy,
    });

    const postsComplete = await Promise.all(
      posts.map(async (post) => ({
        ...post,
        liked: await this.likesService.isLikedByUser(post.id, currentUserId),
      }))
    );

    return postsComplete;
  }

  async create(createPostDto: CreatePostDto, userId: string) {
    const [created] = await this.db
      .insert(schema.post)
      .values({ ...createPostDto, userId })
      .returning();
<<<<<<< HEAD

    return this.db.query.post.findFirst({
=======
    const post = await this.db.query.post.findFirst({
>>>>>>> b80e326 (feat(logging): added aditional logs for the posts management)
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
<<<<<<< HEAD
=======

    if (!post) {
      this.logger.warn(
        `Created post #${created.id} by user ${userId}, but failed to reload it with author details`,
      );
      return null;
    }

    this.logger.log(`Created post #${created.id} by user ${userId}`);
    return post;
>>>>>>> b80e326 (feat(logging): added aditional logs for the posts management)
  }

  async update(id: number, updatePostDto: UpdatePostDto, userId: string) {
    const post = await this.findOne(id);

    if (post.userId !== userId) {
      this.logger.warn(
        `User ${userId} attempted to update post #${id} owned by ${post.userId}`,
      );
      throw new ForbiddenException('You do not own this post');
    }

    const [updated] = await this.db
      .update(schema.post)
      .set(updatePostDto)
      .where(eq(schema.post.id, id))
      .returning();
<<<<<<< HEAD

=======
    this.logger.log(`Updated post #${id} by user ${userId}`);
>>>>>>> b80e326 (feat(logging): added aditional logs for the posts management)
    return updated;
  }

  async delete(id: number, userId: string) {
    const post = await this.findOne(id);

    if (post.userId !== userId) {
      this.logger.warn(
        `User ${userId} attempted to delete post #${id} owned by ${post.userId}`,
      );
      throw new ForbiddenException('You do not own this post');
    }

    const [deleted] = await this.db
      .delete(schema.post)
      .where(eq(schema.post.id, id))
      .returning();
<<<<<<< HEAD

=======
    this.logger.log(`Deleted post #${id} by user ${userId}`);
>>>>>>> b80e326 (feat(logging): added aditional logs for the posts management)
    return deleted;
  }

  private async buildUserFilter(userTokens: string[]) {
    if (userTokens.length === 0) return null;
    const users = await this.UserDataService.findByNames(userTokens);
    const userIds = users.map(u => u.id);
    if (userIds.length === 0) return null;
    return inArray(schema.post.userId, userIds);
  }
  
  private buildKeywordFilter(keywordTokens: string[]) {
    if (keywordTokens.length === 0) return null;
    return or(
      ...keywordTokens.map(kw => ilike(schema.post.content, `%${kw}%`))
    );
  }
  
  private combineFilters(userFilter: any, keywordFilter: any) {
    if (userFilter && keywordFilter) return and(userFilter, keywordFilter);
    return userFilter || keywordFilter || null;
  }

  private parseSearchQuery(q: string) {
    const tokens = q.trim().split(/\s+/);
  
    const userTokens = tokens
      .filter((t) => t.startsWith("@"))
      .map((t) => t.slice(1).toLowerCase())
      .filter((t) => t.length > 0);
  
    const keywordTokens = tokens
      .filter((t) => !t.startsWith("@"))
      .map((t) => t.toLowerCase());
  
    return { userTokens, keywordTokens };
  }

  private async buildSearchQuery(
    userTokens: string[],
    keywordTokens: string[],
    filter: 'recent' | 'oldest' | 'most_liked'
  ) {
    const userFilter = await this.buildUserFilter(userTokens);
    const keywordFilter = this.buildKeywordFilter(keywordTokens);
    const whereFilter = this.combineFilters(userFilter, keywordFilter);
  
    if (!whereFilter) return [];
  
    return this.db.query.post.findMany({
      columns: {
        id: true,
        content: true,
        link: true,
        createdAt: true,
        likes: true,
        userId: true,
      },
      with: {
        author: { columns: { id: true, name: true } },
      },
      where: whereFilter,
      orderBy: (post, { desc, asc }) => {
        switch (filter) {
          case 'recent':
            return [desc(post.createdAt)];
          case 'oldest':
            return [asc(post.createdAt)];
          case 'most_liked':
            return [desc(post.likes)];
        }
      },
    });
  }

  async searchPosts(
    q: string,
    currentUserId: string,
    filter: 'recent' | 'oldest' | 'most_liked',
  ) {
    if (!q) return this.getFeed(currentUserId);

    const { userTokens, keywordTokens } = this.parseSearchQuery(q);

    const query = await this.buildSearchQuery(userTokens, keywordTokens, filter);
    const rows = await query;

    if (!rows || rows.length === 0) return [];

    const postsComplete = await Promise.all(
      rows.map(async (post) => ({
        ...post,
        liked: await this.likesService.isLikedByUser(post.id, currentUserId),
        author: post.author,
      }))
    );
    return postsComplete;
  }
}
