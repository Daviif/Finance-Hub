const TOKEN_KEY = 'token'
const USER_KEY = 'user'

export const getToken = (): string | null => localStorage.getItem(TOKEN_KEY)

export const getUser = () => {
  try {
    const data = localStorage.getItem(USER_KEY)
    return data ? JSON.parse(data) : null
  } catch {
    return null
  }
}

export const isAuthenticated = (): boolean => !!getToken()

export const setAuth = (token: string, user: object) => {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export const clearAuth = () => {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}
