import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as userModel from '../service/userService';
import { ApiResponse } from './interface';
import dotenv from 'dotenv';
dotenv.config();

// Load the JWT secret from environment variables
const jwtSecret = process.env.JWT_SECRET;
const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '1h';

if (!jwtSecret) {
  throw new Error("JWT_SECRET is missing in .env file");
}

//  function to verify password and generate JWT token
async function authenticateUser(
  userId: string,
  password: string,
  hashedPassword: string,
  jwtSecret: string
): Promise<string | null> {
  const isMatch = await bcrypt.compare(password, hashedPassword);
  if (!isMatch) return null;

  // Create a JWT token valid for 1 hour
  return jwt.sign({ userId }, jwtSecret, { expiresIn: '1h' });
}

// Handles user registration
export async function registerUser(req: Request, res: Response): Promise<any> {
  const email: string = req.body.email;
  const password = req.body.password;

  // Check if both email and password are provided in body
  if (!email || !password) {
    return res.status(400).json({
      statusCode: 400,
      message: 'Please provide email and password',
      data: null,
    });
  }

  try {
    // Check if the email already exists in the database 
    const existingUser = await userModel.findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        statusCode: 409,
        message: 'Email is already taken',
        data: null,
      });
    }

    // Create a new user with the given credentials
    const newUser = await userModel.createUser(email, password);

    return res.status(201).json({
      statusCode: 201,
      message: 'User registered successfully',
      data: { email: newUser.email },
    });

  } catch (error: any) {
    console.error('Error in registerUser:', error);
    return res.status(400).json({
      statusCode: 400,
      message: error.message || 'Failed to register user',
      data: null,
    });
  }
}

// Handles user login
export async function loginUser(req: Request, res: Response): Promise<any> {
  const email = req.body.email;
  const password = req.body.password;

  // Check if both fields are present
  if (!email || !password) {
    return res.status(400).json({
      statusCode: 400,
      message: 'Please provide email and password',
      data: null,
    });
  }

  try {
    // Look for the user by email
    const user = await userModel.findUserByEmail(email);

    // If user is not found
    if (!user) {
      return res.status(404).json({
        statusCode: 404,
        message: 'User not found',
        data: null,
      });
    }

    // If user exists but no password is set 
    if (!user.password) {
      return res.status(401).json({
        statusCode: 401,
        message: 'User password not set or invalid',
        data: null,
      });
    }

    // Authenticate and get JWT token
    if (!jwtSecret) {
      throw new Error("JWT_SECRET is not defined");
    }

    const token = await authenticateUser(user.id, password, user.password, jwtSecret);

    // If wrong password is provided
    if (!token) {
      return res.status(401).json({
        statusCode: 401,
        message: 'Password is incorrect',
        data: null,
      });
    }

    // login success
    return res.status(200).json({
      statusCode: 200,
      message: 'Login successful',
      data: { token },
    });

  } catch (error: any) {
    console.error('Error in loginUser:', error);
    return res.status(400).json({
      statusCode: 400,
      message: error.message || 'Failed to login user',
      data: null,
    });
  }
}
