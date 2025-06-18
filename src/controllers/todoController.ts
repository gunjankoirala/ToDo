import { Request, Response } from 'express';
import * as TodoModel from '../models/todoModel';
import { ApiResponse } from './interface';
export async function getTodos(req: Request, res: Response): Promise<any> {
  try {
    const todos = await TodoModel.getAllTodos(); 
    const response: ApiResponse<typeof todos> = {
      statusCode: 200,
      message: 'Successfully fetched todos',
      data: todos,
    };
    res.status(200).json(response);
  } catch (error:any) {
    console.error('Error fetching todos:', error);
    const response: ApiResponse<null> = {
      statusCode: 500,
      message: error.message || 'Internal Server Error',
      data: null,
    };
    res.status(500).json(response);
  }
}

export async function addTodo(req: Request, res: Response): Promise<any> {
  const { task } = req.body;

  if (!task) {
    const response: ApiResponse<null> = {
      statusCode: 400,
      message: 'Task is required',
      data: null,
    };
    return res.status(400).json(response);
  }

  try {
    const newTodo = await TodoModel.createTodo(task);
   const response: ApiResponse<typeof newTodo> = {
      statusCode: 201,
      message: 'Successfully added todo',
      data: newTodo,
    };
    return res.status(201).json(response);
  } catch (error:any) {
    console.error('Error adding todo:', error);
    const response: ApiResponse<null> = {
      statusCode: 500,
      message: error.message || 'Internal Server Error',
      data: null,
    };
    return res.status(500).json(response);
  }
}

export async function editTodo(req: Request, res: Response): Promise<any> {
  const id = Number(req.params.id);
  const { task, completed } = req.body;

  try {
    const updatedTodo = await TodoModel.updateTodo(id, task, completed);
    if (!updatedTodo) {
      const response: ApiResponse<null> = {
        statusCode: 404,
        message: 'Todo not found',
        data: null,
      };
      return res.status(404).json(response);
    }

     const response: ApiResponse<typeof updatedTodo> = {
      statusCode: 200,
      message: 'Successfully updated todo',
      data: updatedTodo,
    };
    res.status(200).json(response);
  } catch (error:any) {
    console.error('Error updating todo:', error);
    const response: ApiResponse<null> = {
      statusCode: 500,
      message: error.message || 'Internal Server Error',
      data: null,
    };
    res.status(500).json(response);
  }
}

export async function removeTodo(req: Request, res: Response): Promise<any> {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    const response: ApiResponse<null> = {
      statusCode: 400,
      message: 'Invalid ID',
      data: null,
    };
    return res.status(400).json(response);
  }

  try {
    const deleted = await TodoModel.deleteTodo(id);

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
  } catch (error:any) {
    console.error('Error deleting todo:', error);
    const response: ApiResponse<null> = {
      statusCode: 500,
      message: error.message || 'Internal Server Error',
      data: null,
    };
    return res.status(500).json(response);
  }
}
