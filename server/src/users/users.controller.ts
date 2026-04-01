import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { GetUser } from 'src/auth/get-user.decorator';
import { UserDataService } from './user-data.service';
import { StorageService } from 'src/storage/storage.service';
import type { AuthUser } from 'src/auth/auth.types';
import { UpdateUserDataDto } from './dto/update-user-data.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly userDataService: UserDataService,
    private readonly storageService: StorageService,
  ) {}

  @Get('me')
  async getMe(@GetUser() user: AuthUser) {
    return this.userDataService.get(user.id);
  }

  @Get('search')
  async search(@GetUser() user: AuthUser, @Query('q') query?: string) {
    return this.userDataService.search(user.id, query);
  }

  @Patch('me')
  async updateMe(@GetUser() user: AuthUser, @Body() dto: UpdateUserDataDto) {
    return this.userDataService.update(user.id, dto);
  }

  @Post('me/avatar')
  @UseInterceptors(
    FileInterceptor('avatar', { limits: { fileSize: 5 * 1024 * 1024 } }),
  )
  async uploadAvatar(
    @GetUser() user: AuthUser,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const currentUser = await this.userDataService.get(user.id);
    if (currentUser.avatarUrl) {
      await this.storageService.deleteAvatar(currentUser.avatarUrl);
    }

    const objectName = await this.storageService.uploadAvatar(user.id, file);

    await this.userDataService.updateAvatarUrl(user.id, objectName);

    return { avatarUrl: objectName };
  }

  @Delete('me/avatar')
  async deleteAvatar(@GetUser() user: AuthUser) {
    const currentUser = await this.userDataService.get(user.id);
    if (currentUser.avatarUrl) {
      await this.storageService.deleteAvatar(currentUser.avatarUrl);
      await this.userDataService.updateAvatarUrl(user.id, null);
    }
    return { avatarUrl: null };
  }

  @AllowAnonymous()
  @Get('check-username/:name')
  async checkUsername(@Param('name') name: string) {
    const available = await this.userDataService.isUsernameAvailable(name);
    return { available };
  }

  /*@Post('me/2fa/generate')
  async generateTwoFactor(@GetUser() user: AuthUser) {
    const { qrCode } = await this.userDataService.generateTwoFactorSecret(user.id);
    return { qrCode };
  }

  @Post('me/2fa/enable')
  async enableTwoFactor(
    @GetUser() user: AuthUser,
    @Body('code') code: string,
  ) {
    const result = await this.userDataService.enableTwoFactor(user.id, code);
    return { twoFactorEnabled: result.twoFactorEnabled };
  }

  @Post('me/2fa/disable')
  async disableTwoFactor(@GetUser() user: AuthUser) {
    const result = await this.userDataService.disableTwoFactor(user.id);

    return { twoFactorEnabled: result.twoFactorEnabled };
  }*/

  @Get('session')
  getSession() {
    return { message: 'Called /users/session endpoint!' };
  }

  @Get(':name')
  async getPublicProfile(@Param('name') name: string) {
    return this.userDataService.getPublicByName(name);
  }

  @Get('id/:id')
  async getPublicProfileById(@Param('id') id: string) {
    return this.userDataService.getPublicById(id);
  }
}
