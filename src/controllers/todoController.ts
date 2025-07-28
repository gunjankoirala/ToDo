import { Request, Response } from 'express';
import * as TodoModel from '../service/todoService';
import { ApiResponse } from './interface';

// Extending the default Express request to include userId for authentication
export interface AuthenticatedRequest extends Request {
  userId?: string; 
}

// Function to get all todos for the logged-in user
export async function getTodos(req: AuthenticatedRequest, res: Response): Promise<any> {
  const userId = req.userId; 

  // If no userId is found, it means user is not authenticated
  if (!userId) {
    const response: ApiResponse<null> = {
      statusCode: 401,
      message: 'Unauthorized',
      data: null,
    };
    return res.status(401).json(response);
  }

  try {
    // Fetching all todos for the user from the model
    const todos = await TodoModel.getAllTodos(userId);

    // Converting todos into a cleaner format
    const cleanedTodos = todos.map(todo => ({
      id: todo.id,
      task: todo.task,
      completed: Boolean(todo.completed), // Ensures it's a boolean
      userId: todo.userId,
    }));

    // Sending successful response with todo list
    const response: ApiResponse<typeof cleanedTodos> = {
      statusCode: 200,
      message: 'Successfully fetched todos',
      data: cleanedTodos,
    };
    return res.status(200).json(response);
  } catch (error: any) {
    //Using status code 500 for any server related error
    const response: ApiResponse<null> = {
      statusCode: 500,
      message: error.message || 'Internal Server Error',
      data: null,
    };
    return res.status(500).json(response);
  }
}

// Function to add a new todo item
export async function addTodo(req: AuthenticatedRequest, res: Response): Promise<any> {
  const userId = req.userId; 
  const { task } = req.body; 

  // Check if user is authenticated
  if (!userId) {
    const response: ApiResponse<null> = {
      statusCode: 401,
      message: 'Unauthorized',
      data: null,
    };
    return res.status(401).json(response);
  }

  // Check if task is provided
  if (!task) {
    const response: ApiResponse<null> = {
      statusCode: 400,
      message: 'Task is required',
      data: null,
    };
    return res.status(400).json(response);
  }

  try {
    // Call the model to insert the todo in the database
    const newTodo = await TodoModel.createTodo(task, userId);

    // Format the newly created todo
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
    // Catch and return internal server error
    const response: ApiResponse<null> = {
      statusCode: 500,
      message: error.message || 'Internal Server Error',
      data: null,
    };
    return res.status(500).json(response);
  }
}

// Function to update an existing todo item
export async function editTodo(req: AuthenticatedRequest, res: Response): Promise<any> {
  const userId = req.userId; 
  const { task, completed } = req.body; 
  const id = req.params.id; 

  // Check if user is logged in
  if (!userId) {
    const response: ApiResponse<null> = {
      statusCode: 401,
      message: 'Unauthorized',
      data: null,
    };
    return res.status(401).json(response);
  }

  // Validate the ID 
  if (!id || isNaN(Number(id))) {
    const response: ApiResponse<null> = {
      statusCode: 400,
      message: 'Invalid ID',
      data: null,
    };
    return res.status(400).json(response);
  }

  try {
    // Try updating the todo in the model
    const updatedTodo = await TodoModel.updateTodo(Number(id), task, completed, userId);

    // If no todo was found to update
    if (!updatedTodo) {
      const response: ApiResponse<null> = {
        statusCode: 404,
        message: 'Todo not found',
        data: null,
      };
      return res.status(404).json(response);
    }

    // Format updated todo
    const cleanedTodo = {
      id: updatedTodo.id,
      task: updatedTodo.task,
      completed: Boolean(updatedTodo.completed),
      userId: updatedTodo.userId,
    };

    // Send back the updated todo
    const response: ApiResponse<typeof cleanedTodo> = {
      statusCode: 200,
      message: 'Successfully updated todo',
      data: cleanedTodo,
    };
    return res.status(200).json(response);
  } catch (error: any) {
    // If server fails while updating
    const response: ApiResponse<null> = {
      statusCode: 500,
      message: error.message || 'Internal Server Error',
      data: null,
    };
    return res.status(500).json(response);
  }
}

// Function to delete a todo
export async function removeTodo(req: AuthenticatedRequest, res: Response): Promise<any> {
  const userId = req.userId; 
  const id = req.params.id;  

  // User must be logged in
  if (!userId) {
    const response: ApiResponse<null> = {
      statusCode: 401,
      message: 'Unauthorized',
      data: null,
    };
    return res.status(401).json(response);
  }

  // for ID validation
  if (!id || isNaN(Number(id))) {
    const response: ApiResponse<null> = {
      statusCode: 400,
      message: 'Invalid ID',
      data: null,
    };
    return res.status(400).json(response);
  }

  try {
    // Try deleting the todo
    const deleted = await TodoModel.deleteTodo(Number(id), userId);

    // If no todo was found to delete
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
