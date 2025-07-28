
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// To Load environment variables from .env file
dotenv.config();

// Get JWT secret key from environment variables
const JWT_SECRET = process.env.JWT_SECRET!;

// Extending the Request interface to include userId after token verification
export interface AuthenticatedRequest extends Request {
  userId?: string;
}

// Middleware function to verify JWT token in the Authorization header
export function verifyToken(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers['authorization']; 

  // If there's no token provided
  if (!authHeader) {
    res.status(401).json({
      code: 401,
      message: 'No token provided',
      data: null
    });
    return;
  }

  // Expected format: "Bearer <token>"
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    res.status(401).json({
      code: 401,
      message: 'Token format is invalid',
      data: null
    });
    return;
  }

  const token = parts[1]; 

  try {
    // Verify and decode the token using the secret key
    const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;

    // Check if the payload contains a userId
    if (!decoded || typeof decoded !== 'object' || !decoded.userId) {
      res.status(401).json({
        code: 401,
        message: 'Invalid token payload',
        data: null
      });
      return;
    }

   
    req.userId = decoded.userId;
    next(); 
  } catch (error) {
    // If token is invalid or expired
    res.status(403).json({
      code: 403,
      message: 'Invalid token',
      data: null
    });
    return;
  }
}
