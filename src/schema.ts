import { gql } from 'graphql-tag';
import { db, todo } from './database';
import { eq } from 'drizzle-orm';

//interface for Todo object
export interface Todo {
  id: number;
  task: string;
  completed: boolean;
  userId: string;
}

//schema definition
export const typeDefs = gql`
  type Todo {
    id: ID!
    task: String!
    completed: Boolean!
  }

  type Query {
    todos(userId: ID!): [Todo!]!
  }
`;

//resolver functions
export const resolvers = {
  Query: {
    //  To get todos for a specific user
    todos: async (_parent: any, args: { userId: string }): Promise<Todo[]> => {
      return await db.select().from(todo).where(eq(todo.userId, args.userId));
    },
  },
};
