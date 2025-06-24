import { Request, Response } from 'express';
import * as TodoModel from '../models/todoModel';
import { ApiResponse } from './interface';

export interface AuthenticatedRequest extends Request {
  userId?: string;
}

export async function getTodos(req: AuthenticatedRequest, res: Response): Promise<any> {
  const userId = req.userId;
  if (!userId) {
    const response: ApiResponse<null> = {
      statusCode: 401,
      message: 'Unauthorized',
      data: null,
    };
    return res.status(401).json(response);
  }
  try {
    const todos = await TodoModel.getAllTodos(userId);
    const cleanedTodos = todos.map(todo => ({
      id: todo.id,
      task: todo.task,
      completed: Boolean(todo.completed),
      userId: todo.user_id,
    }));
    const response: ApiResponse<typeof cleanedTodos> = {
      statusCode: 200,
      message: 'Successfully fetched todos',
      data: cleanedTodos,
    };
    return res.status(200).json(response);
  } catch (error: any) {
    const response: ApiResponse<null> = {
      statusCode: 500,
      message: error.message || 'Internal Server Error',
      data: null,
    };
    return res.status(500).json(response);
  }
}

export async function addTodo(req: AuthenticatedRequest, res: Response): Promise<any> {
  const userId = req.userId;
  const { task } = req.body;

  if (!userId) {
    const response: ApiResponse<null> = {
      statusCode: 401,
      message: 'Unauthorized',
      data: null,
    };
    return res.status(401).json(response);
  }

  if (!task) {
    const response: ApiResponse<null> = {
      statusCode: 400,
      message: 'Task is required',
      data: null,
    };
    return res.status(400).json(response);
  }

  try {
    const newTodo = await TodoModel.createTodo(task, userId);
    const cleanedTodo = {
      id: newTodo.id,
      task: newTodo.task,
      completed: Boolean(newTodo.completed),
      userId: newTodo.userId,
    };
    const response: ApiResponse<typeof cleanedTodo> = {
      statusCode: 201,
      message: 'Successfully added todo',
      data: cleanedTodo,
    };
    return res.status(201).json(response);
  } catch (error: any) {
    const response: ApiResponse<null> = {
      statusCode: 500,
      message: error.message || 'Internal Server Error',
      data: null,
    };
    return res.status(500).json(response);
  }
}

export async function editTodo(req: AuthenticatedRequest, res: Response): Promise<any> {
  const userId = req.userId;
  const { task, completed } = req.body;
  const id = req.params.id;

  if (!userId) {
    const response: ApiResponse<null> = {
      statusCode: 401,
      message: 'Unauthorized',
      data: null,
    };
    return res.status(401).json(response);
  }

  if (!id || isNaN(Number(id))) {
    const response: ApiResponse<null> = {
      statusCode: 400,
      message: 'Invalid ID',
      data: null,
    };
    return res.status(400).json(response);
  }

  try {
    const updatedTodo = await TodoModel.updateTodo(Number(id), task, completed, userId);
    if (!updatedTodo) {
      const response: ApiResponse<null> = {
        statusCode: 404,
        message: 'Todo not found',
        data: null,
      };
      return res.status(404).json(response);
    }
    const cleanedTodo = {
      id: updatedTodo.id,
      task: updatedTodo.task,
      completed: Boolean(updatedTodo.completed),
      userId: updatedTodo.user_id,
    };
    const response: ApiResponse<typeof cleanedTodo> = {
      statusCode: 200,
      message: 'Successfully updated todo',
      data: cleanedTodo,
    };
    return res.status(200).json(response);
  } catch (error: any) {
    const response: ApiResponse<null> = {
      statusCode: 500,
      message: error.message || 'Internal Server Error',
      data: null,
    };
    return res.status(500).json(response);
  }
}

export async function removeTodo(req: AuthenticatedRequest, res: Response): Promise<any> {
  const userId = req.userId;
  const id = req.params.id;

  if (!userId) {
    const response: ApiResponse<null> = {
      statusCode: 401,
      message: 'Unauthorized',
      data: null,
    };
    return res.status(401).json(response);
  }

  if (!id || isNaN(Number(id))) {
    const response: ApiResponse<null> = {
      statusCode: 400,
      message: 'Invalid ID',
      data: null,
    };
    return res.status(400).json(response);
  }

  try {
    const deleted = await TodoModel.deleteTodo(Number(id), userId);
    if (!deleted) {
      const response: ApiResponse<null> = {
        statusCode: 404,
        message: 'Todo not found',
        data: null,
      };
      return res.status(404).json(response);
    }
    const response: ApiResponse<null> = {
      statusCode: 200,
      message: 'Todo successfully deleted',
      data: null,
    };
    return res.status(200).json(response);
  } catch (error: any) {
    const response: ApiResponse<null> = {
      statusCode: 500,
      message: error.message || 'Internal Server Error',
      data: null,
    };
    return res.status(500).json(response);
  }
}
