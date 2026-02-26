import pool from '../database/index.js'
import crypto from 'crypto'


export async function createPasswordResetToken(userId, expiresInHours = 1) {
  const token = crypto.randomBytes(32).toString('hex')
  const expiresAt = new Date(Date.now() + expiresInHours * 60 * 60 * 1000)

  const query = `
    INSERT INTO password_reset_tokens (user_id, token, expires_at)
    VALUES ($1, $2, $3)
    RETURNING id, token, expires_at
  `
  const values = [userId, token, expiresAt]
  const { rows } = await pool.query(query, values)
  return rows[0]
}


export async function findValidResetToken(token) {
  const query = `
    SELECT id, user_id, token, expires_at, used
    FROM password_reset_tokens
    WHERE token = $1 AND used = FALSE AND expires_at > NOW()
  `
  const values = [token]
  const { rows } = await pool.query(query, values)
  return rows[0]
}


export async function markTokenAsUsed(tokenId) {
  const query = `
    UPDATE password_reset_tokens
    SET used = TRUE
    WHERE id = $1
    RETURNING id, token, user_id
  `
  const values = [tokenId]
  const { rows } = await pool.query(query, values)
  return rows[0]
}


export async function deleteExpiredTokens() {
  const query = `
    DELETE FROM password_reset_tokens
    WHERE expires_at < NOW() OR used = TRUE
  `
  await pool.query(query)
}


export async function findUserResetTokens(userId) {
  const query = `
    SELECT id, token, expires_at
    FROM password_reset_tokens
    WHERE user_id = $1 AND used = FALSE AND expires_at > NOW()
  `
  const values = [userId]
  const { rows } = await pool.query(query, values)
  return rows
}


export async function invalidateAllUserTokens(userId) {
  const query = `
    UPDATE password_reset_tokens
    SET used = TRUE
    WHERE user_id = $1 AND used = FALSE
  `
  const values = [userId]
  await pool.query(query, values)
}


export async function getTokenInfo(token) {
  const query = `
    SELECT id, user_id, token, expires_at, used, created_at
    FROM password_reset_tokens
    WHERE token = $1
  `
  const values = [token]
  const { rows } = await pool.query(query, values)
  return rows[0]
}


export async function countActiveTokens(userId) {
  const query = `
    SELECT COUNT(*) as count
    FROM password_reset_tokens
    WHERE user_id = $1 AND used = FALSE AND expires_at > NOW()
  `
  const values = [userId]
  const { rows } = await pool.query(query, values)
  return parseInt(rows[0].count, 10)
}
