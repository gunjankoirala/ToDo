import { Request, Response } from 'express';
import * as TodoModel from '../models/todoModel';

export async function getTodos(req: Request, res: Response): Promise<any> {
  try {
    const todos = await TodoModel.getAllTodos();
    res.json({
      code: 200,
      message: 'Successfully fetched todos',
      data: todos,
    });
  } catch (err) {
    console.error('Error fetching todos:', err);
    return res.status(500).json({
      code: 500,
      message: 'Internal Server Error',
      data: null,
    });
  }
}

export async function addTodo(req: Request, res: Response): Promise<any> {
  const { task } = req.body;

  if (!task) {
    return res.status(400).json({
      code: 400,
      message: 'Task is required',
      data: null,
    });
  }

  try {
    const newTodo = await TodoModel.createTodo(task);
    res.status(201).json({
      code: 201,
      message: 'Successfully added todo',
      data: newTodo,
    });
  } catch (err) {
    console.error('Error adding todo:', err);
    return res.status(500).json({
      code: 500,
      message: 'Internal Server Error',
      data: null,
    });
  }
}

export async function editTodo(req: Request, res: Response): Promise<any> {
  const id = Number(req.params.id);
  const { task, completed } = req.body;

  try {
    const updatedTodo = await TodoModel.updateTodo(id, task, completed);
    if (!updatedTodo) {
      return res.status(404).json({
        code: 404,
        message: 'Todo not found',
        data: null,
      });
    }

    res.json({
      code: 200,
      message: 'Successfully updated todo',
      data: updatedTodo,
    });
  } catch (err) {
    console.error('Error updating todo:', err);
    return res.status(500).json({
      code: 500,
      message: 'Internal Server Error',
      data: null,
    });
  }
}

export async function removeTodo(req: Request, res: Response): Promise<any> {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({
      code: 400,
      message: 'Invalid ID',
      data: null,
    });
  }

  try {
    const deleted = await TodoModel.deleteTodo(id);

    if (!deleted) {
      return res.status(404).json({
        code: 404,
        message: 'Todo not found',
        data: null,
      });
    }

    return res.status(200).json({
      code: 200,
      message: 'Todo successfully deleted',
      data: null,
    });
  } catch (err) {
    console.error('Error deleting todo:', err);
    return res.status(500).json({
      code: 500,
      message: 'Internal Server Error',
      data: null,
    });
  }
}
