import { Inject, Injectable, Logger } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DATABASE_CONNECTION } from 'src/database/database-connection';
import { userData } from './user-data.schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class UserDataService {
  private readonly logger = new Logger(UserDataService.name);

  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: NodePgDatabase<Record<string, unknown>>,
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
      throw new Error(msg);
    }

    return existing[0];
  }
}
