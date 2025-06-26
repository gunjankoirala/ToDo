import { eq } from 'drizzle-orm';
import { db, schema } from '../database';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

export async function createUser(username: string, password: string) {
  const hashed = await bcrypt.hash(password, 3);
  const id = uuidv4();

  await db.insert(schema.users).values({
    id,
    username,
    password: hashed,
  });

  return { id, username };
}

export async function findUserByUsername(username: string) {
  const result = await db.select().from(schema.users).where(eq(schema.users.username, username));
  return result[0]; 
}
