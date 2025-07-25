import { db, schema } from '../database';
import { eq } from 'drizzle-orm';

export async function getAllTodos(userId: string) {
  const todos = await db.select().from(schema.todos).where(eq(schema.todos.userId, userId));
  return todos;
}

export async function createTodo(task: string, userId: string) {
  await db.insert(schema.todos).values({
    task,
    completed: false,
    userId,
  });

  const inserted = await db
    .select()
    .from(schema.todos)
    .where(eq(schema.todos.userId, userId))
    .orderBy(schema.todos.id)
    .limit(1);

  return inserted[0];
}

export async function updateTodo(id: number, task: string, completed: boolean, userId: string) {
  const result = await db
    .update(schema.todos)
    .set({ task, completed })
    .where(eq(schema.todos.id, id));

  
  const updated = await db.select().from(schema.todos).where(eq(schema.todos.id, id));

  if (updated.length === 0) return null;
  return updated[0];
}

export async function deleteTodo(id: number, userId: string): Promise<boolean> {
  await db.delete(schema.todos).where(eq(schema.todos.id, id));


  const check = await db.select().from(schema.todos).where(eq(schema.todos.id, id));
  return check.length === 0;
}
