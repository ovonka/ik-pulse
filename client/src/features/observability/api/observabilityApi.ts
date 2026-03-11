import { apiGet } from '../../merchant-ops/api/apiClient';
import { getScopedMerchantId } from '../../merchant-ops/utils/getScopedMerchandId';

export type ObservabilityOverviewResponse = {
  metrics: {
    totalTransactions: number;
    successfulTransactions: number;
    failedTransactions: number;
    pendingTransactions: number;
    successRate: number;
    avgEndToEndLatencyMs: number;
    avgPlatformToProviderLatencyMs: number;
  };

  timeSeries: Array<{
    label: string;
    successCount: number;
    failedCount: number;
    pendingCount: number;
  }>;

  failureReasons: Array<{
    reason: string;
    count: number;
  }>;

  providerBreakdown: Array<{
    provider: string;
    successCount: number;
    failedCount: number;
    pendingCount: number;
  }>;

  recentEvents: Array<{
    id: string;
    type:
      | 'transaction_success'
      | 'transaction_failed'
      | 'transaction_pending'
      | 'retry_success'
      | 'retry_failed';
    provider: string;
    providerTransactionRef: string | null;
    amount: number;
    status: 'success' | 'failed' | 'pending';
    failureReason: string | null;
    createdAt: string;
    attemptNumber: number;
  }>;
};

export function getObservabilityOverviewRequest(
  range: '1h' | '24h' | '7d' | '30d'
) {
  const query = new URLSearchParams();
  const merchantId = getScopedMerchantId();

  query.set('range', range);

  if (merchantId) {
    query.set('merchantId', merchantId);
  }

  return apiGet<ObservabilityOverviewResponse>(
    `/observability/overview?${query.toString()}`
  );
}