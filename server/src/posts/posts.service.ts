import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DATABASE_CONNECTION } from '../database/database-connection';
import * as schema from './posts.schema';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  findAll() {
    return this.db.query.post.findMany({ orderBy: (post, { desc }) => [desc(post.createdAt)] });
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

  create(createPostDto: CreatePostDto, userId: string) {
    return this.db
      .insert(schema.post)
      .values({ ...createPostDto, userId })
      .returning();
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
