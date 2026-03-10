export type DashboardMetricSummary = {
  totalSales: number;
  successfulTransactions: number;
  failedTransactions: number;
  pendingTransactions: number;
  nextSettlement: {
    id: string;
    provider: string;
    netAmount: number;
    scheduledFor: string;
    status: 'pending' | 'completed' | 'delayed';
  } | null;
};

export type DashboardTimePoint = {
  label: string;
  successfulAmount: number;
  failedAmount: number;
  pendingAmount: number;
  successfulCount: number;
  failedCount: number;
  pendingCount: number;
};

export type DashboardStatusBreakdown = {
  success: number;
  failed: number;
  pending: number;
};

export type DashboardFailedTransactionItem = {
  id: string;
  providerTransactionRef: string | null;
  amount: number;
  paymentMethod: string | null;
  failureReason: string | null;
  provider: string;
  createdAt: string;
};

export type DashboardOverviewResponse = {
  metrics: DashboardMetricSummary;
  statusBreakdown: DashboardStatusBreakdown;
  volumeSeries: DashboardTimePoint[];
  recentFailedTransactions: DashboardFailedTransactionItem[];
};