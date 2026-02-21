import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as authSchema from '../auth/better-auth.schema';
import * as userDataSchema from '../users/user-data.schema';
import * as chatSchema from '../chat/chat.schema';

export type AppDatabase = NodePgDatabase<
  typeof authSchema & typeof userDataSchema & typeof chatSchema
>;
