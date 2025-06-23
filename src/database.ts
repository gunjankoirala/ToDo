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


    await db.exec(
    `CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      task TEXT,
      completed BOOLEAN 
    )`
    );

    await db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE,
    password TEXT
  );
`);

  

    return db;
}
