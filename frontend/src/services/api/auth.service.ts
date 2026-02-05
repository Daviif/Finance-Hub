import apiClient from './client'
import { setAuth } from '../../utils/auth'
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  ApiResponse,
} from '../types/api.types'

export const authService = {
  // Login
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<ApiResponse<LoginResponse>>(
      '/auth/login',
      credentials
    )
    
    const { token, user } = response.data.data
    setAuth(token, user)
    
    return response.data.data
  },

  // Registro
  async register(userData: RegisterRequest): Promise<LoginResponse> {
    const response = await apiClient.post<ApiResponse<LoginResponse>>(
      '/auth/register',
      userData
    )
    
    const { token, user } = response.data.data
    setAuth(token, user)
    
    return response.data.data
  },

  // Recuperação de senha (quando implementar)
  async forgotPassword(email: string): Promise<void> {
    await apiClient.post('/auth/forgot-password', { email })
  },

  async resetPassword(token: string, newPassword: string): Promise<void> {
    await apiClient.post('/auth/reset-password', { token, password: newPassword })
  },
}
