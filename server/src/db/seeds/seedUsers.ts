import { pool } from '../../config/db.js';
import { hashPassword } from '../../utils/passwords.js';

async function seedUsers() {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const merchantResult = await client.query<{
      id: string;
    }>(
      `
      INSERT INTO merchants (name, legal_name, email, status)
      VALUES ('Acme Retail', 'Acme Retail (Pty) Ltd', 'merchant@ikpulse.co.za', 'active')
      ON CONFLICT DO NOTHING
      RETURNING id
      `
    );

    let merchantId: string;

    if (merchantResult.rows[0]?.id) {
      merchantId = merchantResult.rows[0].id;
    } else {
      const existingMerchant = await client.query<{ id: string }>(
        `
        SELECT id
        FROM merchants
        WHERE email = $1
        LIMIT 1
        `,
        ['merchant@ikpulse.co.za']
      );

      merchantId = existingMerchant.rows[0].id;
    }

    const branchResult = await client.query<{ id: string }>(
      `
      INSERT INTO branches (merchant_id, name, code, city, status)
      VALUES ($1, 'Johannesburg Branch', 'JHB-001', 'Johannesburg', 'active')
      ON CONFLICT DO NOTHING
      RETURNING id
      `,
      [merchantId]
    );

    let branchId: string;

    if (branchResult.rows[0]?.id) {
      branchId = branchResult.rows[0].id;
    } else {
      const existingBranch = await client.query<{ id: string }>(
        `
        SELECT id
        FROM branches
        WHERE merchant_id = $1
        ORDER BY created_at ASC
        LIMIT 1
        `,
        [merchantId]
      );

      branchId = existingBranch.rows[0].id;
    }

    const adminPasswordHash = await hashPassword('Password123!');
    const merchantPasswordHash = await hashPassword('Password123!');
    const supportPasswordHash = await hashPassword('Password123!');
    const qaPasswordHash = await hashPassword('Password123!');

    await client.query(
      `
      INSERT INTO users (email, password_hash, role, merchant_id, branch_id)
      VALUES
        ($1, $2, 'admin', NULL, NULL),
        ($3, $4, 'merchant', $5, $6),
        ($7, $8, 'support', NULL, NULL),
        ($9, $10, 'qa', NULL, NULL)
      ON CONFLICT (email) DO NOTHING
      `,
      [
        'admin@ikpulse.co.za',
        adminPasswordHash,
        'merchant@ikpulse.co.za',
        merchantPasswordHash,
        merchantId,
        branchId,
        'support@ikpulse.co.za',
        supportPasswordHash,
        'qa@ikpulse.co.za',
        qaPasswordHash,
      ]
    );

    await client.query('COMMIT');
    console.log('Seeded merchants, branches, and users successfully');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Failed to seed users', error);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

seedUsers().catch(async (error) => {
  console.error('Unexpected seeding failure', error);
  await pool.end();
  process.exit(1);
});