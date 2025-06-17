import { open } from 'sqlite';
import sqlite3 from 'sqlite3';

const dbPromise = open({
    filename:'./todos.db',
    driver:sqlite3.Database
})

export async function getAllTodos() {
  const db = await dbPromise;
  const todos = await db.all('SELECT * FROM todos');
  return todos;
}

export async function createTodo(task: string) {
  const db = await dbPromise;
  const result = await db.run('INSERT INTO todos (task, completed) VALUES (?, ?)', [task, false]);
  return { id: result.lastID, task: task, completed: false };
}
 
export async function updateTodo(id: number, task: string, completed: boolean) {
  const db = await dbPromise;
  await db.run('UPDATE todos SET task = ?, completed = ? WHERE id = ?', [task, completed, id]);
  const updated = await db.get('SELECT * FROM todos WHERE id = ?', [id]);
  return updated;
}

export async function deleteTodo(id: number): Promise<boolean> {
  const db = await dbPromise;
  const result = await db.run('DELETE FROM todos WHERE id = ?', [id]);
  return typeof result.changes === 'number' && result.changes > 0;
}
