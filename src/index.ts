import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';

const app = express();
const PORT = 8080;

app.use(bodyParser.json());




interface Todo {
  id: number;
  task: string;
  completed: boolean;
}
let todos: Todo[] = [];
let nextId = 1;


app.get('/todos', (req: Request, res: Response) => {
  res.json(todos);
});
app.post('/todos', (req: Request, res: Response) => {
  const { task } = req.body;
  if (!task) {
     res.status(400).json({ error: 'Task is required' });
  }
  const newTodo: Todo = { id: nextId++, task, completed: false };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
