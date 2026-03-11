export type TransactionStatus = 'success' | 'failed' | 'pending';

export type TransactionRecord = {
  id: string;
  merchant_id: string;
  branch_id: string | null;
  transaction_source_id: string | null;
  provider: string;
  provider_transaction_ref: string | null;
  idempotency_key: string;
  amount: string;
  currency: string;
  status: TransactionStatus;
  transaction_type: string;
  payment_method: string | null;
  failure_reason: string | null;
  retry_of_transaction_id: string | null;
  attempt_number: number;
  initiated_at: string | null;
  received_at: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
};

export type TransactionResponse = {
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
  items: TransactionResponse[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
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
  retryTransaction: TransactionResponse;
};