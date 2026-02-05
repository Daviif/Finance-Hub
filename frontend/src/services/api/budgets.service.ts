import apiClient from './client'
import type {
  Budget,
  CreateBudgetRequest,
  ApiResponse,
} from '../types/api.types'

export const budgetsService = {
  // Listar orçamentos
  async getAll(): Promise<Budget[]> {
    const response = await apiClient.get<ApiResponse<Budget[]>>('/budgets')
    return response.data.data
  },

  // Criar orçamento
  async create(data: CreateBudgetRequest): Promise<Budget> {
    const response = await apiClient.post<ApiResponse<Budget>>('/budgets', data)
    return response.data.data
  },

  // Atualizar orçamento
  async update(id: string, data: Partial<CreateBudgetRequest>): Promise<Budget> {
    const response = await apiClient.put<ApiResponse<Budget>>(
      `/budgets/${id}`,
      data
    )
    return response.data.data
  },

  // Deletar orçamento
  async delete(id: string): Promise<void> {
    await apiClient.delete(`/budgets/${id}`)
  },

  // Obter alertas (quando implementar)
  async getAlerts(): Promise<any> {
    const response = await apiClient.get('/budgets/alerts')
    return response.data.data
  },
}
