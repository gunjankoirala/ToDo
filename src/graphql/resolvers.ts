import dotenv from 'dotenv';
import { db, todo, user } from '../database';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { Todo } from './types';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is missing in environment variables");
}

export const resolvers = {
  Query: {
    todos: async (_parent: any, _args: any, context: { userId: string | null }): Promise<Todo[]> => {
      if (!context.userId) throw new Error('Unauthorized');
      return await db.select().from(todo).where(eq(todo.userId, context.userId));
    },
  },

  Mutation: {
    register: async (_parent: any, args: { email: string; password: string }): Promise<{ message: string }> => {
      const { email, password } = args;

      const [existing] = await db.select().from(user).where(eq(user.email, email));
      if (existing) throw new Error('User already exists');

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUserId = crypto.randomUUID();

      await db.insert(user).values({
        id: newUserId,
        email,
        password: hashedPassword,
      });

      return { message: 'User registered sucessfully' };
    },

    login: async (_parent: any, args: { email: string; password: string }): Promise<{ message: string; token: string }> => {
      const { email, password } = args;

      const [foundUser] = await db.select().from(user).where(eq(user.email, email));
      if (!foundUser) throw new Error('User not found');

      const isValid = await bcrypt.compare(password, foundUser.password);
      if (!isValid) throw new Error('Invalid credentials');

      const token = jwt.sign({ userId: foundUser.id }, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
      });

      return {
        message: 'Login successful',
        token,
      };
    },
    addTodo: async (_parent: any, args: { task: string }, context: { userId: string | null }): Promise<Todo> => {
      if (!context.userId) throw new Error('Unauthorized');

      const [{ id }] = await db
        .insert(todo)
        .values({ task: args.task, userId: context.userId, completed: false })
        .$returningId();

      const [newTodo] = await db.select().from(todo).where(eq(todo.id, id));
      return newTodo;
    },

    updateTodo: async (_parent: any, args: { id: number; task?: string; completed?: boolean }, context: { userId: string | null }): Promise<Todo> => {
      if (!context.userId) throw new Error('Unauthorized');

      const [existing] = await db.select().from(todo).where(eq(todo.id, args.id));
      if (!existing || existing.userId !== context.userId) throw new Error('Forbidden');

      const updates: Partial<Todo> = {};
      if (args.task !== undefined) updates.task = args.task;
      if (args.completed !== undefined) updates.completed = args.completed;

      await db.update(todo).set(updates).where(eq(todo.id, args.id));
      const [updatedTodo] = await db.select().from(todo).where(eq(todo.id, args.id));
      return updatedTodo;
    },

    deleteTodo: async (_parent: any, args: { id: number }, context: { userId: string | null }): Promise<boolean> => {
      if (!context.userId) throw new Error('Unauthorized');

      const [existing] = await db.select().from(todo).where(eq(todo.id, args.id));
      if (!existing || existing.userId !== context.userId) return false;

      await db.delete(todo).where(eq(todo.id, args.id));
      return true;
    },
  },
};
