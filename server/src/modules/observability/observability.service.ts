import { pool } from '../../config/db.js';
import type {
  ObservabilityEventItem,
  ObservabilityFailureReasonItem,
  ObservabilityMetricsResponse,
  ObservabilityOverviewResponse,
  ObservabilityProviderBreakdownItem,
  ObservabilityTimeSeriesPoint,
} from './observability.types.js';
import type { GetObservabilityQuery } from './observability.validation.js';

function getIntervalForRange(range: GetObservabilityQuery['range']) {
  if (range === '1h') {
    return {
      interval: `1 hour`,
      bucketSql: `TO_CHAR(DATE_TRUNC('minute', created_at), 'HH24:MI')`,
      groupSql: `DATE_TRUNC('minute', created_at)`,
    };
  }

  if (range === '24h') {
    return {
      interval: `24 hours`,
      bucketSql: `TO_CHAR(DATE_TRUNC('hour', created_at), 'HH24:00')`,
      groupSql: `DATE_TRUNC('hour', created_at)`,
    };
  }

  if (range === '7d') {
    return {
      interval: `7 days`,
      bucketSql: `TO_CHAR(DATE_TRUNC('day', created_at), 'DD Mon')`,
      groupSql: `DATE_TRUNC('day', created_at)`,
    };
  }

  return {
    interval: `30 days`,
    bucketSql: `TO_CHAR(DATE_TRUNC('day', created_at), 'DD Mon')`,
    groupSql: `DATE_TRUNC('day', created_at)`,
  };
}

export async function getObservabilityOverviewForMerchant(
  merchantId: string,
  query: GetObservabilityQuery
): Promise<ObservabilityOverviewResponse> {
  const metrics = await getMetrics(merchantId, query);
  const timeSeries = await getTimeSeries(merchantId, query);
  const failureReasons = await getFailureReasons(merchantId, query);
  const providerBreakdown = await getProviderBreakdown(merchantId, query);
  const recentEvents = await getRecentEvents(merchantId, query);

  return {
    metrics,
    timeSeries,
    failureReasons,
    providerBreakdown,
    recentEvents,
  };
}

async function getMetrics(
  merchantId: string,
  query: GetObservabilityQuery
): Promise<ObservabilityMetricsResponse> {
  const { interval } = getIntervalForRange(query.range);

  const result = await pool.query<{
    total_transactions: string;
    successful_transactions: string;
    failed_transactions: string;
    pending_transactions: string;
    avg_end_to_end_latency_ms: string;
    avg_platform_to_provider_latency_ms: string;
  }>(
    `
    SELECT
      COUNT(*)::text AS total_transactions,
      COUNT(*) FILTER (WHERE status = 'success')::text AS successful_transactions,
      COUNT(*) FILTER (WHERE status = 'failed')::text AS failed_transactions,
      COUNT(*) FILTER (WHERE status = 'pending')::text AS pending_transactions,
      COALESCE(AVG(
        CASE
          WHEN initiated_at IS NOT NULL AND completed_at IS NOT NULL
          THEN EXTRACT(EPOCH FROM (completed_at - initiated_at)) * 1000
          ELSE NULL
        END
      ), 0)::text AS avg_end_to_end_latency_ms,
      COALESCE(AVG(
        CASE
          WHEN received_at IS NOT NULL AND completed_at IS NOT NULL
          THEN EXTRACT(EPOCH FROM (completed_at - received_at)) * 1000
          ELSE NULL
        END
      ), 0)::text AS avg_platform_to_provider_latency_ms
    FROM transactions
    WHERE merchant_id = $1
      AND created_at >= NOW() - INTERVAL '${interval}'
    `,
    [merchantId]
  );

  const row = result.rows[0];
  const total = Number(row.total_transactions);

  return {
    totalTransactions: total,
    successfulTransactions: Number(row.successful_transactions),
    failedTransactions: Number(row.failed_transactions),
    pendingTransactions: Number(row.pending_transactions),
    successRate: total > 0 ? Number(((Number(row.successful_transactions) / total) * 100).toFixed(2)) : 0,
    avgEndToEndLatencyMs: Math.round(Number(row.avg_end_to_end_latency_ms)),
    avgPlatformToProviderLatencyMs: Math.round(Number(row.avg_platform_to_provider_latency_ms)),
  };
}

