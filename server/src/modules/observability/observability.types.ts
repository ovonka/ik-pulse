export type ObservabilityMetricsResponse = {
  totalTransactions: number;
  successfulTransactions: number;
  failedTransactions: number;
  pendingTransactions: number;
  successRate: number;
  avgEndToEndLatencyMs: number;
  avgPlatformToProviderLatencyMs: number;
};

export type ObservabilityTimeSeriesPoint = {
  label: string;
  successCount: number;
  failedCount: number;
  pendingCount: number;
};

export type ObservabilityFailureReasonItem = {
  reason: string;
  count: number;
};

export type ObservabilityProviderBreakdownItem = {
  provider: string;
  successCount: number;
  failedCount: number;
  pendingCount: number;
};

export type ObservabilityEventItem = {
  id: string;
  type: 'transaction_success' | 'transaction_failed' | 'transaction_pending' | 'retry_success' | 'retry_failed';
  provider: string;
  providerTransactionRef: string | null;
  amount: number;
  status: 'success' | 'failed' | 'pending';
  failureReason: string | null;
  createdAt: string;
  attemptNumber: number;
};

export type ObservabilityOverviewResponse = {
  metrics: ObservabilityMetricsResponse;
  timeSeries: ObservabilityTimeSeriesPoint[];
  failureReasons: ObservabilityFailureReasonItem[];
  providerBreakdown: ObservabilityProviderBreakdownItem[];
  recentEvents: ObservabilityEventItem[];
};