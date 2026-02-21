import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as authSchema from '../auth/better-auth.schema';
import * as userDataSchema from '../users/user-data.schema';
import * as likeSchema from '../likes/likes.schema';
import * as chatSchema from '../chat/chat.schema';
import * as postsSchema from '../posts/posts.schema';

export type AppDatabase = NodePgDatabase<
  typeof authSchema &
    typeof userDataSchema &
    typeof likeSchema &
    typeof chatSchema &
    typeof postsSchema
>;
