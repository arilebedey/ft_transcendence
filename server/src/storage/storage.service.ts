import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import * as Minio from 'minio';
import { extname } from 'path';

const BUCKET = 'profile-pictures';
const ALLOWED_MIMES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private readonly client: Minio.Client;

  constructor() {
    this.client = new Minio.Client({
      endPoint: process.env.MINIO_ENDPOINT || 'localhost',
      port: Number(process.env.MINIO_PORT) || 9000,
      useSSL: false,
      accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
      secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
    });
  }

  /**
   * Upload a profile picture to MinIO.
   * Returns the object key (filename) stored in the bucket.
   */
  async uploadAvatar(
    userId: string,
    file: Express.Multer.File,
  ): Promise<string> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    if (!ALLOWED_MIMES.includes(file.mimetype)) {
      throw new BadRequestException(
        `Invalid file type: ${file.mimetype}. Allowed: ${ALLOWED_MIMES.join(', ')}`,
      );
    }

    if (file.size > MAX_SIZE) {
      throw new BadRequestException(
        `File too large: ${file.size} bytes. Max: ${MAX_SIZE} bytes (5 MB)`,
      );
    }

    const ext = extname(file.originalname) || '.jpg';
    const objectName = `${userId}-${Date.now()}${ext}`;

    await this.client.putObject(BUCKET, objectName, file.buffer, file.size, {
      'Content-Type': file.mimetype,
    });

    this.logger.log(`Uploaded avatar for user ${userId}: ${objectName}`);
    return objectName;
  }

  /**
   * Delete an avatar from MinIO by its object key.
   */
  async deleteAvatar(objectName: string): Promise<void> {
    try {
      await this.client.removeObject(BUCKET, objectName);
      this.logger.log(`Deleted avatar: ${objectName}`);
    } catch (error) {
      this.logger.warn(`Failed to delete avatar ${objectName}: ${error}`);
    }
  }
}
