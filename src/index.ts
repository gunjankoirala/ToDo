import express, { Request, Response } from 'express';
 import cors from 'cors';
import todoRoutes from './routes/todoRoutes';
import { initDB } from './database';

const app = express();
const PORT = 8080;

 app.use(cors());
app.use(express.json());
initDB()
  .then((db) => {
    

    app.use('/api', todoRoutes);

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to initialize database:', err);
  });