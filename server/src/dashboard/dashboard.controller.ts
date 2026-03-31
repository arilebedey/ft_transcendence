import { Controller, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { GetUser } from '../auth/get-user.decorator';
import type { AuthUser } from '../auth/auth.types';
import { DashboardService, type LikesOverTime, type FollowersOverTime, type PostLikesData } from './dashboard.service';
// import { AuthGuard } from '@thallesp/nestjs-better-auth';

// @UseGuards(AuthGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  /**
   * GET /dashboard/account-likes
   * Get the user's account likes evolution over time
   */
  @Get('account-likes')
  async getAccountLikes(@GetUser() user: AuthUser): Promise<LikesOverTime[]> {
    return this.dashboardService.getAccountLikesOverTime(user.id);
  }

  /**
   * GET /dashboard/followers
   * Get the user's followers evolution over time
   */
  @Get('followers')
  async getFollowers(@GetUser() user: AuthUser): Promise<FollowersOverTime[]> {
    return this.dashboardService.getFollowersOverTime(user.id);
  }

  /**
   * GET /dashboard/post/:postId
   * Get likes evolution for a specific post
   */
  @Get('post/:postId')
  async getPostLikes(@Param('postId', ParseIntPipe) postId: number): Promise<PostLikesData[]> {
    return this.dashboardService.getPostLikesOverTime(postId);
  }

  /**
   * GET /dashboard/posts
   * Get all posts by the user (for dropdown selection)
   */
  @Get('posts')
  async getUserPosts(@GetUser() user: AuthUser) {
    return this.dashboardService.getUserPosts(user.id);
  }

  /**
   * GET /dashboard/stats
   * Get overall user statistics
   */
  @Get('stats')
  async getUserStats(@GetUser() user: AuthUser) {
    return this.dashboardService.getUserStats(user.id);
  }
}
