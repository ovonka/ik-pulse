import { faker } from '@faker-js/faker';
import { pool } from '../../config/db.js';
import type {
  SimulatorActionResponse,
  SimulatorActionType,
  SimulatedTransactionResponse,
} from './simulator.types.js';

type TransactionRecord = {
  id: string;
  provider: string;
  provider_transaction_ref: string | null;
  amount: string;
  currency: string;
  status: 'success' | 'failed' | 'pending';
  transaction_type: string;
  payment_method: string | null;
  failure_reason: string | null;
  attempt_number: number;
  created_at: string;
};

function randomProvider() {
  return faker.helpers.arrayElement(['ikhokha-sim', 'paystack-sim', 'ozow-sim']);
}

function randomPaymentMethod() {
  return faker.helpers.arrayElement([
    'Visa •••• 4242',
    'Mastercard •••• 5555',
    'Amex •••• 1234',
    'Apple Pay',
    'Samsung Pay',
    'Google Pay',
  ]);
}

function randomAmount() {
  return faker.finance.amount({
    min: 15,
    max: 4500,
    dec: 2,
  });
}

function randomFailureReason() {
  return faker.helpers.arrayElement([
    'Insufficient funds',
    'Card declined',
    'Network timeout',
    'Issuer unavailable',
    '3DS authentication failed',
  ]);
}

function toResponse(record: TransactionRecord): SimulatedTransactionResponse {
  return {
    id: record.id,
    provider: record.provider,
    providerTransactionRef: record.provider_transaction_ref,
    amount: Number(record.amount),
    currency: record.currency,
    status: record.status,
    transactionType: record.transaction_type,
    paymentMethod: record.payment_method,
    failureReason: record.failure_reason,
    attemptNumber: record.attempt_number,
    createdAt: record.created_at,
  };
}

async function getMerchantContext(merchantId: string) {
  const branchResult = await pool.query<{ id: string }>(
    `
    SELECT id
    FROM branches
    WHERE merchant_id = $1
    ORDER BY created_at ASC
    LIMIT 1
    `,
    [merchantId]
  );

  const sourceResult = await pool.query<{ id: string }>(
    `
    SELECT id
    FROM transaction_sources
    WHERE merchant_id = $1
    ORDER BY created_at ASC
    LIMIT 1
    `,
    [merchantId]
  );

  return {
    branchId: branchResult.rows[0]?.id ?? null,
    transactionSourceId: sourceResult.rows[0]?.id ?? null,
  };
}

async function insertSimulatedTransaction(params: {
  merchantId: string;
  branchId: string | null;
  transactionSourceId: string | null;
  status: 'success' | 'failed' | 'pending';
}): Promise<SimulatedTransactionResponse> {
  const now = new Date();
  const receivedAt = new Date(now.getTime() + faker.number.int({ min: 500, max: 5000 }));
  const completedAt =
    params.status === 'pending'
      ? null
      : new Date(receivedAt.getTime() + faker.number.int({ min: 1000, max: 12000 }));

  const result = await pool.query<TransactionRecord>(
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
      completed_at,
      created_at,
      updated_at
    )
    VALUES (
      $1, $2, $3, $4, $5, $6, $7, 'ZAR', $8, $9, $10, $11, NULL, 1, $12, $13, $14, $15, $16
    )
    RETURNING
      id,
      provider,
      provider_transaction_ref,
      amount::text,
      currency,
      status,
      transaction_type,
      payment_method,
      failure_reason,
      attempt_number,
      created_at
    `,
    [
      params.merchantId,
      params.branchId,
      params.transactionSourceId,
      randomProvider(),
      `sim_${faker.string.alphanumeric(14).toUpperCase()}`,
      `idem_sim_${faker.string.alphanumeric(18)}`,
      randomAmount(),
      params.status,
      'card_payment',
      randomPaymentMethod(),
      params.status === 'failed' ? randomFailureReason() : null,
      now,
      receivedAt,
      completedAt,
      now,
      now,
    ]
  );

  return toResponse(result.rows[0]);
}

export async function simulateMerchantAction(params: {
  merchantId: string;
  action: SimulatorActionType;
}): Promise<SimulatorActionResponse> {
  const { merchantId, action } = params;
  const merchantContext = await getMerchantContext(merchantId);

  const transactions: SimulatedTransactionResponse[] = [];

  if (action === 'success_payment') {
    transactions.push(
      await insertSimulatedTransaction({
        merchantId,
        branchId: merchantContext.branchId,
        transactionSourceId: merchantContext.transactionSourceId,
        status: 'success',
      })
    );
  }

  if (action === 'failed_payment') {
    transactions.push(
      await insertSimulatedTransaction({
        merchantId,
        branchId: merchantContext.branchId,
        transactionSourceId: merchantContext.transactionSourceId,
        status: 'failed',
      })
    );
  }

  if (action === 'pending_payment') {
    transactions.push(
      await insertSimulatedTransaction({
        merchantId,
        branchId: merchantContext.branchId,
        transactionSourceId: merchantContext.transactionSourceId,
        status: 'pending',
      })
    );
  }

  if (action === 'burst_traffic') {
    const burstSize = faker.number.int({ min: 4, max: 8 });

    for (let index = 0; index < burstSize; index += 1) {
      const status = faker.helpers.weightedArrayElement([
        { weight: 72, value: 'success' },
        { weight: 18, value: 'failed' },
        { weight: 10, value: 'pending' },
      ]) as 'success' | 'failed' | 'pending';

      transactions.push(
        await insertSimulatedTransaction({
          merchantId,
          branchId: merchantContext.branchId,
          transactionSourceId: merchantContext.transactionSourceId,
          status,
        })
      );
    }
  }

  return {
    message: `Simulator action '${action}' completed successfully`,
    action,
    insertedCount: transactions.length,
    transactions,
  };
}