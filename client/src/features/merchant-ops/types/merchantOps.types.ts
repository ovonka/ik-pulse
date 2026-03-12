export type TransactionStatus = 'success' | 'failed' | 'pending';
export type SettlementStatus = 'pending' | 'completed' | 'delayed';

export type Pagination = {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
};

export type TransactionItem = {
  id: string;
  merchantId: string;
  branchId: string | null;
  transactionSourceId: string | null;
  provider: string;
  providerTransactionRef: string | null;
  idempotencyKey: string;
  amount: number;
  currency: string;
  status: TransactionStatus;
  transactionType: string;
  paymentMethod: string | null;
  failureReason: string | null;
  retryOfTransactionId: string | null;
  attemptNumber: number;
  initiatedAt: string | null;
  receivedAt: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type TransactionsListResponse = {
  items: TransactionItem[];
  pagination: Pagination;
};

export type TransactionSummaryResponse = {
  totalSales: number;
  successfulCount: number;
  failedCount: number;
  pendingCount: number;
};

export type RetryTransactionResponse = {
  message: string;
  outcome: 'success' | 'failed';
  originalTransactionId: string;
  retryTransaction: TransactionItem;
};

export type SettlementItem = {
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
  items: SettlementItem[];
  pagination: Pagination;
};

export type SettlementSummaryResponse = {
  totalSettledAmount: number;
  pendingSettlementAmount: number;
  averageSettlementValue: number;
  completedCount: number;
  pendingCount: number;
  delayedCount: number;
};

export type DashboardOverviewResponse = {
  metrics: {
    totalSales: number;
    successfulTransactions: number;
    failedTransactions: number;
    pendingTransactions: number;
    nextSettlement: {
      id: string;
      provider: string;
      netAmount: number;
      scheduledFor: string;
      status: SettlementStatus;
    } | null;
  };
  statusBreakdown: {
    success: number;
    failed: number;
    pending: number;
  };
  volumeSeries: Array<{
    label: string;
    successfulAmount: number;
    failedAmount: number;
    pendingAmount: number;
    successfulCount: number;
    failedCount: number;
    pendingCount: number;
  }>;
  recentFailedTransactions: Array<{
    id: string;
    providerTransactionRef: string | null;
    amount: number;
    paymentMethod: string | null;
    failureReason: string | null;
    provider: string;
    createdAt: string;
  }>;
};