import { Injectable } from '@nestjs/common';

@Injectable()
export class PostsService {
  findAll() {
    // TODO: implement fetching all posts, sorted by creation date && relation with the current usrer
    return [];
  }

  findOne(id: string) {
    // TODO: implement fetching a single post by id
    return { id };
  }

  create(createPostDto: any) {
    // TODO: implement post creation
    return createPostDto;
  }

  update(id: string, updatePostDto: any) {
    // TODO: implement post update
    return { id, ...updatePostDto };
  }

  delete(id: string) {
    // TODO: implement post deletion
    return { deleted: true, id };
  }
}
