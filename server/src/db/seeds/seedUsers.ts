import { pool } from '../../config/db.js';
import { hashPassword } from '../../utils/passwords.js';

async function seedUsers() {
  const adminPasswordHash = await hashPassword('Password123!');
  const merchantPasswordHash = await hashPassword('Password123!');

  await pool.query(
    `
    INSERT INTO users (email, password_hash, role, merchant_id)
    VALUES
      ($1, $2, 'admin', NULL),
      ($3, $4, 'merchant', '11111111-1111-1111-1111-111111111111')
    ON CONFLICT (email) DO NOTHING
    `,
    [
      'admin@ikpulse.co.za',
      adminPasswordHash,
      'merchant@ikpulse.co.za',
      merchantPasswordHash,
    ]
  );

  console.log('Seeded users successfully');
  await pool.end();
}

seedUsers().catch(async (error) => {
  console.error('Failed to seed users', error);
  await pool.end();
  process.exit(1);
});