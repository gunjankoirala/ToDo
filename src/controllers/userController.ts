import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as userModel from '../models/userModel';
import { ApiResponse } from './interface';


const JWT_SECRET = 'superSecretKey123';

export async function registerUser(req: Request, res: Response) :Promise<any>{
  
  const username:string = req.body.username;
  const password = req.body.password;

  
  if (!username || !password) {
    const response: ApiResponse<null> = {
      statusCode: 400,
      message: 'please provide username and password',
      data: null,
    };
    return res.status(400).json(response);
  }

  try {
    
    const existingUser = await userModel.findUserByUsername(username);

    if (existingUser) {
       const response: ApiResponse<null> = {
        statusCode: 409,
        message: 'Username is already taken',
        data: null,
      };
      return res.status(409).json(response);
    }

    
    const newUser = await userModel.createUser(username, password);

    const response: ApiResponse<{ username: string} > = {
      statusCode: 201,
      message: 'User registered successfully',
      data: { username: newUser.username },
    };

    return res.status(201).json(response);

  } catch (error:any) {
    console.log('Error in registerUser:', error);
    const response: ApiResponse<null> = {
      statusCode: 500,
      message: error.message || 'Internal server error',
      data: null,
    };
    return res.status(500).json(response);
  }
}

export async function loginUser(req: Request, res: Response) :Promise<any>{
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    const response: ApiResponse<null> = {
      statusCode: 400,
      message: 'Please provide username and password',
      data: null,
    };
    return res.status(400).json(response);
  }

  try {
   
    const user = await userModel.findUserByUsername(username);

    if (!user) {
      const response: ApiResponse<null> = {
        statusCode: 404,
        message: 'User not found',
        data: null,
      };
      return res.status(404).json(response);
    }

    
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      const response: ApiResponse<null> = {
        statusCode: 401,
        message: 'Password is incorrect',
        data: null,
      };
      return res.status(401).json(response);
      
    }

    
    const token = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: '1h' });

     const response: ApiResponse<{ token: string }> = {
      statusCode: 200,
      message: 'Login successful',
      data: { token },
    };

    return res.status(200).json(response);

  } catch (error:any) {
    console.log('Error in loginUser:', error);
   const response: ApiResponse<null> = {
      statusCode: 500,
      message: error.message || 'Internal server error',
      data: null,
    };
    return res.status(500).json(response);
  }
}
