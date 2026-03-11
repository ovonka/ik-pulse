import { pool } from '../../config/db.js';
import type {
  SettlementRecord,
  SettlementResponse,
  SettlementSummaryResponse,
} from './settlements.types.js';
import type { GetSettlementsQuery } from './settlements.validation.js';

function toSettlementResponse(record: SettlementRecord): SettlementResponse {
  return {
    id: record.id,
    merchantId: record.merchant_id,
    branchId: record.branch_id,
    transactionSourceId: record.transaction_source_id,
    provider: record.provider,
    providerSettlementRef: record.provider_settlement_ref,
    grossAmount: Number(record.gross_amount),
    feeAmount: Number(record.fee_amount),
    netAmount: Number(record.net_amount),
    transactionCount: record.transaction_count,
    status: record.status,
    scheduledFor: record.scheduled_for,
    settledAt: record.settled_at,
    createdAt: record.created_at,
    updatedAt: record.updated_at,
  };
}

export async function getSettlementsForMerchant(
  merchantId: string,
  query: GetSettlementsQuery
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
      provider_settlement_ref ILIKE $${paramIndex}
      OR provider ILIKE $${paramIndex}
    )`);
    values.push(`%${search}%`);
    paramIndex += 1;
  }

  const whereClause = conditions.join(' AND ');

  const countResult = await pool.query<{ count: string }>(
    `
    SELECT COUNT(*)::text AS count
    FROM settlements
    WHERE ${whereClause}
    `,
    values
  );

  const totalItems = Number(countResult.rows[0]?.count ?? 0);

  const listResult = await pool.query<SettlementRecord>(
    `
    SELECT *
    FROM settlements
    WHERE ${whereClause}
    ORDER BY scheduled_for DESC
    LIMIT $${paramIndex}
    OFFSET $${paramIndex + 1}
    `,
    [...values, pageSize, offset]
  );

  return {
    items: listResult.rows.map(toSettlementResponse),
    pagination: {
      page,
      pageSize,
      totalItems,
      totalPages: Math.max(1, Math.ceil(totalItems / pageSize)),
    },
  };
}

export async function getSettlementSummaryForMerchant(
  merchantId: string
): Promise<SettlementSummaryResponse> {
  const result = await pool.query<{
    total_settled_amount: string;
    pending_settlement_amount: string;
    average_settlement_value: string;
    completed_count: string;
    pending_count: string;
    delayed_count: string;
  }>(
    `
    SELECT
      COALESCE(SUM(CASE WHEN status = 'completed' THEN net_amount ELSE 0 END), 0)::text AS total_settled_amount,
      COALESCE(SUM(CASE WHEN status = 'pending' THEN net_amount ELSE 0 END), 0)::text AS pending_settlement_amount,
      COALESCE(AVG(net_amount), 0)::text AS average_settlement_value,
      COUNT(*) FILTER (WHERE status = 'completed')::text AS completed_count,
      COUNT(*) FILTER (WHERE status = 'pending')::text AS pending_count,
      COUNT(*) FILTER (WHERE status = 'delayed')::text AS delayed_count
    FROM settlements
    WHERE merchant_id = $1
    `,
    [merchantId]
  );

  const row = result.rows[0];

  return {
    totalSettledAmount: Number(row.total_settled_amount),
    pendingSettlementAmount: Number(row.pending_settlement_amount),
    averageSettlementValue: Number(row.average_settlement_value),
    completedCount: Number(row.completed_count),
    pendingCount: Number(row.pending_count),
    delayedCount: Number(row.delayed_count),
  };
}