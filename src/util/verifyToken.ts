import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET!;

export interface AuthenticatedRequest extends Request {
  userId?: string;
}

export function verifyToken(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    res.status(401).json({
      code: 401,
      message: 'No token provided',
      data: null
    });
    return;
  }

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
    const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;

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
    res.status(403).json({
      code: 403,
      message: 'Invalid token',
      data: null
    });
    return;
  }
}
