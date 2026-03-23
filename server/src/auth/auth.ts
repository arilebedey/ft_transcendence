import 'dotenv/config';
import { apiKey } from '@better-auth/api-key';
import { betterAuth } from 'better-auth';
import { APIError, createAuthMiddleware } from 'better-auth/api';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { userData } from '../users/user-data.schema';

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

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL ?? 'http://localhost:3000/api/auth',
  database: drizzleAdapter(database, {
    provider: 'pg',
  }),
  emailAndPassword: {
    autoSignIn: true,
    enabled: true,
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
  ],
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (!ctx.path.startsWith('/sign-up')) return;

      const body = ctx.body as { name?: string } | undefined;
      if (!body?.name) return;

      const existing = await database
        .select({ id: userData.id })
        .from(userData)
        .where(eq(userData.name, body.name))
        .limit(1);

      if (existing.length > 0) {
        throw new APIError('UNPROCESSABLE_ENTITY', {
          message: 'Username already taken',
        });
      }
    }),
    after: createAuthMiddleware(async (ctx) => {
      if (!ctx.path.startsWith('/sign-up')) return;

      const newSession = ctx.context.newSession;
      if (!newSession) return;

      const { id, name, email } = newSession.user;
      await database
        .insert(userData)
        .values({ id, name, email })
        .onConflictDoNothing();
    }),
  },
});

export type AppAuth = typeof auth;
