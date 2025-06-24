import  sqlite3  from 'sqlite3';
import {open} from 'sqlite';
import path from 'path'; 


export async function initDB() {
   const dbPath = path.resolve('./todos.db'); 
  console.log('Using DB file at:', dbPath);
  const db = await open({
    filename: './todos.db',
    driver: sqlite3.Database,
  });
// await db.exec('DROP TABLE IF EXISTS todos;');
//   await db.exec('DROP TABLE IF EXISTS users;');

    await db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,            
    username TEXT UNIQUE,
    password TEXT
  );
`);

await db.exec(`
  CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    task TEXT,
    completed BOOLEAN,
    user_id TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
`);
  

    return db;
}
