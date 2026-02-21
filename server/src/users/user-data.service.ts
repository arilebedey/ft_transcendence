import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { DATABASE_CONNECTION } from 'src/database/database-connection';
import { userData } from './user-data.schema';
import { and, asc, eq, ilike, ne } from 'drizzle-orm';
import { UpdateUserDataDto } from './dto/update-user-data.dto';
import type { AppDatabase } from 'src/database/database.types';

@Injectable()
export class UserDataService {
  private readonly logger = new Logger(UserDataService.name);

  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: AppDatabase,
  ) {}

  async get(userId: string) {
    const existing = await this.db
      .select()
      .from(userData)
      .where(eq(userData.id, userId))
      .limit(1);

    if (existing.length === 0) {
      const msg = `User data not found for userId: ${userId}`;
      this.logger.warn(msg);
      throw new NotFoundException(msg);
    }

    return existing[0];
  }

  async isUsernameAvailable(
    name: string,
    excludeUserId?: string,
  ): Promise<boolean> {
    const result = await this.db
      .select({ id: userData.id })
      .from(userData)
      .where(
        excludeUserId
          ? and(eq(userData.name, name), ne(userData.id, excludeUserId))
          : eq(userData.name, name),
      )
      .limit(1);
    return result.length === 0;
  }

  async search(userId: string, query?: string) {
    const sanitized = query?.trim().slice(0, 50) ?? '';

    const baseQuery = this.db
      .select({
        id: userData.id,
        name: userData.name,
      })
      .from(userData)
      .where(
        sanitized.length > 0
          ? and(ne(userData.id, userId), ilike(userData.name, `%${sanitized}%`))
          : ne(userData.id, userId),
      );

    const results = await baseQuery
      .orderBy(asc(userData.name))
      .limit(sanitized.length > 0 ? 40 : 20);

    return results;
  }

  async update(userId: string, dto: UpdateUserDataDto) {
    if (dto.name) {
      const available = await this.isUsernameAvailable(dto.name, userId);
      if (!available) {
        throw new ConflictException('Username already taken');
      }
    }

    const result = await this.db
      .update(userData)
      .set({ ...dto, updatedAt: new Date() })
      .where(eq(userData.id, userId))
      .returning();

    if (result.length === 0) {
      const msg = `User data not found for userId: ${userId}`;
      this.logger.warn(msg);
      throw new NotFoundException(msg);
    }

    return result[0];
  }

  async updateAvatarUrl(userId: string, avatarUrl: string | null) {
    const result = await this.db
      .update(userData)
      .set({ avatarUrl, updatedAt: new Date() })
      .where(eq(userData.id, userId))
      .returning();

    if (result.length === 0) {
      const msg = `User data not found for userId: ${userId}`;
      this.logger.warn(msg);
      throw new NotFoundException(msg);
    }

    return result[0];
  }

  async getPublicByName(name: string) {
    const result = await this.db
      .select({
        id: userData.id,
        name: userData.name,
        bio: userData.bio,
        avatarUrl: userData.avatarUrl,
        createdAt: userData.createdAt,
      })
      .from(userData)
      .where(eq(userData.name, name))
      .limit(1);

    if (result.length === 0) {
      throw new NotFoundException(`User not found: ${name}`);
    }

    return result[0];
  }
}
