import { AxiosError } from 'axios'

export interface ApiErrorResponse {
  status: string
  message: string
  errors?: Record<string, string>
}

export class AppError extends Error {
  statusCode: number
  errors?: Record<string, string>

  constructor(message: string, statusCode: number = 500, errors?: Record<string, string>) {
    super(message)
    this.statusCode = statusCode
    this.errors = errors
    this.name = 'AppError'
  }
}

/**
 * Extrai mensagem de erro amigável de qualquer tipo de erro
 */
export const getErrorMessage = (error: unknown): string => {
  // Erro customizado da aplicação
  if (error instanceof AppError) {
    return error.message
  }

  // Erro do Axios (API)
  if (error instanceof AxiosError) {
    const apiError = error.response?.data as ApiErrorResponse
    
    // Mensagem específica do backend
    if (apiError?.message) {
      return apiError.message
    }

    // Erros HTTP comuns
    switch (error.response?.status) {
      case 400:
        return 'Dados inválidos. Verifique os campos e tente novamente.'
      case 401:
        return 'Sessão expirada. Faça login novamente.'
      case 403:
        return 'Você não tem permissão para realizar esta ação.'
      case 404:
        return 'Recurso não encontrado.'
      case 409:
        return 'Este registro já existe.'
      case 422:
        return 'Dados inválidos.'
      case 429:
        return 'Muitas requisições. Aguarde um momento.'
      case 500:
        return 'Erro interno do servidor. Tente novamente mais tarde.'
      case 503:
        return 'Serviço temporariamente indisponível.'
      default:
        return 'Erro ao comunicar com o servidor.'
    }
  }

  // Erro de rede
  if (error instanceof Error) {
    if (error.message === 'Network Error') {
      return 'Sem conexão com a internet. Verifique sua rede.'
    }
    return error.message
  }

  // Fallback genérico
  return 'Ocorreu um erro inesperado. Tente novamente.'
}

/**
 * Extrai erros de validação (campos específicos)
 */
export const getValidationErrors = (error: unknown): Record<string, string> | null => {
  if (error instanceof AxiosError) {
    const apiError = error.response?.data as ApiErrorResponse
    return apiError?.errors || null
  }
  
  if (error instanceof AppError) {
    return error.errors || null
  }

  return null
}

/**
 * Verifica se é erro de autenticação
 */
export const isAuthError = (error: unknown): boolean => {
  if (error instanceof AxiosError) {
    return error.response?.status === 401
  }
  return false
}

/**
 * Loga erro no console (desenvolvimento) ou serviço de monitoramento (produção)
 */
export const logError = (error: unknown, context?: string): void => {
  if (process.env.NODE_ENV === 'development') {
    console.error(`[${context || 'Error'}]:`, error)
  } else {
    // Em produção, enviar para Sentry, LogRocket, etc.
    // Sentry.captureException(error)
  }
}
