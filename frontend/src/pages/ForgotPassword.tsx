import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { apiForgot } from '../services/api/ApiService'
import { MdArrowBack, MdEmail} from 'react-icons/md'
import '../styles/Forgot.css'

export default function ForgotPassword() {
  const navigate = useNavigate()
  
  
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  
  
  const [errors, setErrors] = useState<{ email?: string; senha?: string }>({})
  

  const [serverError, setServerError] = useState<string>('')
  
  const [success, setSuccess] = useState(false)

  
  const validate = (): boolean => {
    const newErrors: { email?:string} = {}

    if (!email) {
      newErrors.email = 'Email é obrigatório'
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email inválido'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    
    setServerError('')

  
    if (!validate()) return

    setLoading(true)
    setErrors({})

    try {
      const response = await apiForgot(email)
      console.log('✅ Email enviado:', response)
      setSuccess(true)
      
      setTimeout(() => {
        navigate('/login') 
      }, 3000)
    } catch (error: any) {
      
      setServerError(
        error instanceof Error ? error.message : 'Ocorreu um erro ao tentar recuperar a senha.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="forgot-page">
      <div className="forgot-container">
        
        <Link to="/login" className="back-button">
          <MdArrowBack size={20} />
          <span>Voltar para o login</span>
        </Link>
        
        
        <div className="forgot-logo">
          <div className="logo-circle">
            <span className="logo-icon">💰</span>
          </div>
        </div>

        
        <h1 className="forgot-title">Redefina sua senha</h1>
        <p className="forgot-subtitle">Insira seu email e enviaremos um link para redefinir sua senha</p>

        {success ? (
          <div className="success-box">
            <h2>✅ Email enviado com sucesso!</h2>
            <p>Verifique sua caixa de entrada para o link de recuperação.</p>
            <p className="redirect-info">Você será redirecionado em breve...</p>
          </div>
        ) : (
          
          <form onSubmit={handleSubmit} noValidate>
            
            
            {serverError && (
              <div 
                className="error-banner" 
                style={{ 
                  marginBottom: '1.5rem', 
                  padding: '1rem', 
                  backgroundColor: 'var(--danger-bg)', 
                  border: '1px solid var(--danger)', 
                  borderRadius: 'var(--radius-md)', 
                  color: 'var(--danger)',
                  textAlign: 'left'
                }}
              >
                <strong>Ops! </strong> {serverError}
              </div>
            )}

          
            <div className="input-group">
              <label htmlFor="email" className="input-label">E-mail</label>
              
              <div className={`input-wrapper ${errors.email || serverError ? 'error' : ''}`}>
                <MdEmail size={20} className="input-icon" />
                <input
                  id="email"
                  type="email"
                  placeholder="você@exemplo.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setErrors({}) 
                    setServerError('') 
                  }}
                  className={`input-field ${errors.email ? 'input-error' : ''}`}
                  autoComplete="email"
                  required
                />
              </div>
             
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>
      
            
            <button
              type="submit"
              className="forgot-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Enviando...
                </>
              ) : (
                'Enviar link de redefinição'
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}