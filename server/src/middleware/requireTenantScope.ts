import type { NextFunction, Request, Response } from 'express';

export function requireMerchantScope(req: Request, res: Response, next: NextFunction) {
  const authUser = req.authUser;

  if (!authUser) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (authUser.role === 'merchant' && !authUser.merchantId) {
    return res.status(403).json({ message: 'Merchant account is missing tenant scope' });
  }

  return next();
}