import type { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../auth/jwt.js';

export type AuthedRequest = Request & { userId: number };

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const h = req.headers.authorization;
  const token = h?.startsWith('Bearer ') ? h.slice(7) : null;
  if (!token) {
    res.status(401).json({ error: 'Требуется вход' });
    return;
  }
  const payload = verifyToken(token);
  if (!payload) {
    res.status(401).json({ error: 'Сессия недействительна' });
    return;
  }
  (req as AuthedRequest).userId = payload.userId;
  next();
}
