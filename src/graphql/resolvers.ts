import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { Todo } from './types';
import { getAllTodos, createTodo, updateTodo, deleteTodo } from '../service/todoService';
import { createUser, findUserByEmail, findUserById } from '../service/userService';
import { generateToken } from '../utils/jwt';

dotenv.config();

export const resolvers = {
  Query: {
    todos: async (_parent: any, _args: any, context: { userId: string | null }): Promise<Todo[]> => {
      if (!context.userId) throw new Error('Unauthorized');
      const todos = await getAllTodos(context.userId);
      return todos;
    },

    me: async (_parent: any, _args: any, context: { userId: string | null }) => {
      if (!context.userId) throw new Error('Unauthorized');
      const user = await findUserById(context.userId);
      return user;
    },
  },

  Mutation: {
    SignUp: async (_parent: any, args: { email: string; password: string }): Promise<{ message: string }> => {
      const { email, password } = args;

      const existing = await findUserByEmail(email);
      if (existing) throw new Error('User already exists');

      await createUser(email, password);

      return { message: 'User registered successfully' };
    },

    login: async (_parent: any, args: { email: string; password: string }): Promise<{ message: string; token: string }> => {
      const { email, password } = args;

      const user = await findUserByEmail(email);
      if (!user) throw new Error('User not found');

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) throw new Error('Invalid credentials');

      const token = generateToken(user.id);

      return {
        message: 'Login successful',
        token,
      };
    },

    addTodo: async (_parent: any, args: { task: string }, context: { userId: string | null }): Promise<Todo> => {
      if (!context.userId) throw new Error('Unauthorized');

      const newTodo = await createTodo(args.task, context.userId);
      return newTodo;
    },

    updateTodo: async (_parent: any,args: { id: number; task?: string; completed?: boolean },context: { userId: string | null }): Promise<Todo> => {
      if (!context.userId) throw new Error('Unauthorized');

      const updatedTodo = await updateTodo(args.id, args.task, args.completed, context.userId);
      if (!updatedTodo) throw new Error('Forbidden');
      return updatedTodo;
    },

    deleteTodo: async (_parent: any,args: { id: number },context: { userId: string | null }): Promise<boolean> => {
      if (!context.userId) throw new Error('Unauthorized');

      const deleted = await deleteTodo(args.id, context.userId);
      return deleted;
    },
  },
};
