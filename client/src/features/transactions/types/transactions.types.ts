export type TransactionStatus = 'success' | 'failed' | 'pending';

export type TransactionItem = {
  id: string;
  merchant: string;
  amount: number;
  status: TransactionStatus;
  paymentMethod: string;
  timestamp: string;
  idempotencyKey: string;
};

export type TransactionFilter = 'all' | 'success' | 'failed' | 'pending';