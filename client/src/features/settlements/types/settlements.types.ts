export type SettlementStatus = 'completed' | 'pending' | 'delayed';

export type SettlementMetricSummary = {
  totalSettledLast7d: number;
  pendingSettlement: number;
  averageSettlementTime: string;
  settlementAccuracy: string;
};

export type NextSettlement = {
  scheduledFor: string;
  status: SettlementStatus;
  grossAmount: number;
  transactionCount: number;
  estimatedFees: number;
  netSettlement: number;
};

export type SettlementHistoryItem = {
  id: string;
  amount: number;
  status: SettlementStatus;
  scheduledDate: string;
  actualDate: string;
  transactionCount: number;
};