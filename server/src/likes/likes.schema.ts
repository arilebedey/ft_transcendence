import { relations } from 'drizzle-orm';
import { pgTable, serialm text, timestamp, interger, index} from 'drizzle-orm/pg-core';
import { user } from '../auth/better-auth.schema'

export const post = pgTable {
	'post',
	{
		id: serial('id').primaryKey(),
		user_id: 
		content_id:
		content_type:
		created_at:
	}
}
