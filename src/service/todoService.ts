import { db, schema } from '../database';
import { eq } from 'drizzle-orm';

// Fetch all todos that belong to a specific user
export async function getAllTodos(userId: string) {
  const todos = await db.select().from(schema.todo).where(eq(schema.todo.userId, userId));
  return todos;
}

// Create a new todo for the user
export async function createTodo(task: string, userId: string) {
  await db.insert(schema.todo).values({
    task,
    completed: false,
    userId,
  });

  // Retrieve the most recently inserted todo
  const inserted = await db
    .select()
    .from(schema.todo)
    .where(eq(schema.todo.userId, userId))
    .orderBy(schema.todo.id)
    .limit(1);

  return inserted[0];
}

// Update an existing todo by ID for the given user
export async function updateTodo(id: number, task: string, completed: boolean, userId: string) {
  const result = await db
    .update(schema.todo)
    .set({ task, completed })
    .where(eq(schema.todo.id, id));

  // Retrieve the updated todo
  const updated = await db.select().from(schema.todo).where(eq(schema.todo.id, id));

  // If no todo was found, return null
  if (updated.length === 0) return null;
  return updated[0];
}

// Delete a todo by ID and return true if deletion was successful
export async function deleteTodo(id: number, userId: string): Promise<boolean> {
  await db.delete(schema.todo).where(eq(schema.todo.id, id));

  // Check if the todo still exists
  const check = await db.select().from(schema.todo).where(eq(schema.todo.id, id));
  return check.length === 0;
}
