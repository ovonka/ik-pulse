import { pool } from '../../config/db.js'

async function cleanupDemoData() {
  const client = await pool.connect()

  try {
    await client.query('BEGIN')

    // Delete users first
    await client.query(`
      DELETE FROM users
      WHERE is_demo = TRUE
    `)

    // Delete branches
    await client.query(`
      DELETE FROM branches
      WHERE is_demo = TRUE
    `)

    // Delete merchants
    await client.query(`
      DELETE FROM merchants
      WHERE is_demo = TRUE
    `)

    await client.query('COMMIT')

    console.log('Demo interview data removed successfully')
  } catch (error) {
    await client.query('ROLLBACK')
    console.error('Failed to remove demo data', error)
  } finally {
    client.release()
    await pool.end()
  }
}

cleanupDemoData()