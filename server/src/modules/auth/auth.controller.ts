import type { Request, Response } from 'express';
import { loginSchema } from './auth.validation.js';
import * as authService from './auth.service.js';

export async function loginController(req: Request, res: Response) {
  const parsed = loginSchema.parse(req.body);

  const result = await authService.login(parsed.email, parsed.password);

  return res.status(200).json(result);
}

export async function meController(req: Request, res: Response) {
  const authUser = req.authUser;

  if (!authUser) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const user = await authService.getCurrentUser(authUser.sub);

  return res.status(200).json({ user });
}