import { faker } from '@faker-js/faker';
import { pool } from '../../config/db.js';

function randomTransactionStatus() {
  return faker.helpers.weightedArrayElement([
    { weight: 78, value: 'success' },
    { weight: 12, value: 'failed' },
    { weight: 10, value: 'pending' },
  ]) as 'success' | 'failed' | 'pending';
}

function randomSettlementStatus() {
  return faker.helpers.weightedArrayElement([
    { weight: 70, value: 'completed' },
    { weight: 20, value: 'pending' },
    { weight: 10, value: 'delayed' },
  ]) as 'completed' | 'pending' | 'delayed';
}

function randomPaymentMethod() {
  return faker.helpers.arrayElement([
    'Visa •••• 4242',
    'Mastercard •••• 5555',
    'Amex •••• 1234',
    'Apple Pay',
    'Samsung Pay',
  ]);
}

function failureReasonFor(status: string) {
  if (status !== 'failed') return null;

  return faker.helpers.arrayElement([
    'Insufficient funds',
    'Card declined',
    'Network timeout',
    'Issuer unavailable',
    'Duplicate request detected',
  ]);
}

async function seedMerchantOpsData() {
  const merchantResult = await pool.query<{ id: string }>(`
    SELECT id
    FROM merchants
    ORDER BY created_at ASC
    LIMIT 1
  `);

  const merchant = merchantResult.rows[0];

  if (!merchant) {
    throw new Error('No merchant found to seed transaction and settlement data');
  }

  const branchResult = await pool.query<{ id: string }>(
    `
    SELECT id
    FROM branches
    WHERE merchant_id = $1
    ORDER BY created_at ASC
    LIMIT 1
    `,
    [merchant.id]
  );

  const branch = branchResult.rows[0] ?? null;

  const sourceResult = await pool.query<{ id: string }>(
    `
    SELECT id
    FROM transaction_sources
    WHERE merchant_id = $1
    ORDER BY created_at ASC
    LIMIT 1
    `,
    [merchant.id]
  );

  const source = sourceResult.rows[0] ?? null;

  await pool.query(`DELETE FROM transactions WHERE merchant_id = $1`, [merchant.id]);
  await pool.query(`DELETE FROM settlements WHERE merchant_id = $1`, [merchant.id]);

  for (let index = 0; index < 120; index += 1) {
    const status = randomTransactionStatus();
    const amount = faker.finance.amount({ min: 12, max: 3500, dec: 2 });
    const initiatedAt = faker.date.recent({ days: 12 });
    const receivedAt = faker.date.soon({ days: 0, refDate: initiatedAt });
    const completedAt =
      status === 'pending' ? null : faker.date.soon({ days: 0, refDate: receivedAt });

    await pool.query(
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
        initiated_at,
        received_at,
        completed_at
      )
      VALUES (
        $1, $2, $3, $4, $5, $6, $7, 'ZAR', $8, $9, $10, $11, $12, $13, $14
      )
      `,
      [
        merchant.id,
        branch?.id ?? null,
        source?.id ?? null,
        faker.helpers.arrayElement(['ikhokha-sim', 'paystack-sim', 'ozow-sim']),
        `prov_${faker.string.alphanumeric(14).toUpperCase()}`,
        `idem_${faker.string.alphanumeric(18)}`,
        amount,
        status,
        faker.helpers.arrayElement(['card_payment', 'refund']),
        randomPaymentMethod(),
        failureReasonFor(status),
        initiatedAt,
        receivedAt,
        completedAt,
      ]
    );
  }

  for (let index = 0; index < 14; index += 1) {
    const status = randomSettlementStatus();
    const grossAmount = faker.finance.amount({ min: 15000, max: 90000, dec: 2 });
    const feeAmount = (Number(grossAmount) * faker.number.float({ min: 0.01, max: 0.03 })).toFixed(2);
    const netAmount = (Number(grossAmount) - Number(feeAmount)).toFixed(2);
    const scheduledFor = faker.date.recent({ days: 10 });
    const settledAt =
      status === 'completed'
        ? faker.date.soon({ days: 1, refDate: scheduledFor })
        : null;

    await pool.query(
      `
      INSERT INTO settlements (
        merchant_id,
        branch_id,
        transaction_source_id,
        provider,
        provider_settlement_ref,
        gross_amount,
        fee_amount,
        net_amount,
        transaction_count,
        status,
        scheduled_for,
        settled_at
      )
      VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12
      )
      `,
      [
        merchant.id,
        branch?.id ?? null,
        source?.id ?? null,
        faker.helpers.arrayElement(['ikhokha-sim', 'paystack-sim', 'ozow-sim']),
        `sett_${faker.string.alphanumeric(12).toUpperCase()}`,
        grossAmount,
        feeAmount,
        netAmount,
        faker.number.int({ min: 50, max: 1200 }),
        status,
        scheduledFor,
        settledAt,
      ]
    );
  }

  console.log('Seeded transactions and settlements successfully');
  process.exit(0);
}

seedMerchantOpsData().catch((error) => {
  console.error('Failed to seed merchant ops data', error);
  process.exit(1);
});