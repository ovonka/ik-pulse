import bcrypt from 'bcrypt';
import { pool } from '../../config/db.js';

const PASSWORD = 'Password123!';
const PASSWORD_HASH_ROUNDS = 10;

type MerchantSeed = {
  merchantName: string;
  merchantEmail: string;
  branchName: string;
};

const merchantSeeds: MerchantSeed[] = [
  {
    merchantName: 'Rachel Catanho',
    merchantEmail: 'rachel.catanho@ikpulse.co.za',
    branchName: 'Sandton Store',
  },
  {
    merchantName: 'Kurt Muller',
    merchantEmail: 'kurt.muller@ikpulse.co.za',
    branchName: 'Cape Town Warehouse',
  },
  {
    merchantName: 'Taahir Kader',
    merchantEmail: 'taahir.kader@ikpulse.co.za',
    branchName: 'Pretoria Central',
  },
];

async function ensureMerchant(name: string) {
  const existing = await pool.query(
    `SELECT id FROM merchants WHERE name = $1 LIMIT 1`,
    [name]
  );

  if (existing.rows[0]) return existing.rows[0].id;

  const inserted = await pool.query(
    `
    INSERT INTO merchants (name, created_at, updated_at)
    VALUES ($1, NOW(), NOW())
    RETURNING id
    `,
    [name]
  );

  return inserted.rows[0].id;
}

async function ensureBranch(merchantId: string, branchName: string) {
  const existing = await pool.query(
    `
    SELECT id
    FROM branches
    WHERE merchant_id = $1 AND name = $2
    LIMIT 1
    `,
    [merchantId, branchName]
  );

  if (existing.rows[0]) return existing.rows[0].id;

  const inserted = await pool.query(
    `
    INSERT INTO branches (merchant_id, name, created_at, updated_at)
    VALUES ($1, $2, NOW(), NOW())
    RETURNING id
    `,
    [merchantId, branchName]
  );

  return inserted.rows[0].id;
}

async function upsertMerchantUser(
  email: string,
  passwordHash: string,
  merchantId: string,
  branchId: string
) {
  const existing = await pool.query(
    `SELECT id FROM users WHERE email = $1 LIMIT 1`,
    [email]
  );

  if (existing.rows[0]) {
    await pool.query(
      `
      UPDATE users
      SET
        password_hash = $2,
        role = 'merchant',
        merchant_id = $3,
        branch_id = $4,
        updated_at = NOW()
      WHERE email = $1
      `,
      [email, passwordHash, merchantId, branchId]
    );

    return existing.rows[0].id;
  }

  const inserted = await pool.query(
    `
    INSERT INTO users
    (email, password_hash, role, merchant_id, branch_id, created_at, updated_at)
    VALUES ($1, $2, 'merchant', $3, $4, NOW(), NOW())
    RETURNING id
    `,
    [email, passwordHash, merchantId, branchId]
  );

  return inserted.rows[0].id;
}

async function upsertInternalUser(
  email: string,
  role: 'admin' | 'support' | 'qa',
  passwordHash: string
) {
  const existing = await pool.query(
    `SELECT id FROM users WHERE email = $1 LIMIT 1`,
    [email]
  );

  if (existing.rows[0]) {
    await pool.query(
      `
      UPDATE users
      SET
        password_hash = $2,
        role = $3,
        merchant_id = NULL,
        branch_id = NULL,
        updated_at = NOW()
      WHERE email = $1
      `,
      [email, passwordHash, role]
    );

    return existing.rows[0].id;
  }

  const inserted = await pool.query(
    `
    INSERT INTO users
    (email, password_hash, role, merchant_id, branch_id, created_at, updated_at)
    VALUES ($1, $2, $3, NULL, NULL, NOW(), NOW())
    RETURNING id
    `,
    [email, passwordHash, role]
  );

  return inserted.rows[0].id;
}

async function seedInterviewUsers() {
  const passwordHash = await bcrypt.hash(PASSWORD, PASSWORD_HASH_ROUNDS);

  for (const merchantSeed of merchantSeeds) {
    console.log('Ensuring merchant:', merchantSeed.merchantName);
    const merchantId = await ensureMerchant(merchantSeed.merchantName);

    console.log('Ensuring branch:', merchantSeed.branchName);
    const branchId = await ensureBranch(
      merchantId,
      merchantSeed.branchName
    );

    console.log('Upserting merchant user:', merchantSeed.merchantEmail);
    await upsertMerchantUser(
      merchantSeed.merchantEmail,
      passwordHash,
      merchantId,
      branchId
    );
  }

  console.log('Upserting internal users...');
  await upsertInternalUser('admin@ikpulse.co.za', 'admin', passwordHash);
  await upsertInternalUser('support@ikpulse.co.za', 'support', passwordHash);
  await upsertInternalUser('qa@ikpulse.co.za', 'qa', passwordHash);

  console.log('Interview users seeded successfully');
  console.log(`Demo password: ${PASSWORD}`);

  process.exit(0);
}

seedInterviewUsers().catch((error) => {
  console.error('Failed to seed interview users', error);
  process.exit(1);
});