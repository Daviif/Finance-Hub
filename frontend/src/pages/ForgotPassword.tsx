import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { apiForgot } from '../services/api/ApiService'
import { MdArrowBack, MdEmail} from 'react-icons/md'
import '../styles/Forgot.css'

export default function ForgotPassword() {
  const navigate = useNavigate()
  
  // Estados do formulário
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  
  // errors é usado para validações locais no frontend (ex: "E-mail inválido")
  const [errors, setErrors] = useState<{ email?: string; senha?: string }>({})
  
  // serverError é usado para mostrar a caixa vermelha (ex: "E-mail não cadastrado")
  const [serverError, setServerError] = useState<string>('')
  
  const [success, setSuccess] = useState(false)

  // Validação Local (Frontend)
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

  // Submit do formulário
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    // Limpa os erros do servidor toda vez que o usuário tenta de novo
    setServerError('')

    // Se falhar na validação local, não chama a API
    if (!validate()) return

    setLoading(true)
    setErrors({})

    try {
      const response = await apiForgot(email)
      console.log('✅ Email enviado:', response)
      setSuccess(true)
      
      setTimeout(() => {
        navigate('/login') // Ajuste para a rota de login correta
      }, 3000)
    } catch (error: any) {
      // Se a API retornar erro (ex: 404 E-mail não encontrado)
      // Capturamos a mensagem que vem do ApiService
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
        {/* Botão Voltar */}
        <Link to="/login" className="back-button">
          <MdArrowBack size={20} />
          <span>Voltar para o login</span>
        </Link>
        
        {/* Logo */}
        <div className="forgot-logo">
          <div className="logo-circle">
            <span className="logo-icon">💰</span>
          </div>
        </div>

        {/* Títulos */}
        <h1 className="forgot-title">Redefina sua senha</h1>
        <p className="forgot-subtitle">Insira seu email e enviaremos um link para redefinir sua senha</p>

        {success ? (
          <div className="success-box">
            <h2>✅ Email enviado com sucesso!</h2>
            <p>Verifique sua caixa de entrada para o link de recuperação.</p>
            <p className="redirect-info">Você será redirecionado em breve...</p>
          </div>
        ) : (
          /* Formulário */
          <form onSubmit={handleSubmit} noValidate>
            
            {/* CAIXA DE ERRO DO SERVIDOR (Vermelha) */}
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

            {/* Input Email */}
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
                    setErrors({}) // Limpa erros de validação ao digitar
                    setServerError('') // Limpa erros do servidor ao digitar
                  }}
                  className={`input-field ${errors.email ? 'input-error' : ''}`}
                  autoComplete="email"
                  required
                />
              </div>
              {/* Mensagem de erro de validação (abaixo do input) */}
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>
      
            {/* Botão Submit */}
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