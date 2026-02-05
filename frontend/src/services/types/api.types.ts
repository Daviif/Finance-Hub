// Tipos de resposta da API
export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface ApiError {
  message: string
  statusCode: number
  errors?: Record<string, string[]>
}

// Entidades
export interface User {
  id: string
  email: string
  name: string
  createdAt: string
}

export interface Transaction {
  id: string
  userId: string
  type: 'receita' | 'despesa'
  amount: number
  category: string
  description: string
  date: string
  createdAt: string
  updatedAt: string
}

export interface Budget {
  id: string
  userId: string
  category: string
  limitAmount: number
  month: number
  year: number
}

// DTOs (Data Transfer Objects)
export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  user: User
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
}

export interface CreateTransactionRequest {
  type: 'receita' | 'despesa'
  amount: number
  category: string
  description: string
  date: string
}

export interface UpdateTransactionRequest extends Partial<CreateTransactionRequest> {}

export interface CreateBudgetRequest {
  category: string
  limitAmount: number
  month: number
  year: number
}
