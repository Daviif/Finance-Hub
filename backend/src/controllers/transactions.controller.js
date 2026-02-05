import * as transactionsRepo from '../repositories/transactions.repository.js'

export async function list(req, res) {
  try {
    const rows = await transactionsRepo.findByUserId(req.userId)
    const formatado = rows.map(r => ({
      id: r.id,
      titulo: r.titulo,
      valor: Number(r.valor),
      tipo: r.tipo,
      categoria: r.categoria,
      data: r.data,
      forma_pagamento: r.forma_pagamento,
      parcelas: r.parcelas,
      parcela_atual: r.parcela_atual,
      grupo_parcela_id: r.grupo_parcela_id,
      notas: r.notas
    }))
    return res.json(formatado)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Erro ao listar transações' })
  }
}

export async function create(req, res) {
  try {
    const { titulo, valor, valorTotal, tipo, categoria, data, forma_pagamento, parcelas } = req.body

    if (!titulo || !categoria || !data) {
      return res.status(400).json({ message: 'Título, categoria e data são obrigatórios' })
    }

    if (tipo !== 'receita' && tipo !== 'gasto') {
      return res.status(400).json({ message: 'Tipo deve ser receita ou gasto' })
    }

    const numParcelas = Math.max(1, parseInt(parcelas, 10) || 1)
    const isParcelado = numParcelas > 1 && tipo === 'gasto'
    const total = isParcelado ? Number(valorTotal) : Number(valor)

    if (isNaN(total) || total <= 0) {
      return res.status(400).json({ message: 'Valor inválido' })
    }

    if (isParcelado) {
      const criadas = await transactionsRepo.createParceladas(
        req.userId,
        titulo,
        total,
        categoria,
        data,
        numParcelas,
        forma_pagamento || 'credito'
      )
      return res.status(201).json({ message: `${numParcelas} parcelas criadas`, transactions: criadas })
    }

    const tx = await transactionsRepo.create({
      userId: req.userId,
      titulo,
      valor: total,
      tipo,
      categoria,
      data,
      formaPagamento: forma_pagamento || 'dinheiro',
      parcelas: 1,
      parcelaAtual: 1
    })

    return res.status(201).json(tx)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Erro ao criar transação' })
  }
}

export async function remove(req, res) {
  try {
    const { id } = req.params
    const removido = await transactionsRepo.remove(id, req.userId)
    if (!removido) {
      return res.status(404).json({ message: 'Transação não encontrada' })
    }
    return res.status(204).send()
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Erro ao excluir transação' })
  }
}
