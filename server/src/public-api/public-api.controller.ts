import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { GetUser } from '../auth/get-user.decorator';
import type { AuthUser } from '../auth/auth.types';
import { CreatePostDto } from '../posts/dto/create-post.dto';
import { GetPublicFollowersQueryDto } from './dto/get-public-followers-query.dto';
import { GetPublicLikesQueryDto } from './dto/get-public-likes-query.dto';
import { ListPublicPostsQueryDto } from './dto/list-public-posts-query.dto';
import { PublicApiKeyGuard } from './public-api-key.guard';
import { PublicApiService } from './public-api.service';

@AllowAnonymous()
@UseGuards(PublicApiKeyGuard)
@Controller('public')
export class PublicApiController {
  constructor(private readonly publicApiService: PublicApiService) {}

  @Get('posts')
  listPosts(@Query() query: ListPublicPostsQueryDto) {
    return this.publicApiService.listPosts(query.limit, query.offset);
  }

  @Get('likes')
  listLikes(@Query() query: GetPublicLikesQueryDto) {
    return this.publicApiService.listLikes(
      query.postId,
      query.limit,
      query.offset,
    );
  }

  @Get('followers')
  listFollowers(@Query() query: GetPublicFollowersQueryDto) {
    return this.publicApiService.listFollowers(
      query.username,
      query.limit,
      query.offset,
    );
  }

  @Post('posts')
  createPost(@Body() dto: CreatePostDto, @GetUser() user: AuthUser) {
    return this.publicApiService.createPost(dto, user.id);
  }

  @Put('posts/:id')
  updatePost(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreatePostDto,
    @GetUser() user: AuthUser,
  ) {
    return this.publicApiService.updatePost(id, dto, user.id);
  }

  @Delete('posts/:id')
  deletePost(@Param('id', ParseIntPipe) id: number, @GetUser() user: AuthUser) {
    return this.publicApiService.deletePost(id, user.id);
  }
}
