import {
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { DATABASE_CONNECTION } from 'src/database/database-connection';
import { userData } from './user-data.schema';
import { and, asc, eq, ilike, ne, or, sql } from 'drizzle-orm';
import { UpdateUserDataDto } from './dto/update-user-data.dto';
import type { AppDatabase } from 'src/database/database.types';
//import * as speakeasy from 'speakeasy';

export interface UserSearchResult {
  id: string;
  name: string;
  avatarUrl: string | null;
}

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

  async search(userId: string, query?: string): Promise<UserSearchResult[]> {
    const sanitized = query?.trim().slice(0, 50) ?? '';
    const lowerSanitized = sanitized.toLowerCase();

    const relevanceOrder =
      sanitized.length > 0
        ? sql<number>`
            CASE
              WHEN lower(${userData.name}) = ${lowerSanitized} THEN 0
              WHEN lower(${userData.name}) LIKE ${`${lowerSanitized}%`} THEN 1
              ELSE 2
            END
          `
        : undefined;

    const positionOrder =
      sanitized.length > 0
        ? sql<number>`position(${lowerSanitized} in lower(${userData.name}))` // Plus le nombre est petit, plus la query apparaît tôt dans le nom, donc plus le résultat est pertinent
        : undefined;

    const baseQuery = this.db
      .select({
        id: userData.id,
        name: userData.name,
        avatarUrl: userData.avatarUrl,
      })
      .from(userData)
      .where(
        sanitized.length > 0
          ? and(ne(userData.id, userId), ilike(userData.name, `%${sanitized}%`))
          : ne(userData.id, userId),
      );

    const results =
      sanitized.length > 0
        ? await baseQuery
            .orderBy(relevanceOrder!, positionOrder!, asc(userData.name))
            .limit(40)
        : await baseQuery.orderBy(asc(userData.name)).limit(20);

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

  async getByEmail(email: string) {
    const result = await this.db
      .select()
      .from(userData)
      .where(eq(userData.email, email))
      .limit(1);
  
    if (result.length === 0) {
      const msg = `User not found for email: ${email}`;
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

  async getPublicById(id: string) {
    const result = await this.db
      .select({
        id: userData.id,
        name: userData.name,
        bio: userData.bio,
        avatarUrl: userData.avatarUrl,
        createdAt: userData.createdAt,
      })
      .from(userData)
      .where(eq(userData.id, id))
      .limit(1);
  
    if (result.length === 0) {
      throw new NotFoundException(`User not found with id: ${id}`);
    }
  
    return result[0];
  }

  async findByNames(names: string[]): Promise<{ id: string; name: string }[]> {
    if (!names.length) return [];

    return this.db.query.userData.findMany({
      columns: {
        id: true,
        name: true,
      },
      where: or(...names.map((n) => ilike(userData.name, `%${n}%`))),
    });
  }

  /*async generateTwoFactorSecret(userId: string) {
    const user = await this.db
      .select()
      .from(userData)
      .where(eq(userData.id, userId))
      .limit(1);

    if (user.length === 0) throw new NotFoundException('User not found');

    const secret = speakeasy.generateSecret({
      length: 20,
      name: `Seenit (${user[0].email})`,
    });

    await this.db
      .update(userData)
      .set({ twoFactorTempSecret: secret.base32, updatedAt: new Date() })
      .where(eq(userData.id, userId));

    return { qrCode: secret.otpauth_url };
  }
  
  async disableTwoFactor(userId: string) {
    const result = await this.db
      .update(userData)
      .set({
        twoFactorEnabled: false,
        twoFactorSecret: null,
        updatedAt: new Date(),
      })
      .where(eq(userData.id, userId))
      .returning();
  
    if (result.length === 0) {
      throw new NotFoundException('User not found');
    }
  
    return result[0];
  }

  async enableTwoFactor(userId: string, token: string) {
    const user = await this.db
      .select()
      .from(userData)
      .where(eq(userData.id, userId))
      .limit(1);

    if (user.length === 0) throw new NotFoundException('User not found');

    const tempSecret = user[0].twoFactorTempSecret;
    if (!tempSecret)
      throw new Error('2FA secret not generated yet');

    const verified = speakeasy.totp.verify({
      secret: tempSecret,
      encoding: 'base32',
      token,
    });

    if (!verified) throw new Error('Invalid 2FA code');

    const result = await this.db
      .update(userData)
      .set({
        twoFactorSecret: tempSecret,
        twoFactorEnabled: true,
        twoFactorTempSecret: null,
        updatedAt: new Date(),
      })
      .where(eq(userData.id, userId))
      .returning();

    if (result.length === 0) throw new NotFoundException('User not found');

    return result[0];
  }*/
}
