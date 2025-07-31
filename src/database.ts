import { drizzle, MySql2Database } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { mysqlTableCreator, varchar, int, boolean } from 'drizzle-orm/mysql-core';

dotenv.config();

//  FIXED: Return just the table name as a string
const mySqlTable = mysqlTableCreator((tableName) => tableName);


//  User table
const user = mySqlTable('user', {
  id: varchar({ length: 255 }).primaryKey(),
  email: varchar({ length: 255 }).unique(),
  password: varchar({ length: 255 }),
});

//  Todo table
const todo = mySqlTable('todo', {
  id: int().primaryKey().autoincrement(),
  task: varchar({ length: 255 }).notNull(),
  completed: boolean().default(false).notNull(),
  userId: varchar({ length: 255 }).notNull(),
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
