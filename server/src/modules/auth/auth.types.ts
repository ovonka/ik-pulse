export type UserRole = 'merchant' | 'admin';

export type UserRecord = {
  id: string;
  email: string;
  password_hash: string;
  role: UserRole;
  merchant_id: string | null;
  created_at: string;
  updated_at: string;
};

export type SafeUser = {
  id: string;
  email: string;
  role: UserRole;
  merchantId: string | null;
};

export type LoginResponse = {
  accessToken: string;
  user: SafeUser;
};