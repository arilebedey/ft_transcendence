import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DATABASE_CONNECTION } from '../database/database-connection';
import * as schema from './posts.schema';

@Injectable()
export class PostsService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  findAll() {
    // TODO: implement fetching all posts, sorted by creation date && relation with the current user
    return this.db.query.post.findMany();
  }

  findOne(id: string) {
    // TODO: implement fetching a single post by id
    return this.db.query.post.findFirst({
      where: eq(schema.post.id, Number(id)),
    });
  }

  create(createPostDto: any) {
    // TODO: implement post creation
    return this.db.insert(schema.post).values(createPostDto).returning();
  }

  update(id: string, updatePostDto: any) {
    // TODO: implement post update
    return this.db
      .update(schema.post)
      .set(updatePostDto)
      .where(eq(schema.post.id, Number(id)))
      .returning();
  }

  delete(id: string) {
    // TODO: implement post deletion
    return this.db.delete(schema.post).where(eq(schema.post.id, Number(id))).returning();
  }
}
