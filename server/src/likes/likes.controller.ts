import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { IsInt } from 'class-validator';
import { LikesService } from './likes.service';
import { GetUser } from 'src/auth/get-user.decorator';

class ToggleLikeDto {
  @IsInt()
  postId: number;
}

@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Get('post/:id/count')
  async count(@Param('id') id: string) {
    const postId = Number(id);
    const count = await this.likesService.countForPost(postId);
    return { count };
  }

  @Get('post/:id/is-liked')
  async isLiked(@Param('id') id: string, @GetUser() user: any) {
    const postId = Number(id);
    const liked = await this.likesService.isLikedByUser(postId, user?.id);
    return { liked };
  }

  @Get('post/:id')
  async list(@Param('id') id: string) {
    const postId = Number(id);
    const rows = await this.likesService.listForPost(postId);
    return rows;
  }

  @Post('toggle')
  async toggle(@GetUser() user: any, @Body() dto: ToggleLikeDto) {
    const postId = Number(dto.postId);
    const result = await this.likesService.toggleLike(user.id, postId);
    return result;
  }
}
