import { pool } from '../../config/db.js'
import { hashPassword } from '../../utils/passwords.js'

async function seedInterviewUsers() {
  const client = await pool.connect()

  try {
    await client.query('BEGIN')

    // -------------------------------
    // Create demo merchant
    // -------------------------------

    const merchantResult = await client.query<{
      id: string
    }>(
      `
      INSERT INTO merchants (name, legal_name, email, status, is_demo)
      VALUES (
        'Interview Demo Merchant',
        'Interview Demo Merchant (Pty) Ltd',
        'demo@ikpulse.co.za',
        'active',
        TRUE
      )
      ON CONFLICT DO NOTHING
      RETURNING id
      `
    )

    let merchantId: string

    if (merchantResult.rows[0]) {
      merchantId = merchantResult.rows[0].id
    } else {
      const existing = await client.query<{ id: string }>(
        `SELECT id FROM merchants WHERE email = $1 LIMIT 1`,
        ['demo@ikpulse.co.za']
      )
      merchantId = existing.rows[0].id
    }

    // -------------------------------
    // Create branch
    // -------------------------------

    const branchResult = await client.query<{ id: string }>(
      `
      INSERT INTO branches (merchant_id, name, code, city, status, is_demo)
      VALUES ($1, 'Johannesburg Branch', 'JHB-DEMO', 'Johannesburg', 'active', TRUE)
      ON CONFLICT DO NOTHING
      RETURNING id
      `,
      [merchantId]
    )

    let branchId: string

    if (branchResult.rows[0]) {
      branchId = branchResult.rows[0].id
    } else {
      const existingBranch = await client.query<{ id: string }>(
        `
        SELECT id
        FROM branches
        WHERE merchant_id = $1
        LIMIT 1
        `,
        [merchantId]
      )
      branchId = existingBranch.rows[0].id
    }

    // -------------------------------
    // Passwords
    // -------------------------------

    const passwordHash = await hashPassword('Password123!')

    // -------------------------------
    // Create interview panel users
    // -------------------------------

    await client.query(
      `
      INSERT INTO users (email, password_hash, role, merchant_id, branch_id, is_demo)
      VALUES
        ('admin@ikpulse.co.za', $1, 'admin', NULL, NULL, TRUE),
        ('kurt.muller@ikpulse.co.za', $1, 'merchant', $2, $3, TRUE),
        ('taahir.kader@ikpulse.co.za', $1, 'merchant', $2, $3, TRUE),
        ('rachel.catanho@ikpulse.co.za', $1, 'merchant', $2, $3, TRUE)
      ON CONFLICT (email) DO NOTHING
      `,
      [passwordHash, merchantId, branchId]
    )

    await client.query('COMMIT')

    console.log('Interview demo users seeded successfully')
  } catch (error) {
    await client.query('ROLLBACK')
    console.error('Failed to seed interview users', error)
  } finally {
    client.release()
    await pool.end()
  }
}

seedInterviewUsers()