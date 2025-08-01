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
  type Mutation {
    addTodo(task: String!, userId: ID!): Todo!
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
  Mutation: {
    //add todo for specific user
  addTodo: async (_parent: any, args: { task: string; userId: string }): Promise<Todo> => {
    const id = await db
      .insert(todo)
      .values({ task: args.task, userId: args.userId, completed: false })
      .$returningId();

    const [newTodo] = await db.select().from(todo).where(eq(todo.id, id));
    return newTodo;
  },
},

};
