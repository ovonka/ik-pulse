export type DashboardFilter =
  | 'sales'
  | 'success'
  | 'failed'
  | 'pending'
  | 'settlement';

export type ChartRange = '24h' | '3d' | '7d' | '14d' | '30d';

export type TransactionStatus = 'success' | 'failed' | 'pending';

export type RecentTransaction = {
  id: string;
  merchant: string;
  amount: number;
  paymentMethod: string;
  timestamp: string;
  reason?: string;
  status: TransactionStatus;
};

export type TransactionVolumePoint = {
  label: string;
  value: number;
};

export type StatusBreakdownItem = {
  name: string;
  value: number;
};