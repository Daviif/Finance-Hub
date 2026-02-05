import { useState, useEffect } from 'react'
import { budgetsService } from '../services/api/budgets.service'
import { getErrorMessage, logError } from '../utils/errorHandler'
import { useToast } from '../hooks/useToast'
import type { Budget } from '../services/types/api.types'
import '../styles/Budget.css'

export default function Budgets() {
  const { success, error: showError } = useToast()
  
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    category: '',
    limitAmount: '',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  })

  useEffect(() => {
    loadBudgets()
  }, [])

  const loadBudgets = async () => {
    try {
      setLoading(true)
      const data = await budgetsService.getAll()
      setBudgets(data)
    } catch (err) {
      logError(err, 'LoadBudgets')
      showError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.category || !formData.limitAmount) {
      showError('Preencha todos os campos')
      return
    }

    try {
      await budgetsService.create({
        category: formData.category,
        limitAmount: parseFloat(formData.limitAmount),
        month: formData.month,
        year: formData.year,
      })
      
      success('Orçamento criado com sucesso!')
      
      setFormData({
        category: '',
        limitAmount: '',
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
      })
      
      loadBudgets()
    } catch (err) {
      logError(err, 'CreateBudget')
      showError(getErrorMessage(err))
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este orçamento?')) {
      return
    }

    try {
      await budgetsService.delete(id)
      success('Orçamento excluído com sucesso!')
      loadBudgets()
    } catch (err) {
      logError(err, 'DeleteBudget')
      showError(getErrorMessage(err))
    }
  }

  return (
    <div className="budgets-page">
      <h1>Orçamentos</h1>

      <form onSubmit={handleSubmit} className="budget-form">
        <div className="form-row">
          <div className="form-group">
            <label>Categoria *</label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder="Ex: Alimentação"
              required
            />
          </div>

          <div className="form-group">
            <label>Limite (R$) *</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.limitAmount}
              onChange={(e) => setFormData({ ...formData, limitAmount: e.target.value })}
              placeholder="0.00"
              required
            />
          </div>

          <div className="form-group">
            <label>Mês</label>
            <select
              value={formData.month}
              onChange={(e) => setFormData({ ...formData, month: parseInt(e.target.value) })}
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Ano</label>
            <input
              type="number"
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
              min="2000"
              max="2100"
            />
          </div>
        </div>

        <button type="submit" className="btn-submit">
          Adicionar Orçamento
        </button>
      </form>

      {/* Lista de orçamentos */}
      <div className="budgets-list">
        {loading && <p>Carregando...</p>}
        
        {!loading && budgets.length === 0 && (
          <p className="empty-state">Nenhum orçamento cadastrado.</p>
        )}
        
        {!loading && budgets.length > 0 && (
          <table className="budgets-table">
            <thead>
              <tr>
                <th>Categoria</th>
                <th>Limite</th>
                <th>Período</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {budgets.map((budget) => (
                <tr key={budget.id}>
                  <td>{budget.category}</td>
                  <td>R$ {budget.limitAmount.toFixed(2)}</td>
                  <td>{budget.month}/{budget.year}</td>
                  <td>
                    <button
                      onClick={() => handleDelete(budget.id)}
                      className="btn-delete"
                      title="Excluir"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
