export type SettlementStatus = 'pending' | 'completed' | 'delayed';

export type SettlementRecord = {
  id: string;
  merchant_id: string;
  branch_id: string | null;
  transaction_source_id: string | null;
  provider: string;
  provider_settlement_ref: string | null;
  gross_amount: string;
  fee_amount: string;
  net_amount: string;
  transaction_count: number;
  status: SettlementStatus;
  scheduled_for: string;
  settled_at: string | null;
  created_at: string;
  updated_at: string;
};

export type SettlementResponse = {
  id: string;
  merchantId: string;
  branchId: string | null;
  transactionSourceId: string | null;
  provider: string;
  providerSettlementRef: string | null;
  grossAmount: number;
  feeAmount: number;
  netAmount: number;
  transactionCount: number;
  status: SettlementStatus;
  scheduledFor: string;
  settledAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type SettlementsListResponse = {
  items: SettlementResponse[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
};

export type SettlementSummaryResponse = {
  totalSettledAmount: number;
  pendingSettlementAmount: number;
  averageSettlementValue: number;
  completedCount: number;
  pendingCount: number;
  delayedCount: number;
};