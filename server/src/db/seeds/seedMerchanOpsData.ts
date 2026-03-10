import { faker } from '@faker-js/faker';
import { pool } from '../../config/db.js';

function randomStatus() {
  return faker.helpers.weightedArrayElement([
    { weight: 78, value: 'success' },
    { weight: 12, value: 'failed' },
    { weight: 10, value: 'pending' },
  ]) as 'success' | 'failed' | 'pending';
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
    throw new Error('No merchant found to seed transaction data');
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

  for (let index = 0; index < 120; index += 1) {
    const status = randomStatus();
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

  console.log('Seeded transactions successfully');
  process.exit(0);
}

seedMerchantOpsData().catch((error) => {
  console.error('Failed to seed merchant ops data', error);
  process.exit(1);
});