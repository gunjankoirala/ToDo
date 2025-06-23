import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import dotenv from 'dotenv';
dotenv.config();  

const JWT_SECRET = process.env.JWT_SECRET!;

export function verifyToken(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers['authorization'];

  if (authHeader === undefined || authHeader === null) {
    res.status(401).json({
      code: 401,
      message: 'No token provided',
      data: null
    });
    return;
  }

  const parts = authHeader.split(' ');

  if (parts.length !== 2) {
    res.status(401).json({
      code: 401,
      message: 'Token format is invalid',
      data: null
    });
    return;
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    (req as any).user = decoded;
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
