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
export async function findUserById(id: string) {
  const [user] = await db.select().from(schema.user).where(eq(schema.user.id, id));
  return user || null;
}
