import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import bcrypt from 'bcryptjs';
import { initDB } from '../database';
import { v4 as uuidv4 } from 'uuid';

export async function createUser(username: string, password: string) {
  const db = await initDB();
  const hashed = await bcrypt.hash(password, 3);
  const id = uuidv4();
  await db.run(
    'INSERT INTO users (id, username, password) VALUES (?, ?, ?)',
    [id, username, hashed]
  );

  return { id, username };
}

export async function findUserByUsername(username: string) {
  const db = await initDB();
  const user = await db.get('SELECT id, username, password FROM users WHERE username = ?', [username]);
  return user;
}