async function getTimeSeries(
  merchantId: string,
  query: GetObservabilityQuery
): Promise<ObservabilityTimeSeriesPoint[]> {
  const { interval, bucketSql, groupSql } = getIntervalForRange(query.range);

  const result = await pool.query<{
    label: string;
    success_count: string;
    failed_count: string;
    pending_count: string;
  }>(
    `
    SELECT
      ${bucketSql} AS label,
      COUNT(*) FILTER (WHERE status = 'success')::text AS success_count,
      COUNT(*) FILTER (WHERE status = 'failed')::text AS failed_count,
      COUNT(*) FILTER (WHERE status = 'pending')::text AS pending_count
    FROM transactions
    WHERE merchant_id = $1
      AND created_at >= NOW() - INTERVAL '${interval}'
    GROUP BY ${groupSql}
    ORDER BY ${groupSql} ASC
    `,
    [merchantId]
  );

  return result.rows.map((row) => ({
    label: row.label,
    successCount: Number(row.success_count),
    failedCount: Number(row.failed_count),
    pendingCount: Number(row.pending_count),
  }));
}

async function getFailureReasons(
  merchantId: string,
  query: GetObservabilityQuery
): Promise<ObservabilityFailureReasonItem[]> {
  const { interval } = getIntervalForRange(query.range);

  const result = await pool.query<{
    reason: string;
    count: string;
  }>(
    `
    SELECT
      COALESCE(failure_reason, 'Unknown') AS reason,
      COUNT(*)::text AS count
    FROM transactions
    WHERE merchant_id = $1
      AND status = 'failed'
      AND created_at >= NOW() - INTERVAL '${interval}'
    GROUP BY COALESCE(failure_reason, 'Unknown')
    ORDER BY COUNT(*) DESC
    LIMIT 5
    `,
    [merchantId]
  );

  return result.rows.map((row) => ({
    reason: row.reason,
    count: Number(row.count),
  }));
}

async function getProviderBreakdown(
  merchantId: string,
  query: GetObservabilityQuery
): Promise<ObservabilityProviderBreakdownItem[]> {
  const { interval } = getIntervalForRange(query.range);

  const result = await pool.query<{
    provider: string;
    success_count: string;
    failed_count: string;
    pending_count: string;
  }>(
    `
    SELECT
      provider,
      COUNT(*) FILTER (WHERE status = 'success')::text AS success_count,
      COUNT(*) FILTER (WHERE status = 'failed')::text AS failed_count,
      COUNT(*) FILTER (WHERE status = 'pending')::text AS pending_count
    FROM transactions
    WHERE merchant_id = $1
      AND created_at >= NOW() - INTERVAL '${interval}'
    GROUP BY provider
    ORDER BY provider ASC
    `,
    [merchantId]
  );

  return result.rows.map((row) => ({
    provider: row.provider,
    successCount: Number(row.success_count),
    failedCount: Number(row.failed_count),
    pendingCount: Number(row.pending_count),
  }));
}

async function getRecentEvents(
  merchantId: string,
  query: GetObservabilityQuery
): Promise<ObservabilityEventItem[]> {
  const { interval } = getIntervalForRange(query.range);

  const result = await pool.query<{
    id: string;
    provider: string;
    provider_transaction_ref: string | null;
    amount: string;
    status: 'success' | 'failed' | 'pending';
    failure_reason: string | null;
    created_at: string;
    attempt_number: number;
    retry_of_transaction_id: string | null;
  }>(
    `
    SELECT
      id,
      provider,
      provider_transaction_ref,
      amount::text,
      status,
      failure_reason,
      created_at,
      attempt_number,
      retry_of_transaction_id
    FROM transactions
    WHERE merchant_id = $1
      AND created_at >= NOW() - INTERVAL '${interval}'
    ORDER BY created_at DESC
    LIMIT 12
    `,
    [merchantId]
  );

  return result.rows.map((row) => ({
    id: row.id,
    type:
      row.retry_of_transaction_id && row.status === 'success'
        ? 'retry_success'
        : row.retry_of_transaction_id && row.status === 'failed'
          ? 'retry_failed'
          : row.status === 'success'
            ? 'transaction_success'
            : row.status === 'failed'
              ? 'transaction_failed'
              : 'transaction_pending',
    provider: row.provider,
    providerTransactionRef: row.provider_transaction_ref,
    amount: Number(row.amount),
    status: row.status,
    failureReason: row.failure_reason,
    createdAt: row.created_at,
    attemptNumber: row.attempt_number,
  }));
}