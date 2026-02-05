import axios from 'axios'
import type { AxiosInstance, AxiosError } from 'axios'
import { getToken, clearAuth } from '../../utils/auth'

// Configuração base
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

// Criar instância do axios
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor para adicionar token em todas as requisições
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor para tratar erros globalmente
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Token expirado ou inválido
    if (error.response?.status === 401) {
      clearAuth()
      window.location.href = '/login'
    }

    // Erro de servidor
    if (error.response?.status === 500) {
      console.error('Erro interno do servidor:', error)
    }

    return Promise.reject(error)
  }
)

export default apiClient
