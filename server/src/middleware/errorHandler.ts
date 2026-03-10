import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (error instanceof ZodError) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: error.flatten(),
    });
  }

  if (error instanceof Error) {
    const isAuthError = error.message === 'Invalid email or password';
    const isNotFoundError = error.message === 'User not found';

    if (isAuthError) {
      return res.status(401).json({ message: error.message });
    }

    if (isNotFoundError) {
      return res.status(404).json({ message: error.message });
    }

        const supportAccessErrors = [
      'Merchant scope is required',
      'Support code not found',
      'Support code has been revoked',
      'Support code has already been used',
      'Support code has expired',
      'Support code has already been resolved',
    ];

    if (supportAccessErrors.includes(error.message)) {
      return res.status(400).json({ message: error.message });
    }

    return res.status(500).json({ message: error.message });
  }

  return res.status(500).json({ message: 'Internal server error' });
}