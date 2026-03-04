import { Body, Controller, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { LikesService } from './likes.service';
import { GetUser } from 'src/auth/get-user.decorator';
import type { AuthUser } from 'src/auth/auth.types';
import { ToggleLikeDto } from './dto/toggle-like.dto';

@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post('toggle')
  toggle(@Body() dto: ToggleLikeDto, @GetUser() user: AuthUser) {
    return this.likesService.toggle(dto.postId, user.id);
  }

  @Get('post/:id/count')
  count(@Param('id', ParseIntPipe) id: number) {
    return this.likesService.countForPost(id);
  }

  @Get('post/:id/is-liked')
  isLiked(@Param('id', ParseIntPipe) id: number, @GetUser() user: AuthUser) {
    return this.likesService.isLikedBy(id, user.id);
  }

  @Get('post/:id')
  list(@Param('id', ParseIntPipe) id: number, @Query('limit') limit?: string) {
    const l = limit ? parseInt(limit, 10) : undefined;
    return this.likesService.listForPost(id, l);
  }
}
