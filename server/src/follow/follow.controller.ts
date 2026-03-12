import { Controller, Get, Post, Delete, Body, UseGuards, Param } from '@nestjs/common';
import { FollowService } from './follow.service';
import { GetUser } from 'src/auth/get-user.decorator';
import type { AuthUser } from 'src/auth/auth.types';
import { CreateFollowDto } from './dto/create-follow.dto';
import { AuthGuard } from '@thallesp/nestjs-better-auth';

@UseGuards(AuthGuard)
@Controller('follows')
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @Get()
  findAll() {
    return this.followService.findAll();
  }

  @Get('followed')
  getFollowed(@GetUser() user: AuthUser) {
    return this.followService.getFollowedUserIds(user.id);
  }

  @Get(':id/is-following')
  async isFollowing(@Param('id') followingId: string, @GetUser() user: AuthUser) {
    return { isFollowing: await this.followService.isFollowing(user.id, followingId) };
  }

  @Get(':id/stats')
  async getStats(@Param('id') userId: string) {
    const followers = await this.followService.countFollowers(userId);
    const following = await this.followService.countFollowing(userId);

    return { followers, following };
  }

  @Post()
  create(@Body() createFollowDto: CreateFollowDto, @GetUser() user: AuthUser) {
    return this.followService.create(user.id, createFollowDto.followingId);
  }

  @Delete()
  delete(@Body() createFollowDto: CreateFollowDto, @GetUser() user: AuthUser) {
    return this.followService.delete(user.id, createFollowDto.followingId);
  }
}