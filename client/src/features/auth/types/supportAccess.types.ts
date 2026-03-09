export type SupportAccessSession = {
  code: string;
  status: 'active' | 'revoked' | 'expired';
  expiresAt: string;
  reason: string;
};