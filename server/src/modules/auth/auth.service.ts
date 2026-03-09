import { comparePassword } from '../../utils/passwords.js';
import { signAccessToken } from '../../utils/jwt.js';
import { findUserByEmail, findUserById } from '../users/users.service.js';
import type { LoginResponse, SafeUser } from './auth.types.js';

function toSafeUser(user: {
  id: string;
  email: string;
  role: 'merchant' | 'admin';
  merchant_id: string | null;
}): SafeUser {
  return {
    id: user.id,
    email: user.email,
    role: user.role,
    merchantId: user.merchant_id,
  };
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  const user = await findUserByEmail(email);

  if (!user) {
    throw new Error('Invalid email or password');
  }

  const isPasswordValid = await comparePassword(password, user.password_hash);

  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }

  const safeUser = toSafeUser(user);

  const accessToken = signAccessToken({
    sub: user.id,
    email: user.email,
    role: user.role,
    merchantId: user.merchant_id,
  });

  return {
    accessToken,
    user: safeUser,
  };
}

export async function getCurrentUser(userId: string): Promise<SafeUser> {
  const user = await findUserById(userId);

  if (!user) {
    throw new Error('User not found');
  }

  return toSafeUser(user);
}