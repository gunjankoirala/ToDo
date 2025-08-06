import { db, schema } from '../database';
import { eq, desc } from 'drizzle-orm';
import { and } from 'drizzle-orm';
import type { ResultSetHeader } from 'mysql2';

// Fetch all todos that belong to a specific user
export async function getAllTodos(userId: string) {
  const todos = await db.select().from(schema.todo).where(eq(schema.todo.userId, userId));
  return todos;
}
// Create a new todo for the user
export async function createTodo(task: string, userId: string) {
  const result = await db.insert(schema.todo).values({
    task,
    completed: false,
    userId,
  }).$returningId();

  if (!result.length || !result[0].id) {
    throw new Error('Failed to insert todo');
  }

  // fetch todo using ID
  const [inserted] = await db
    .select()
    .from(schema.todo)
    .where(eq(schema.todo.id, result[0].id));

  if (!inserted) {
    throw new Error('Inserted todo not found');
  }

  return inserted;
}

// Update an existing todo by ID and userId
export async function updateTodo(id: number,task: string | undefined,completed: boolean | undefined,userId: string) {
  const updateFields: Partial<{ task: string; completed: boolean }> = {};
  if (task !== undefined) updateFields.task = task;
  if (completed !== undefined) updateFields.completed = completed;
  if (Object.keys(updateFields).length === 0) return null;

  const result = await db
    .update(schema.todo)
    .set(updateFields)
    .where(and(eq(schema.todo.id, id), eq(schema.todo.userId, userId)));

  if ((result as any).affectedRows === 0) return null;

  const [updated] = await db
    .select()
    .from(schema.todo)
    .where(and(eq(schema.todo.id, id), eq(schema.todo.userId, userId)));

  return updated;
}

export async function deleteTodo(id: number, userId: string): Promise<boolean> {
  const [result] = await db
    .delete(schema.todo)
    .where(and(eq(schema.todo.id, id), eq(schema.todo.userId, userId)));

  return (result as ResultSetHeader).affectedRows > 0;
}

