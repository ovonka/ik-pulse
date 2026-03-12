import { faker } from '@faker-js/faker';
import { pool } from '../config/db.js';

function randomStatus() {
  return faker.helpers.weightedArrayElement([
    { weight: 80, value: 'success' },
    { weight: 12, value: 'failed' },
    { weight: 8, value: 'pending' },
  ]);
}

function randomPaymentMethod() {
  return faker.helpers.arrayElement([
    'Visa •••• 4242',
    'Mastercard •••• 5555',
    'Apple Pay',
    'Google Pay',
    'Amex •••• 1234',
  ]);
}

function randomFailureReason(status: string) {
  if (status !== 'failed') return null;

  return faker.helpers.arrayElement([
    'Insufficient funds',
    'Issuer declined',
    'Network timeout',
    '3DS authentication failed',
  ]);
}

async function insertLiveTransaction() {
  const merchant = await pool.query<{ id: string }>(
    `SELECT id FROM merchants LIMIT 1`
  );

  const merchantId = merchant.rows[0].id;

  const status = randomStatus();
  const amount = faker.finance.amount({ min: 15, max: 2000, dec: 2 });

  await pool.query(
    `
    INSERT INTO transactions (
      merchant_id,
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
      $1,$2,$3,$4,$5,'ZAR',$6,$7,$8,$9,NOW(),NOW(),NOW()
    )
    `,
    [
      merchantId,
      faker.helpers.arrayElement(['ikhokha-sim', 'paystack-sim', 'ozow-sim']),
      `prov_${faker.string.alphanumeric(12)}`,
      `idem_${faker.string.alphanumeric(16)}`,
      amount,
      status,
      'card_payment',
      randomPaymentMethod(),
      randomFailureReason(status),
    ]
  );

  console.log("⚡ new live transaction");
}

export async function startLiveTransactionSimulator() {

  console.log("🚀 Live transaction simulator started");

  setInterval(async () => {
    try {

      const burstChance = Math.random();

      if (burstChance > 0.8) {
        const burstSize = faker.number.int({ min: 3, max: 8 });

        for (let i = 0; i < burstSize; i++) {
          await insertLiveTransaction();
        }

      } else {
        await insertLiveTransaction();
      }

    } catch (err) {
      console.error("Live simulator error", err);
    }

  }, faker.number.int({ min: 3000, max: 7000 }));
}