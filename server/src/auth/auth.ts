import 'dotenv/config';
import { apiKey } from '@better-auth/api-key';
import { betterAuth } from 'better-auth';
import argon2 from 'argon2';
import { APIError, createAuthMiddleware } from 'better-auth/api';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { userData } from '../users/user-data.schema';
import { fallbackUsername, normalizeUsername } from './username.utils';

// auth.ts is for Better Auth CLI loading, it is used when generating better-auth schema
// npx auth@latest generate --config src/auth/auth.ts --output src/auth/better-auth.schema.ts --yes

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT ? Number(process.env.POSTGRES_PORT) : 5432,
  database: process.env.POSTGRES_DB,
});

const database = drizzle(pool);

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
  throw new APIError('INTERNAL_SERVER_ERROR', {
    message: 'Google OAuth environment variables are missing',
  });
}

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL ?? 'http://localhost:3000/api/auth',
  database: drizzleAdapter(database, {
    provider: 'pg',
  }),
  emailAndPassword: {
    autoSignIn: true,
    enabled: true,
    password: {
      hash: async (password: string) => {
        return await argon2.hash(password, {
          type: argon2.argon2id,
          memoryCost: 1 << 16, // 64 MiB
          timeCost: 3,
          parallelism: 1,
        });
      },
      verify: async (data: { password: string; hash: string }) => {
        return await argon2.verify(data.hash, data.password);
      },
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },
  trustedOrigins: [process.env.CLIENT_URL ?? 'http://localhost:5173'],
  plugins: [
    apiKey({
      defaultPrefix: 'seenit',
      requireName: true,
      rateLimit: {
        enabled: true,
        timeWindow: 60_000,
        maxRequests: 5,
      },
    }),
    // password handling moved to `emailAndPassword.password`
  ],
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (!ctx.path.startsWith('/sign-up')) return;

      const body = ctx.body as { name?: string } | undefined;
      if (!body?.name) return;

      const username = normalizeUsername(body.name);

      const existing = await database
        .select({ id: userData.id })
        .from(userData)
        .where(eq(userData.name, username))
        .limit(1);

      if (existing.length > 0) {
        throw new APIError('UNPROCESSABLE_ENTITY', {
          message: 'Username already taken',
        });
      }
    }),
    after: createAuthMiddleware(async (ctx) => {
      const newSession = ctx.context.newSession;
      if (!newSession) return;

      const { id, name, email } = newSession.user;
      let username = normalizeUsername(name ?? email ?? `user_${id}`);

      const existing = await database
        .select({ id: userData.id })
        .from(userData)
        .where(eq(userData.name, username))
        .limit(1);
    
      if (existing.length > 0) {
        username = fallbackUsername(username, id);
      }

      await database
        .insert(userData)
        .values({ id, name: username, email })
        .onConflictDoNothing();
    }),
  },
});

export type AppAuth = typeof auth;
