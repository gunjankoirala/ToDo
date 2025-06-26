import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as userModel from '../models/userModel';
import { ApiResponse } from './interface';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET!;

async function authenticateUser(
  userId: string,
  password: string,
  hashedPassword: string,
  jwtSecret: string
): Promise<string | null> {
  const isMatch = await bcrypt.compare(password, hashedPassword);
  if (!isMatch) return null;

  return jwt.sign({ userId }, jwtSecret, { expiresIn: '1h' });
}

export async function registerUser(req: Request, res: Response): Promise<any> {
  const username: string = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({
      statusCode: 400,
      message: 'Please provide username and password',
      data: null,
    });
  }

  try {
    const existingUser = await userModel.findUserByUsername(username);

    if (existingUser) {
      return res.status(409).json({
        statusCode: 409,
        message: 'Username is already taken',
        data: null,
      });
    }

    const newUser = await userModel.createUser(username, password);

    return res.status(201).json({
      statusCode: 201,
      message: 'User registered successfully',
      data: { username: newUser.username },
    });
  } catch (error: any) {
    console.error('Error in registerUser:', error);
    return res.status(500).json({
      statusCode: 500,
      message: error.message || 'Internal server error',
      data: null,
    });
  }
}

export async function loginUser(req: Request, res: Response): Promise<any> {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({
      statusCode: 400,
      message: 'Please provide username and password',
      data: null,
    });
  }

  try {
    const user = await userModel.findUserByUsername(username);

    if (!user) {
      return res.status(404).json({
        statusCode: 404,
        message: 'User not found',
        data: null,
      });
    }

    if (!user.password) {
      return res.status(500).json({
        statusCode: 500,
        message: 'User password not set',
        data: null,
      });
    }

    const token = await authenticateUser(user.id, password, user.password, JWT_SECRET);

    if (!token) {
      return res.status(401).json({
        statusCode: 401,
        message: 'Password is incorrect',
        data: null,
      });
    }

    return res.status(200).json({
      statusCode: 200,
      message: 'Login successful',
      data: { token },
    });
  } catch (error: any) {
    console.error('Error in loginUser:', error);
    return res.status(500).json({
      statusCode: 500,
      message: error.message || 'Internal server error',
      data: null,
    });
  }
}
