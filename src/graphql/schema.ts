import { gql } from 'graphql-tag';

export const typeDefs = gql`
  type Todo {
    id: ID!
    task: String!
    completed: Boolean!
    userId: ID!
  }

  type User {
    id: ID!
    email: String!
  }

  type Query {
    todos: [Todo!]!
    me: User
  }

  type Mutation {
    addTodo(task: String!): Todo!
    updateTodo(id: Int!, task: String, completed: Boolean): Todo!
    deleteTodo(id: Int!): Boolean!

    register(email: String!, password: String!): RegisterResponse!
    login(email: String!, password: String!): LoginResponse!
  }

  type RegisterResponse {
    message: String!
  }

  type LoginResponse {
    message: String!
    token: String!
  }
`;

