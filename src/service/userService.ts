import { eq } from 'drizzle-orm';
import { db, schema } from '../database';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

// Function to create a new user with a hashed password
export async function createUser(email: string, password: string) {
  const hashed = await bcrypt.hash(password, 3); 
  const id = uuidv4(); 

  // Insert the new user into the database
  await db.insert(schema.user).values({
    id,
    email,
    password: hashed,
  });

  return { id, email }; 
}

// Function to find a user by their email
export async function findUserByEmail(email: string) {
  const result = await db.select().from(schema.user).where(eq(schema.user.email, email));
  return result[0]; 
}
//find user by their Id
export async function findUserById(id: string): Promise<{ id: string; email: string } | null> {
  const [user] = await db
    .select({ id: schema.user.id, email: schema.user.email })
    .from(schema.user)
    .where(eq(schema.user.id, id));

  if (!user || user.email === null) return null;

  return {
    id: user.id,
    email: user.email,
  };
}
