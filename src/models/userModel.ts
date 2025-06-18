import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import bcrypt from 'bcryptjs';
import { initDB } from '../database';

export async function createUser(username: string, password: string) {
  const db = await initDB();
  const hashed = await bcrypt.hash(password, 3);
  await db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashed]);
  return { username };  
}

export async function findUserByUsername(username: string) {
  const db = await initDB();
  const user = await db.get('SELECT username, password FROM users WHERE username = ?', [username]);
  return user;
}

