import  sqlite3  from 'sqlite3';
import {open} from 'sqlite';

export async function initDB(){
    const db = await open({
        filename:'./todos.db',
        driver:sqlite3.Database
    });

    await db.exec(
    `CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      task TEXT,
      completed BOOLEAN 
    )`
    );

    return db;
}
