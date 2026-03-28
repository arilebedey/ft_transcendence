import { Inject, Injectable } from '@nestjs/common';
import { desc, eq, sql } from 'drizzle-orm';
import { DATABASE_CONNECTION } from '../database/database-connection';
import type { AppDatabase } from '../database/database.types';
import { FollowService } from '../follow/follow.service';
import { post_like } from '../likes/likes.schema';
import { LikesService } from '../likes/likes.service';
import { CreatePostDto } from '../posts/dto/create-post.dto';
import { post } from '../posts/posts.schema';
import { PostsService } from '../posts/posts.service';
import { user } from '../auth/better-auth.schema';
import { follow } from '../follow/follow.schema';
import { UserDataService } from '../users/user-data.service';
import { userData } from '../users/user-data.schema';

@Injectable()
export class PublicApiService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: AppDatabase,
    private readonly postsService: PostsService,
    private readonly likesService: LikesService,
    private readonly followService: FollowService,
    private readonly userDataService: UserDataService,
  ) {}

  async listPosts(limit: number, offset: number) {
    const posts = await this.db
      .select({
        id: post.id,
        link: post.link,
        content: post.content,
        createdAt: post.createdAt,
        userId: post.userId,
        likes: post.likes,
        authorId: user.id,
        authorName: user.name,
      })
      .from(post)
      .innerJoin(user, eq(post.userId, user.id))
      .orderBy(desc(post.createdAt))
      .limit(limit)
      .offset(offset);

    return posts.map(({ authorId, authorName, ...postRow }) => ({
      ...postRow,
      author: {
        id: authorId,
        name: authorName,
      },
    }));
  }

  async listLikes(postId: number, limit: number, offset: number) {
    const [countRow] = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(post_like)
      .where(eq(post_like.postId, postId));

    const likes = await this.db
      .select({
        id: post_like.id,
        postId: post_like.postId,
        userId: post_like.userId,
        createdAt: post_like.createdAt,
        userName: userData.name,
        avatarUrl: userData.avatarUrl,
      })
      .from(post_like)
      .innerJoin(userData, eq(post_like.userId, userData.id))
      .where(eq(post_like.postId, postId))
      .orderBy(desc(post_like.createdAt))
      .limit(limit)
      .offset(offset);

    return {
      count: Number(countRow?.count ?? 0),
      likes,
    };
  }

  async listFollowers(username: string, limit: number, offset: number) {
    const user = await this.userDataService.getPublicByName(username);

    const [countRow] = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(follow)
      .where(eq(follow.followingId, user.id));

    const followers = await this.db
      .select({
        id: userData.id,
        name: userData.name,
        avatarUrl: userData.avatarUrl,
        followedAt: follow.createdAt,
      })
      .from(follow)
      .innerJoin(userData, eq(follow.followerId, userData.id))
      .where(eq(follow.followingId, user.id))
      .orderBy(desc(follow.createdAt))
      .limit(limit)
      .offset(offset);

    return {
      userId: user.id,
      username: user.name,
      count: Number(countRow?.count ?? 0),
      followers,
      followingCount: await this.followService.countFollowing(user.id),
    };
  }

  createPost(dto: CreatePostDto, userId: string) {
    return this.postsService.create(dto, userId);
  }

  updatePost(id: number, dto: CreatePostDto, userId: string) {
    return this.postsService.update(id, dto, userId);
  }

  async deletePost(id: number, userId: string) {
    const deleted = await this.postsService.delete(id, userId);
    const likes = await this.likesService.countForPost(id);

    return {
      success: true,
      likes,
      post: deleted,
    };
  }
}
