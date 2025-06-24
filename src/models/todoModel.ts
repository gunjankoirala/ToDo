import { open } from 'sqlite';
import sqlite3 from 'sqlite3';

const dbPromise = open({
  filename: './todos.db',
  driver: sqlite3.Database,
});

export async function getAllTodos(userId: string) {
  const db = await dbPromise;
  const todos = await db.all('SELECT * FROM todos WHERE user_id = ?', [userId]);
  return todos;
}

export async function createTodo(task: string, userId: string) {
  const db = await dbPromise;
  const result = await db.run(
    'INSERT INTO todos (task, completed, user_id) VALUES (?, ?, ?)',
    [task, false, userId]
  );
  return { id: result.lastID, task, completed: false, userId };
}

export async function updateTodo(id: number, task: string, completed: boolean, userId: string) {
  const db = await dbPromise;
  const result = await db.run(
    'UPDATE todos SET task = ?, completed = ? WHERE id = ? AND user_id = ?',
    [task, completed, id, userId]
  );

  if (result.changes === 0) return null;

  const updated = await db.get('SELECT * FROM todos WHERE id = ? AND user_id = ?', [id, userId]);
  return updated;
}

export async function deleteTodo(id: number, userId: string): Promise<boolean> {
  const db = await dbPromise;
  const result = await db.run('DELETE FROM todos WHERE id = ? AND user_id = ?', [id, userId]);
  return typeof result.changes === 'number' && result.changes > 0;
}
