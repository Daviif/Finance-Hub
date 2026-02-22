import pool from '../database/index.js'
import { randomUUID } from 'crypto'

export async function findByUserId(userId) {
  const query = `
    SELECT id, titulo, valor, tipo, categoria, data, forma_pagamento, parcelas, parcela_atual, grupo_parcela_id, notas
    FROM transactions
    WHERE user_id = $1
    ORDER BY data DESC, created_at DESC
  `
  const { rows } = await pool.query(query, [userId])
  return rows
}

export async function create(transaction) {
  const {
    userId,
    titulo,
    valor,
    tipo,
    categoria,
    data,
    formaPagamento = 'dinheiro',
    parcelas = 1,
    parcelaAtual = 1,
    grupoParcelaId = null,
    notas = null
  } = transaction

  const query = `
    INSERT INTO transactions (user_id, titulo, valor, tipo, categoria, data, forma_pagamento, parcelas, parcela_atual, grupo_parcela_id, notas)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    RETURNING id, titulo, valor, tipo, categoria, data, forma_pagamento, parcelas, parcela_atual, grupo_parcela_id, notas
  `
  const values = [userId, titulo, valor, tipo, categoria, data, formaPagamento, parcelas, parcelaAtual, grupoParcelaId, notas]
  const { rows } = await pool.query(query, values)
  return rows[0]
}

export async function createParceladas(userId, titulo, valorTotal, categoria, dataPrimeira, parcelas, formaPagamento = 'credito') {
  const grupoId = randomUUID()
  const valorParcela = Math.round((valorTotal / parcelas) * 100) / 100
  const criadas = []

  for (let i = 0; i < parcelas; i++) {
    const dataParcela = new Date(dataPrimeira)
    dataParcela.setMonth(dataParcela.getMonth() + i)
    const dataStr = dataParcela.toISOString().split('T')[0]

    const tituloParcela = parcelas > 1 ? `${titulo} (${i + 1}/${parcelas})` : titulo

    const tx = await create({
      userId,
      titulo: tituloParcela,
      valor: valorParcela,
      tipo: 'gasto',
      categoria,
      data: dataStr,
      formaPagamento,
      parcelas,
      parcelaAtual: i + 1,
      grupoParcelaId: grupoId,
      notas: null
    })
    criadas.push(tx)
  }

  return criadas
}

export async function remove(id, userId) {
  const query = 'DELETE FROM transactions WHERE id = $1 AND user_id = $2 RETURNING id'
  const { rows } = await pool.query(query, [id, userId])
  return rows[0]
}

export async function update(id, userId, updates) {
  const allowedFields = {
    titulo: 'titulo',
    valor: 'valor',
    tipo: 'tipo',
    categoria: 'categoria',
    data: 'data',
    forma_pagamento: 'forma_pagamento',
    parcelas: 'parcelas',
    notas: 'notas'
  }

  const setClauses = []
  const values = []
  let paramIndex = 1

  for (const [field, column] of Object.entries(allowedFields)) {
    if (updates[field] !== undefined) {
      setClauses.push(`${column} = $${paramIndex}`)
      values.push(updates[field])
      paramIndex++
    }
  }

  if (setClauses.length === 0) {
    return null
  }

  values.push(id)
  values.push(userId)

  const query = `
    UPDATE transactions
    SET ${setClauses.join(', ')}
    WHERE id = $${paramIndex} AND user_id = $${paramIndex + 1}
    RETURNING id, titulo, valor, tipo, categoria, data, forma_pagamento, parcelas, parcela_atual, grupo_parcela_id, notas
  `

  const { rows } = await pool.query(query, values)
  return rows[0]
}

export async function removeByGrupo(grupoParcelaId, userId) {
  const query = 'DELETE FROM transactions WHERE grupo_parcela_id = $1 AND user_id = $2'
  await pool.query(query, [grupoParcelaId, userId])
}
