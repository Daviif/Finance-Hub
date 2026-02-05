// Chaves do localStorage
const TOKEN_KEY = 'token'
const USER_KEY = 'user'

// Tipos
export interface User {
  id: string
  email: string
  name: string
  createdAt?: string
}

// ===== FUNÇÕES DE TOKEN =====

export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY)
}

export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token)
}

export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY)
}

// ===== FUNÇÕES DE USUÁRIO =====

export const getUser = (): User | null => {
  try {
    const data = localStorage.getItem(USER_KEY)
    if (!data) return null
    return JSON.parse(data) as User
  } catch (error) {
    console.error('Erro ao recuperar dados do usuário:', error)
    // Se houver erro ao parsear, limpa o localStorage
    removeUser()
    return null
  }
}

export const setUser = (user: User): void => {
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export const removeUser = (): void => {
  localStorage.removeItem(USER_KEY)
}

// ===== FUNÇÕES COMPOSTAS =====

export const isAuthenticated = (): boolean => {
  const token = getToken()
  const user = getUser()
  return !!token && !!user
}

export const setAuth = (token: string, user: User): void => {
  setToken(token)
  setUser(user)
}

export const clearAuth = (): void => {
  removeToken()
  removeUser()
}

// ===== FUNÇÕES AUXILIARES =====

// Verifica se o token está expirado (se você usar JWT)
export const isTokenExpired = (): boolean => {
  const token = getToken()
  if (!token) return true

  try {
    // Decodifica o JWT (apenas o payload, sem validar assinatura)
    const payload = JSON.parse(atob(token.split('.')[1]))
    const expirationTime = payload.exp * 1000 // converter para ms
    return Date.now() >= expirationTime
  } catch (error) {
    console.error('Erro ao verificar expiração do token:', error)
    return true
  }
}

// Obtém informações do usuário logado de forma segura
export const getCurrentUser = (): User | null => {
  if (!isAuthenticated()) {
    return null
  }
  return getUser()
}

// Verifica se o usuário tem uma role específica (para futuro)
//export const hasRole = (role: string): boolean => {
//  const user = getUser()
  // Quando adicionar roles no backend, descomentar:
  // return user?.roles?.includes(role) ?? false
//  return false
//}
