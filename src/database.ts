
import { drizzle, MySql2Database } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { mysqlTable, varchar, int, boolean } from 'drizzle-orm/mysql-core';
import dotenv from 'dotenv';

dotenv.config();


const users = mysqlTable('users', {
  id: varchar('id', { length: 255 }).primaryKey(),
  username: varchar('username', { length: 100 }).unique(),
  password: varchar('password', { length: 255 }),
});

const todos = mysqlTable('todos', {
  id: int('id').primaryKey().autoincrement(),
  task: varchar('task', { length: 255 }),
  completed: boolean('completed').default(false),
  userId: varchar('user_id', { length: 255 }),
});

const schema = { users, todos };


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


export { schema, users, todos };



