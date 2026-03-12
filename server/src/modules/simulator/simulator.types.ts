export type SimulatorActionType =
  | 'success_payment'
  | 'failed_payment'
  | 'pending_payment'
  | 'burst_traffic';

export type SimulatedTransactionResponse = {
  id: string;
  provider: string;
  providerTransactionRef: string | null;
  amount: number;
  currency: string;
  status: 'success' | 'failed' | 'pending';
  transactionType: string;
  paymentMethod: string | null;
  failureReason: string | null;
  attemptNumber: number;
  createdAt: string;
};

export type SimulatorActionResponse = {
  message: string;
  action: SimulatorActionType;
  insertedCount: number;
  transactions: SimulatedTransactionResponse[];
};