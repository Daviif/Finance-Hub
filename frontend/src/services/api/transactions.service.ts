import apiClient from './client'
import type {
  Transaction,
  CreateTransactionRequest,
  UpdateTransactionRequest,
  ApiResponse,
} from '../types/api.types'

export const transactionsService = {
  // Listar todas as transações
  async getAll(): Promise<Transaction[]> {
    const response = await apiClient.get<ApiResponse<Transaction[]>>('/transactions')
    return response.data.data
  },

  // Filtrar por período
  async getByPeriod(month: number, year: number): Promise<Transaction[]> {
    const response = await apiClient.get<ApiResponse<Transaction[]>>(
      `/transactions?month=${month}&year=${year}`
    )
    return response.data.data
  },

  // Criar nova transação
  async create(data: CreateTransactionRequest): Promise<Transaction> {
    const response = await apiClient.post<ApiResponse<Transaction>>(
      '/transactions',
      data
    )
    return response.data.data
  },

  // Atualizar transação (quando implementar)
  async update(id: string, data: UpdateTransactionRequest): Promise<Transaction> {
    const response = await apiClient.put<ApiResponse<Transaction>>(
      `/transactions/${id}`,
      data
    )
    return response.data.data
  },

  // Deletar transação
  async delete(id: string): Promise<void> {
    await apiClient.delete(`/transactions/${id}`)
  },

  // Exportar CSV
  async exportCSV(): Promise<Blob> {
    const response = await apiClient.get('/transactions/export', {
      responseType: 'blob',
    })
    return response.data
  },
}
