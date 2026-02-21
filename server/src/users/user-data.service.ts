import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { DATABASE_CONNECTION } from 'src/database/database-connection';
import { userData } from './user-data.schema';
import { eq } from 'drizzle-orm';
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

  async update(userId: string, dto: UpdateUserDataDto) {
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
}
