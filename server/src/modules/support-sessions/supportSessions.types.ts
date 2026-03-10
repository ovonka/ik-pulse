export type SupportSessionStatus = 'active' | 'revoked' | 'expired' | 'used';
export type SupportAccessScope = 'read_only' | 'elevated';

export type SupportSessionRecord = {
  id: string;
  merchant_id: string;
  branch_id: string | null;
  support_code: string;
  status: SupportSessionStatus;
  access_scope: SupportAccessScope;
  created_by_user_id: string;
  consumed_by_user_id: string | null;
  reason: string | null;
  expires_at: string;
  consumed_at: string | null;
  revoked_at: string | null;
  created_at: string;
};

export type SupportSessionResponse = {
  id: string;
  merchantId: string;
  branchId: string | null;
  supportCode: string;
  status: SupportSessionStatus;
  accessScope: SupportAccessScope;
  reason: string | null;
  expiresAt: string;
  consumedAt: string | null;
  revokedAt: string | null;
  createdAt: string;
};

export type ConsumedSupportSessionResponse = {
  session: SupportSessionResponse;
  merchantContext: {
    merchantId: string;
    merchantName: string;
    branchId: string | null;
    requestedByEmail: string | null;
  };
};