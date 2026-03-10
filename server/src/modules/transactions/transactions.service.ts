import { pool } from '../../config/db.js';
import type {
  TransactionRecord,
  TransactionResponse,
  TransactionSummaryResponse,
} from './transactions.types.js';
import type { GetTransactionsQuery } from './transactions.validation.js';

function toTransactionResponse(record: TransactionRecord): TransactionResponse {
  return {
    id: record.id,
    merchantId: record.merchant_id,
    branchId: record.branch_id,
    transactionSourceId: record.transaction_source_id,
    provider: record.provider,
    providerTransactionRef: record.provider_transaction_ref,
    idempotencyKey: record.idempotency_key,
    amount: Number(record.amount),
    currency: record.currency,
    status: record.status,
    transactionType: record.transaction_type,
    paymentMethod: record.payment_method,
    failureReason: record.failure_reason,
    initiatedAt: record.initiated_at,
    receivedAt: record.received_at,
    completedAt: record.completed_at,
    createdAt: record.created_at,
    updatedAt: record.updated_at,
  };
}

export async function getTransactionsForMerchant(
  merchantId: string,
  query: GetTransactionsQuery
) {
  const { page, pageSize, status, search } = query;
  const offset = (page - 1) * pageSize;

  const conditions: string[] = ['merchant_id = $1'];
  const values: unknown[] = [merchantId];
  let paramIndex = 2;

  if (status) {
    conditions.push(`status = $${paramIndex}`);
    values.push(status);
    paramIndex += 1;
  }

  if (search) {
    conditions.push(`(
      provider_transaction_ref ILIKE $${paramIndex}
      OR idempotency_key ILIKE $${paramIndex}
      OR COALESCE(payment_method, '') ILIKE $${paramIndex}
      OR provider ILIKE $${paramIndex}
    )`);
    values.push(`%${search}%`);
    paramIndex += 1;
  }

  const whereClause = conditions.join(' AND ');

  const countResult = await pool.query<{ count: string }>(
    `
    SELECT COUNT(*)::text AS count
    FROM transactions
    WHERE ${whereClause}
    `,
    values
  );

  const totalItems = Number(countResult.rows[0]?.count ?? 0);

  const listResult = await pool.query<TransactionRecord>(
    `
    SELECT *
    FROM transactions
    WHERE ${whereClause}
    ORDER BY created_at DESC
    LIMIT $${paramIndex}
    OFFSET $${paramIndex + 1}
    `,
    [...values, pageSize, offset]
  );

  return {
    items: listResult.rows.map(toTransactionResponse),
    pagination: {
      page,
      pageSize,
      totalItems,
      totalPages: Math.max(1, Math.ceil(totalItems / pageSize)),
    },
  };
}

export async function getTransactionSummaryForMerchant(
  merchantId: string
): Promise<TransactionSummaryResponse> {
  const result = await pool.query<{
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

  const row = result.rows[0];

  return {
    totalSales: Number(row.total_sales),
    successfulCount: Number(row.successful_count),
    failedCount: Number(row.failed_count),
    pendingCount: Number(row.pending_count),
  };
}