import pool from '../database/index.js'

export async function findUserByEmail(email) {
  const query = `
    SELECT id, username, email, password_hash
    FROM users
    WHERE email = $1 AND is_active = true
    LIMIT 1
  `

  const result = await pool.query(query, [email])
  return result.rows[0]
}
