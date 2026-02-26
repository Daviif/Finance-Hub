import pool from '../database/index.js'


export async function findAllUsers() {
  const query = 'SELECT id, username, email, created_at FROM users'
  const { rows } = await pool.query(query)
  return rows
}


export async function findUserByEmail(email) {
  const query = 'SELECT * FROM users WHERE email = $1'
  const values = [email]
  const { rows } = await pool.query(query, values)
  return rows[0]
}


export async function createUser({ username, email, passwordHash }) {
  const query = `
    INSERT INTO users (username, email, password)
    VALUES ($1, $2, $3)
    RETURNING id, username, email, created_at
  `
  const values = [username, email, passwordHash]
  const { rows } = await pool.query(query, values)
  return rows[0]
}


export async function updateUserPassword(userId, passwordHash) {
  const query = `
    UPDATE users
    SET password = $2
    WHERE id = $1
    RETURNING id, username, email
  `
  const values = [userId, passwordHash]
  const { rows } = await pool.query(query, values)
  return rows[0]
}