export type UserRole = 'merchant' | 'admin' | 'support' | 'qa';

export type AuthUser = {
  id: string;
  email: string;
  role: UserRole;
  merchantId: string | null;
  branchId: string | null;
};

export type LoginResponse = {
  accessToken: string;
  user: AuthUser;
};

export type MeResponse = {
  user: AuthUser;
};

export type LoginPayload = {
  email: string;
  password: string;
};