import type { NextFunction, Request, Response } from 'express';
import type { UserRole } from '../modules/auth/auth.types.js';

export function authorize(...allowedRoles: UserRole[]) {
  return function roleMiddleware(req: Request, res: Response, next: NextFunction) {
    const authUser = req.authUser;

    if (!authUser) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!allowedRoles.includes(authUser.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    return next();
  };
}