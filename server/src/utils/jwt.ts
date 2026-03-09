import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import type { UserRole } from '../modules/auth/auth.types.js';

export type AuthTokenPayload = {
  sub: string;
  email: string;
  role: UserRole;
  merchantId: string | null;
  branchId: string | null;
};

export function signAccessToken(payload: AuthTokenPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  } as jwt.SignOptions);
}

export function verifyAccessToken(token: string): AuthTokenPayload {
  return jwt.verify(token, env.JWT_SECRET) as AuthTokenPayload;
}