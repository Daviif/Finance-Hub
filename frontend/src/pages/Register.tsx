import { useState } from 'react'
import { authService } from '../services/api/auth.service'
import { getErrorMessage, getValidationErrors, logError } from '../utils/errorHandler'
import { useToast } from '../hooks/useToast'
import { Link, useNavigate } from 'react-router-dom'
import { MdEmail, MdLock, MdPerson } from 'react-icons/md'
import '../styles/Login.css'
import '../styles/Register.css'

export default function Register() {
  const navigate = useNavigate()
  const { success, error: showError } = useToast()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{
    name?: string
    email?: string
    password?: string
    confirmPassword?: string
  }>({})

  const validate = (): boolean => {
    const newErrors: {
      name?: string
      email?: string
      password?: string
      confirmPassword?: string
    } = {}

    if (!name) {
      newErrors.name = 'Nome é obrigatório'
    } else if (name.length < 3) {
      newErrors.name = 'Mínimo 3 letras'
    }

    if (!email) {
      newErrors.email = 'Email é obrigatório'
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email inválido'
    }

    if (!password) {
      newErrors.password = 'Senha é obrigatória'
    } else if (password.length < 6) {
      newErrors.password = 'Mínimo 6 caracteres'
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirme sua senha'
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    setLoading(true)
    setErrors({})

    try {
      await authService.register({ name, email, password })

      success('Conta criada com sucesso! Bem-vindo ao FinanceHub!')

      navigate('/dashboard')
    } catch (err) {
      logError(err, 'Register')
      
      const errorMessage = getErrorMessage(err)
      showError(errorMessage)
      
      const validationErrors = getValidationErrors(err)
      if (validationErrors) {
        setErrors(validationErrors as any)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page register-page">
      <div className="login-container">
          <Link to="/login" className="register-back">
            ← Voltar para o login
          </Link>

          <div className="login-logo">
            <div className="logo-circle">
              <span className="logo-icon">💰</span>
            </div>
          </div>

          <h1 className="login-title">Crie sua Conta</h1>
          <p className="login-subtitle">Preencha os dados para começar</p>

          <form onSubmit={handleSubmit} noValidate>
            <div className="input-group">
              <label htmlFor="name" className="input-label">Nome Completo</label>
              <div className={`input-wrapper ${errors.name ? 'error' : ''}`}>
                <MdPerson size={20} className="input-icon" aria-hidden />
                <input
                  id="name"
                  type="text"
                  placeholder="Seu nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`input-field ${errors.name ? 'input-error' : ''}`}
                  autoComplete="name"
                  required
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? 'name-error' : undefined}
                />
              </div>
              {errors.name && <span id="name-error" className="error-message" role="alert">{errors.name}</span>}
            </div>

            <div className="input-group">
              <label htmlFor="email" className="input-label">E-mail</label>
              <div className={`input-wrapper ${errors.email ? 'error' : ''}`}>
                <MdEmail size={20} className="input-icon" aria-hidden />
                <input
                  id="email"
                  type="email"
                  placeholder="você@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`input-field ${errors.email ? 'input-error' : ''}`}
                  autoComplete="email"
                  required
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                />
              </div>
              {errors.email && <span id="email-error" className="error-message" role="alert">{errors.email}</span>}
            </div>

            <div className="input-group">
              <label htmlFor="password" className="input-label">Senha</label>
              <div className={`input-wrapper ${errors.password ? 'error' : ''}`}>
                <MdLock size={20} className="input-icon" aria-hidden />
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`input-field ${errors.password ? 'input-error' : ''}`}
                  autoComplete="new-password"
                  required
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? 'password-error' : undefined}
                />
              </div>
              {errors.password && <span id="password-error" className="error-message" role="alert">{errors.password}</span>}
            </div>

            <div className="input-group">
              <label htmlFor="confirmPassword" className="input-label">Confirme a Senha</label>
              <div className={`input-wrapper ${errors.confirmPassword ? 'error' : ''}`}>
                <MdLock size={20} className="input-icon" aria-hidden />
                <input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`input-field ${errors.confirmPassword ? 'input-error' : ''}`}
                  autoComplete="new-password"
                  required
                  aria-invalid={!!errors.confirmPassword}
                  aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
                />
              </div>
              {errors.confirmPassword && <span id="confirmPassword-error" className="error-message" role="alert">{errors.confirmPassword}</span>}
            </div>

            <button type="submit" className="login-button" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Criando conta...
                </>
              ) : (
                'Criar Conta'
              )}
            </button>
          </form>

          <p className="login-register">
            Já tem uma conta?{' '}
            <Link to="/login" className="register-link">
              Faça login
            </Link>
          </p>
      </div>
    </div>
  )
}
