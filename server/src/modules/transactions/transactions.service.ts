import { faker } from '@faker-js/faker';
import { pool } from '../../config/db.js';
import type {
  RetryTransactionResponse,
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
    retryOfTransactionId: record.retry_of_transaction_id,
    attemptNumber: record.attempt_number,
    initiatedAt: record.initiated_at,
    receivedAt: record.received_at,
    completedAt: record.completed_at,
    createdAt: record.created_at,
    updatedAt: record.updated_at,
  };
}

function randomProvider() {
  return faker.helpers.arrayElement(['ikhokha-sim', 'paystack-sim', 'ozow-sim']);
}

function getRetryOutcomeForFailureReason(
  failureReason: string | null
): 'success' | 'failed' {
  if (!failureReason) {
    return faker.helpers.weightedArrayElement([
      { weight: 65, value: 'success' },
      { weight: 35, value: 'failed' },
    ]) as 'success' | 'failed';
  }

  const reason = failureReason.toLowerCase();

  if (reason.includes('network') || reason.includes('timeout')) {
    return faker.helpers.weightedArrayElement([
      { weight: 78, value: 'success' },
      { weight: 22, value: 'failed' },
    ]) as 'success' | 'failed';
  }

  if (reason.includes('issuer')) {
    return faker.helpers.weightedArrayElement([
      { weight: 68, value: 'success' },
      { weight: 32, value: 'failed' },
    ]) as 'success' | 'failed';
  }

  if (reason.includes('insufficient')) {
    return faker.helpers.weightedArrayElement([
      { weight: 20, value: 'success' },
      { weight: 80, value: 'failed' },
    ]) as 'success' | 'failed';
  }

  if (reason.includes('declined')) {
    return faker.helpers.weightedArrayElement([
      { weight: 35, value: 'success' },
      { weight: 65, value: 'failed' },
    ]) as 'success' | 'failed';
  }

  return faker.helpers.weightedArrayElement([
    { weight: 60, value: 'success' },
    { weight: 40, value: 'failed' },
  ]) as 'success' | 'failed';
}

function getRetryFailureReason(outcome: 'success' | 'failed'): string | null {
  if (outcome === 'success') {
    return null;
  }

  return faker.helpers.arrayElement([
    'Retry failed: issuer still unavailable',
    'Retry failed: customer balance unchanged',
    'Retry failed: provider timeout',
    'Retry failed: downstream processor unavailable',
  ]);
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

export async function retryFailedTransactionForMerchant(params: {
  merchantId: string;
  transactionId: string;
}): Promise<RetryTransactionResponse> {
  const { merchantId, transactionId } = params;

  const originalResult = await pool.query<TransactionRecord>(
    `
    SELECT *
    FROM transactions
    WHERE id = $1
      AND merchant_id = $2
    LIMIT 1
    `,
    [transactionId, merchantId]
  );

  const originalTransaction = originalResult.rows[0];

  if (!originalTransaction) {
    throw new Error('Transaction not found');
  }

  if (originalTransaction.status !== 'failed') {
    throw new Error('Only failed transactions can be retried');
  }

  const outcome = getRetryOutcomeForFailureReason(originalTransaction.failure_reason);

  const now = new Date();
  const receivedAt = new Date(now.getTime() + faker.number.int({ min: 500, max: 4000 }));
  const completedAt = new Date(
  receivedAt.getTime() + faker.number.int({ min: 1000, max: 7000 })
);

  const retryResult = await pool.query<TransactionRecord>(
    `
    INSERT INTO transactions (
      merchant_id,
      branch_id,
      transaction_source_id,
      provider,
      provider_transaction_ref,
      idempotency_key,
      amount,
      currency,
      status,
      transaction_type,
      payment_method,
      failure_reason,
      retry_of_transaction_id,
      attempt_number,
      initiated_at,
      received_at,
      completed_at
    )
    VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17
    )
    RETURNING *
    `,
    [
      originalTransaction.merchant_id,
      originalTransaction.branch_id,
      originalTransaction.transaction_source_id,
      originalTransaction.provider || randomProvider(),
      `retry_${faker.string.alphanumeric(14).toUpperCase()}`,
      `idem_retry_${faker.string.alphanumeric(18)}`,
      originalTransaction.amount,
      originalTransaction.currency,
      outcome,
      originalTransaction.transaction_type,
      originalTransaction.payment_method,
      getRetryFailureReason(outcome),
      originalTransaction.id,
      (originalTransaction.attempt_number ?? 1) + 1,
      now,
      receivedAt,
      completedAt,
    ]
  );

  const retryTransaction = retryResult.rows[0];

  return {
    message:
      outcome === 'success'
        ? 'Retry succeeded'
        : 'Retry failed again',
    outcome,
    originalTransactionId: originalTransaction.id,
    retryTransaction: toTransactionResponse(retryTransaction),
  };
}