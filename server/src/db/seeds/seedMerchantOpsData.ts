import { faker } from '@faker-js/faker';
import { pool } from '../../config/db.js';

type TransactionStatus = 'success' | 'failed' | 'pending';
type SettlementStatus = 'completed' | 'pending' | 'delayed';

function randomTransactionStatus(): TransactionStatus {
  return faker.helpers.weightedArrayElement([
    { weight: 80, value: 'success' },
    { weight: 12, value: 'failed' },
    { weight: 8, value: 'pending' },
  ]) as TransactionStatus;
}

function randomSettlementStatus(): SettlementStatus {
  return faker.helpers.weightedArrayElement([
    { weight: 70, value: 'completed' },
    { weight: 20, value: 'pending' },
    { weight: 10, value: 'delayed' },
  ]) as SettlementStatus;
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

function randomProvider() {
  return faker.helpers.arrayElement(['ikhokha-sim', 'paystack-sim', 'ozow-sim']);
}

function randomTransactionType() {
  return faker.helpers.arrayElement(['card_payment', 'refund']);
}

function failureReasonFor(status: TransactionStatus) {
  if (status !== 'failed') return null;

  return faker.helpers.arrayElement([
    'Insufficient funds',
    'Card declined',
    'Network timeout',
    'Issuer unavailable',
    'Duplicate request detected',
    '3DS authentication failed',
  ]);
}

function getStartOfDayDaysAgo(daysAgo: number) {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - daysAgo);
  return date;
}

function getEndOfDayDaysAgo(daysAgo: number) {
  const date = new Date();
  date.setHours(23, 59, 59, 999);
  date.setDate(date.getDate() - daysAgo);
  return date;
}

function generateBusinessTrafficMultiplier(dayStart: Date) {
  const weekday = dayStart.getDay();

  let base = 1;

  if (weekday === 0 || weekday === 6) {
    base *= 0.65;
  }

  if (weekday === 5) {
    base *= 1.35;
  }

  const dayOfMonth = dayStart.getDate();
  if (dayOfMonth >= 25 || dayOfMonth <= 3) {
    base *= 1.15;
  }

  const randomFluctuation = faker.number.float({
    min: 0.75,
    max: 1.4,
    fractionDigits: 2,
  });

  return base * randomFluctuation;
}

function generateAmountForTransaction(status: TransactionStatus) {
  if (status === 'failed') {
    return faker.finance.amount({ min: 20, max: 2500, dec: 2 });
  }

  if (status === 'pending') {
    return faker.finance.amount({ min: 30, max: 3200, dec: 2 });
  }

  return faker.finance.amount({ min: 15, max: 4500, dec: 2 });
}

async function seedMerchantData(merchantId: string) {
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

  const branch = branchResult.rows[0] ?? null;

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

  const source = sourceResult.rows[0] ?? null;

  await pool.query(`DELETE FROM transactions WHERE merchant_id = $1`, [merchantId]);
  await pool.query(`DELETE FROM settlements WHERE merchant_id = $1`, [merchantId]);

  for (let day = 30; day >= 0; day -= 1) {
    const dayStart = getStartOfDayDaysAgo(day);
    const dayEnd = getEndOfDayDaysAgo(day);
    const multiplier = generateBusinessTrafficMultiplier(dayStart);

    const dailyTransactions = Math.max(
      12,
      Math.floor(
        faker.number.int({
          min: 28,
          max: 62,
        }) * multiplier
      )
    );

    for (let index = 0; index < dailyTransactions; index += 1) {
      const status = randomTransactionStatus();
      const amount = generateAmountForTransaction(status);

      const initiatedAt = faker.date.between({
        from: dayStart,
        to: dayEnd,
      });

      const receivedAt = new Date(
        initiatedAt.getTime() + faker.number.int({ min: 500, max: 25_000 })
      );

      const completedAt =
        status === 'pending'
          ? null
          : new Date(
              receivedAt.getTime() + faker.number.int({ min: 1_000, max: 45_000 })
            );

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
        `,
        [
          merchantId,
          branch?.id ?? null,
          source?.id ?? null,
          randomProvider(),
          `prov_${faker.string.alphanumeric(14).toUpperCase()}`,
          `idem_${faker.string.alphanumeric(20)}`,
          amount,
          status,
          randomTransactionType(),
          randomPaymentMethod(),
          failureReasonFor(status),
          initiatedAt,
          receivedAt,
          completedAt,
          initiatedAt,
          initiatedAt,
        ]
      );
    }
  }

  for (let index = 0; index < 14; index += 1) {
    const status = randomSettlementStatus();
    const scheduledFor = faker.date.between({
      from: getStartOfDayDaysAgo(30),
      to: new Date(),
    });

    const grossAmount = faker.finance.amount({
      min: 12000,
      max: 95000,
      dec: 2,
    });

    const feeAmount = (
      Number(grossAmount) *
      faker.number.float({
        min: 0.012,
        max: 0.032,
        fractionDigits: 4,
      })
    ).toFixed(2);

    const netAmount = (Number(grossAmount) - Number(feeAmount)).toFixed(2);

    const settledAt =
      status === 'completed'
        ? new Date(
            scheduledFor.getTime() + faker.number.int({ min: 3_600_000, max: 86_400_000 })
          )
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
        settled_at,
        created_at,
        updated_at
      )
      VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14
      )
      `,
      [
        merchantId,
        branch?.id ?? null,
        source?.id ?? null,
        randomProvider(),
        `sett_${faker.string.alphanumeric(12).toUpperCase()}`,
        grossAmount,
        feeAmount,
        netAmount,
        faker.number.int({ min: 45, max: 1250 }),
        status,
        scheduledFor,
        settledAt,
        scheduledFor,
        scheduledFor,
      ]
    );
  }
}

async function seedMerchantOpsData() {
  const merchantsResult = await pool.query<{ id: string }>(`
    SELECT id
    FROM merchants
    ORDER BY created_at ASC
  `);

  const merchants = merchantsResult.rows;

  if (!merchants.length) {
    throw new Error('No merchants found to seed transaction and settlement data');
  }

  console.log(`Seeding merchant ops data for ${merchants.length} merchant(s)...`);

  for (const merchant of merchants) {
    console.log(`Seeding merchant ${merchant.id}...`);
    await seedMerchantData(merchant.id);
  }

  console.log('Seeded transactions and settlements successfully for all merchants');
  process.exit(0);
}

seedMerchantOpsData().catch((error) => {
  console.error('Failed to seed merchant ops data', error);
  process.exit(1);
});