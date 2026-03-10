import { pool } from '../../config/db.js';
import type {
  DashboardFailedTransactionItem,
  DashboardMetricSummary,
  DashboardOverviewResponse,
  DashboardStatusBreakdown,
  DashboardTimePoint,
} from './dashboard.types.js';

export async function getDashboardOverviewForMerchant(
  merchantId: string
): Promise<DashboardOverviewResponse> {
  const metrics = await getDashboardMetrics(merchantId);
  const statusBreakdown = await getDashboardStatusBreakdown(merchantId);
  const volumeSeries = await getDashboardVolumeSeries(merchantId);
  const recentFailedTransactions = await getRecentFailedTransactions(merchantId);

  return {
    metrics,
    statusBreakdown,
    volumeSeries,
    recentFailedTransactions,
  };
}

async function getDashboardMetrics(
  merchantId: string
): Promise<DashboardMetricSummary> {
  const transactionSummaryResult = await pool.query<{
    total_sales: string;
    successful_count: string;
    failed_count: string;
    pending_count: string;
  }>(
    `
    SELECT
      COALESCE(SUM(CASE WHEN status = 'success' THEN amount ELSE 0 END), 0)::text AS total_sales,
      COUNT(*) FILTER (WHERE status = 'success')::text AS successful_count,
      COUNT(*) FILTER (WHERE status = 'failed')::text AS failed_count,
      COUNT(*) FILTER (WHERE status = 'pending')::text AS pending_count
    FROM transactions
    WHERE merchant_id = $1
    `,
    [merchantId]
  );

  const nextSettlementResult = await pool.query<{
    id: string;
    provider: string;
    net_amount: string;
    scheduled_for: string;
    status: 'pending' | 'completed' | 'delayed';
  }>(
    `
    SELECT
      id,
      provider,
      net_amount::text,
      scheduled_for,
      status
    FROM settlements
    WHERE merchant_id = $1
      AND status IN ('pending', 'delayed')
    ORDER BY scheduled_for ASC
    LIMIT 1
    `,
    [merchantId]
  );

  const transactionSummary = transactionSummaryResult.rows[0];
  const nextSettlementRow = nextSettlementResult.rows[0];

  return {
    totalSales: Number(transactionSummary.total_sales),
    successfulTransactions: Number(transactionSummary.successful_count),
    failedTransactions: Number(transactionSummary.failed_count),
    pendingTransactions: Number(transactionSummary.pending_count),
    nextSettlement: nextSettlementRow
      ? {
          id: nextSettlementRow.id,
          provider: nextSettlementRow.provider,
          netAmount: Number(nextSettlementRow.net_amount),
          scheduledFor: nextSettlementRow.scheduled_for,
          status: nextSettlementRow.status,
        }
      : null,
  };
}

async function getDashboardStatusBreakdown(
  merchantId: string
): Promise<DashboardStatusBreakdown> {
  const result = await pool.query<{
    success_count: string;
    failed_count: string;
    pending_count: string;
  }>(
    `
    SELECT
      COUNT(*) FILTER (WHERE status = 'success')::text AS success_count,
      COUNT(*) FILTER (WHERE status = 'failed')::text AS failed_count,
      COUNT(*) FILTER (WHERE status = 'pending')::text AS pending_count
    FROM transactions
    WHERE merchant_id = $1
    `,
    [merchantId]
  );

  const row = result.rows[0];

  return {
    success: Number(row.success_count),
    failed: Number(row.failed_count),
    pending: Number(row.pending_count),
  };
}

async function getDashboardVolumeSeries(
  merchantId: string
): Promise<DashboardTimePoint[]> {
  const result = await pool.query<{
    label: string;
    successful_amount: string;
    failed_amount: string;
    pending_amount: string;
    successful_count: string;
    failed_count: string;
    pending_count: string;
  }>(
    `
    SELECT
      TO_CHAR(DATE_TRUNC('day', created_at), 'DD Mon') AS label,
      COALESCE(SUM(CASE WHEN status = 'success' THEN amount ELSE 0 END), 0)::text AS successful_amount,
      COALESCE(SUM(CASE WHEN status = 'failed' THEN amount ELSE 0 END), 0)::text AS failed_amount,
      COALESCE(SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END), 0)::text AS pending_amount,
      COUNT(*) FILTER (WHERE status = 'success')::text AS successful_count,
      COUNT(*) FILTER (WHERE status = 'failed')::text AS failed_count,
      COUNT(*) FILTER (WHERE status = 'pending')::text AS pending_count
    FROM transactions
    WHERE merchant_id = $1
      AND created_at >= NOW() - INTERVAL '7 days'
    GROUP BY DATE_TRUNC('day', created_at)
    ORDER BY DATE_TRUNC('day', created_at) ASC
    `,
    [merchantId]
  );

  return result.rows.map((row) => ({
    label: row.label,
    successfulAmount: Number(row.successful_amount),
    failedAmount: Number(row.failed_amount),
    pendingAmount: Number(row.pending_amount),
    successfulCount: Number(row.successful_count),
    failedCount: Number(row.failed_count),
    pendingCount: Number(row.pending_count),
  }));
}

async function getRecentFailedTransactions(
  merchantId: string
): Promise<DashboardFailedTransactionItem[]> {
  const result = await pool.query<{
    id: string;
    provider_transaction_ref: string | null;
    amount: string;
    payment_method: string | null;
    failure_reason: string | null;
    provider: string;
    created_at: string;
  }>(
    `
    SELECT
      id,
      provider_transaction_ref,
      amount::text,
      payment_method,
      failure_reason,
      provider,
      created_at
    FROM transactions
    WHERE merchant_id = $1
      AND status = 'failed'
    ORDER BY created_at DESC
    LIMIT 4
    `,
    [merchantId]
  );

  return result.rows.map((row) => ({
    id: row.id,
    providerTransactionRef: row.provider_transaction_ref,
    amount: Number(row.amount),
    paymentMethod: row.payment_method,
    failureReason: row.failure_reason,
    provider: row.provider,
    createdAt: row.created_at,
  }));
}