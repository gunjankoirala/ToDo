import { drizzle, MySql2Database } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { mysqlTable } from 'drizzle-orm/mysql-core';
import dotenv from 'dotenv';
import { varchar, int, boolean } from './utils/fields';

dotenv.config();

//  User table
const user = mysqlTable('user', {
  id: varchar('id', { length: 255 }).primaryKey(),
  email: varchar('email', { length: 255 }).unique(),
  password: varchar('password', { length: 255 }),
});

//  Todo table 
const todo = mysqlTable('todo', {
  id: int('id').primaryKey().autoincrement(),
  task: varchar('task', { length: 255 }).notNull(),
  completed: boolean('completed').default(false).notNull(),
  userId: varchar('user_id', { length: 255 }).notNull(), 
});

// Schema and DB
const schema = { user, todo };

const pool = mysql.createPool({
  host: process.env.DB_HOST!,
  user: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
  database: process.env.DB_NAME!,
});

export const db: MySql2Database<typeof schema> = drizzle(pool, {
  schema,
  mode: 'default',
});

export { schema, user, todo };
