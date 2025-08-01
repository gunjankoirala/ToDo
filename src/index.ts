import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { typeDefs } from './graphql/schema';
import { resolvers } from './graphql/resolvers';

dotenv.config();

async function startServer() {
  const PORT = process.env.PORT ? parseInt(process.env.PORT) : 8080;

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  const { url } = await startStandaloneServer(server, {
    listen: { port: PORT },
    context: async ({ req }) => {
      const authHeader = req.headers.authorization || '';
      const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

      if (!token) return { userId: null };

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload;
        return { userId: decoded.userId };
      } catch (err) {
        console.warn('Invalid token:', err);
        return { userId: null };
      }
    },
  });

  console.log(`🚀 Server ready at ${url}`);
}

startServer();
