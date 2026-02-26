import { useState, useEffect } from 'react'
import type { FormEvent } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { apiResetPassword, apiValidateToken } from '../services/api/ApiService'
import { MdArrowBack, MdLock } from 'react-icons/md'
import '../styles/Reset.css'

export default function ResetPassword() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  
  
  const [token, setToken] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [validating, setValidating] = useState(true)
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string; token?: string }>({})
  const [success, setSuccess] = useState(false)
  const [tokenInfo, setTokenInfo] = useState<{ expiresAt?: string }>({})

 
  useEffect(() => {
    const tokenFromUrl = searchParams.get('token')
    if (!tokenFromUrl) {
      setErrors({ token: 'Token inválido ou ausente' })
      setValidating(false)
    } else {
      setToken(tokenFromUrl)
      validateTokenOnLoad(tokenFromUrl)
    }
  }, [searchParams])

 
  const validateTokenOnLoad = async (tokenValue: string) => {
    try {
      const result = await apiValidateToken(tokenValue)
      if (result.valid) {
        setTokenInfo({ expiresAt: result.expiresAt })
        setValidating(false)
      } else {
        setErrors({ token: result.message || 'Token inválido ou expirado' })
        setValidating(false)
      }
    } catch (error) {
      setErrors({ token: error instanceof Error ? error.message : 'Erro ao validar token' })
      setValidating(false)
    }
  }

  
  const validate = (): boolean => {
    const newErrors: typeof errors = {}

    if (!password) {
      newErrors.password = 'Senha é obrigatória'
    } else if (password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres'
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirmação de senha é obrigatória'
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'As senhas não correspondem'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }


  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!validate() || !token) return

    setLoading(true)
    setErrors({})

    try {
      await apiResetPassword(token, password)
      setSuccess(true)
      
      setTimeout(() => {
        navigate('/login')
      }, 2000)
    } catch (error) {
      setErrors({ 
        token: error instanceof Error ? error.message : 'Erro ao resetar senha' 
      })
    } finally {
      setLoading(false)
    }
  }

  if (validating) {
    return (
      <div className="reset-page">
        <div className="reset-container">
          <div className="loading-box">
            <span className="spinner"></span>
            <p>Validando seu link...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!token || errors.token) {
    return (
      <div className="reset-page">
        <div className="reset-container">
          <div className="error-box">
            <h2>❌ Link Inválido</h2>
            <p>{errors.token || 'O link de recuperação é inválido ou expirou.'}</p>
            <button onClick={() => navigate('/forgot-password')} className="reset-button">
              Solicitar novo link
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="reset-page">
      <div className="reset-container">
        
        <button onClick={() => navigate('/login')} className="back-button">
          <MdArrowBack size={20} />
          <span>Voltar para o login</span>
        </button>

       
        <div className="reset-logo">
          <div className="logo-circle">
            <span className="logo-icon">🔐</span>
          </div>
        </div>

       
        <h1 className="reset-title">Redefinir Senha</h1>
        <p className="reset-subtitle">Digite sua nova senha abaixo</p>

        {tokenInfo.expiresAt && (
          <div className="info-box">
            <p>⏱️ Este link expira em <strong>{new Date(tokenInfo.expiresAt).toLocaleString('pt-BR')}</strong></p>
          </div>
        )}

        {success ? (
          <div className="success-box">
            <h2>✅ Senha alterada com sucesso!</h2>
            <p>Você será redirecionado para o login em breve...</p>
          </div>
        ) : (
          
          <form onSubmit={handleSubmit} noValidate>
           
            <div className="input-group">
              <label htmlFor="password" className="input-label">Nova Senha</label>
              <div className="input-wrapper">
                <MdLock size={20} className="input-icon" />
                <input
                  id="password"
                  type="password"
                  placeholder="Digite sua nova senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`input-field ${errors.password ? 'input-error' : ''}`}
                  autoComplete="new-password"
                  required
                />
              </div>
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>

            
            <div className="input-group">
              <label htmlFor="confirmPassword" className="input-label">Confirmar Senha</label>
              <div className="input-wrapper">
                <MdLock size={20} className="input-icon" />
                <input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirme sua nova senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`input-field ${errors.confirmPassword ? 'input-error' : ''}`}
                  autoComplete="new-password"
                  required
                />
              </div>
              {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
            </div>

           
            <button
              type="submit"
              className="reset-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Atualizando...
                </>
              ) : (
                'Redefinir Senha'
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
