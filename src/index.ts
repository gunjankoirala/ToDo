import express from 'express';
import cors from 'cors';
import todoRoutes from './routes/todoRoutes';
import { db } from './database';

const app = express();
const PORT = process.env.PORT ;


app.use(cors());
app.use(express.json());


app.use('/api', todoRoutes);


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
