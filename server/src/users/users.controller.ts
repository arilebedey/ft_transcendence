import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
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

    // Delete old avatar if it exists
    const currentUser = await this.userDataService.get(user.id);
    if (currentUser.avatarUrl) {
      await this.storageService.deleteAvatar(currentUser.avatarUrl);
    }

    // Upload new avatar
    const objectName = await this.storageService.uploadAvatar(user.id, file);

    // Save the object key in DB
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

  @Get('session')
  getSession() {
    return { message: 'Called /users/session endpoint!' };
  }

  @Get(':name')
  async getPublicProfile(@Param('name') name: string) {
    return this.userDataService.getPublicByName(name);
  }
}
