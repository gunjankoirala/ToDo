import { gql } from 'graphql-tag';

export const typeDefs = gql`
  type Todo {
    id: ID!
    task: String!
    completed: Boolean!
    userId: ID!
  }

  type AuthPayload {
    token: String!
    userId: ID!
  }

  type Query {
    todos: [Todo!]!
  }

  type Mutation {
    addTodo(task: String!): Todo!
    updateTodo(id: Int!, task: String, completed: Boolean): Todo!
    deleteTodo(id: Int!): Boolean!

    register(email: String!, password: String!): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
  }
`;
