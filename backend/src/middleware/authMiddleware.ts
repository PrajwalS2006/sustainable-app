import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/userModel';

export interface AuthenticatedUser {
  id: string;
  role: 'user' | 'admin';
}

declare global {
  // eslint-disable-next-line no-var
  var __supply_chain_authenticated_user: AuthenticatedUser | undefined;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined in backend/.env');
  }
  return secret;
}

export async function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice('Bearer '.length) : undefined;
    if (!token) {
      res.status(401).json({ message: 'Missing Authorization Bearer token' });
      return;
    }

    const decoded = jwt.verify(token, getJwtSecret()) as { userId?: string };
    if (!decoded.userId) {
      res.status(401).json({ message: 'Invalid token payload' });
      return;
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      res.status(401).json({ message: 'User not found for token' });
      return;
    }

    req.user = { id: user._id.toString(), role: user.role };
    next();
  } catch (err) {
    res.status(401).json({ message: 'Unauthorized', error: err instanceof Error ? err.message : String(err) });
  }
}

export function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }
  if (req.user.role !== 'admin') {
    res.status(403).json({ message: 'Admin role required' });
    return;
  }
  next();
}

