export type SupportAccessStatus =
  | 'active'
  | 'revoked'
  | 'expired'
  | 'used'
  | 'resolved';

export type SupportAccessScope = 'read_only' | 'elevated';

export type SupportAccessSession = {
  id: string;
  merchantId: string;
  branchId: string | null;
  supportCode: string;
  status: SupportAccessStatus;
  accessScope: SupportAccessScope;
  reason: string | null;
  resolutionNote: string | null;
  expiresAt: string;
  consumedAt: string | null;
  revokedAt: string | null;
  resolvedAt: string | null;
  createdAt: string;
};

export type SupportAccessNullableSessionResponse = {
  session: SupportAccessSession | null;
};

export type SupportAccessRequiredSessionResponse = {
  session: SupportAccessSession;
};

export type CreateSupportAccessPayload = {
  reason: string;
  accessScope: SupportAccessScope;
  branchId?: string | null;
};