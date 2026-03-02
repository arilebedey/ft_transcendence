import { Controller, Get, Post, Delete, Body, UseGuards } from '@nestjs/common';
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

  @Post()
  create(@Body() createFollowDto: CreateFollowDto, @GetUser() user: AuthUser) {
    return this.followService.create(user.id, createFollowDto.followedId);
  }

  @Delete()
  delete(@Body() createFollowDto: CreateFollowDto, @GetUser() user: AuthUser) {
    return this.followService.delete(user.id, createFollowDto.followedId);
  }
}