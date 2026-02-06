import pkg from 'pg'
const { Pool } = pkg

// Suportar DATABASE_URL ou variáveis individuais
const pool = new Pool({
  host: process.env.DB_HOST, 
  database: process.env.DB_NAME,    
  user: process.env.DB_USER, 
  port: process.env.DB_PORT, 
  password: process.env.DB_PASS || process.env.DB_PASSWORD
})

// Log de conexão
pool.on('connect', () => {
  console.log('[DB] Nova conexão com o banco')
})

pool.on('error', (err) => {
  console.error('[DB] Erro no pool:', err.message)
})

// Wrapper para logar queries
const originalQuery = pool.query.bind(pool)
pool.query = async function (text, values) {
  const start = Date.now()
  const safeParams = values ? values.map((v) => (typeof v === 'string' && v.length > 20 ? '[REDACTED]' : v)) : []
  console.log('[DB] Query:', text.trim().replace(/\s+/g, ' '), safeParams.length ? `| params: ${JSON.stringify(safeParams)}` : '')
  try {
    const result = await originalQuery(text, values)
    const ms = Date.now() - start
    const rows = result.rowCount ?? 0
    console.log(`[DB] ✓ ${rows} linha(s) em ${ms}ms`)
    return result
  } catch (err) {
    const ms = Date.now() - start
    console.error(`[DB] ✗ Erro em ${ms}ms:`, err.message)
    throw err
  }
}

export default pool
