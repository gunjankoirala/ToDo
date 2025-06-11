import express, { Request, Response } from 'express';
import cors from 'cors';
import todoRoutes from './routes/todoRoutes';
import bodyParser from 'body-parser';

const app = express();
const PORT = 8080;

app.use(cors());
app.use(bodyParser.json());

app.use('/api',todoRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
