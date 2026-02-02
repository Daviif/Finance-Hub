import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
// Adicionei o MdPerson para o ícone do nome
import { MdArrowBack, MdEmail, MdLock, MdPerson } from 'react-icons/md'
import '../styles/Register.css'
// IMPORTANTE: Importamos a função real que conecta no Backend
import { apiRegister } from '../services/api/ApiService'

export default function Register() {
  const navigate = useNavigate()
  
  // Adicionei o estado para o Nome
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{ 
    name?: string // Erro do nome
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

    // Validação do Nome
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
    } else if (password.length < 6) { // Ajustei para 6 (regra do seu backend)
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    setLoading(true)
    setErrors({})

    try {
      // --- AQUI ESTÁ A MÁGICA: Chamada Real para o Backend ---
      // Passamos Nome, Email e Senha para o arquivo ApiService.ts
      await apiRegister(name, email, password)
      
      console.log('✅ Cadastro Real realizado com sucesso!')
      
      // Se der certo, redireciona para login
      navigate('/')
      
    } catch (error) {
      console.error("Erro no cadastro:", error);
      setErrors({ 
        // Se o erro for genérico, mostra no campo de email ou num alerta geral
        email: error instanceof Error ? error.message : 'Erro ao conectar com o servidor' 
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="register-page">
      <div className="register-container">
        {/* Botão Voltar */}
        <Link to="/" className="back-button">
          <MdArrowBack size={20} />
          <span>Voltar para o login</span>
        </Link>

        {/* Logo */}
        <div className="register-logo">
          <div className="logo-circle">
            <span className="logo-icon">💰</span>
          </div>
        </div>

        {/* Títulos */}
        <h1 className="register-title">Crie sua Conta</h1>
        <p className="register-subtitle">Preencha os dados para começar</p>

        {/* Formulário */}
        <form onSubmit={handleSubmit} noValidate>
          
          {/* NOVO: Input Nome */}
          <div className="input-group">
            <label htmlFor="name" className="input-label">Nome Completo</label>
            <div className={`input-wrapper ${errors.name ? 'error' : ''}`}>
              <MdPerson size={20} className="input-icon" />
              <input
                id="name"
                type="text"
                placeholder="Seu nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field"
                autoComplete="name"
                required
              />
            </div>
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          {/* Input Email */}
          <div className="input-group">
            <label htmlFor="email" className="input-label">E-mail</label>
            <div className={`input-wrapper ${errors.email ? 'error' : ''}`}>
              <MdEmail size={20} className="input-icon" />
              <input
                id="email"
                type="email"
                placeholder="você@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                autoComplete="email"
                required
              />
            </div>
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          {/* Input Senha */}
          <div className="input-group">
            <label htmlFor="password" className="input-label">Senha</label>
            <div className={`input-wrapper ${errors.password ? 'error' : ''}`}>
              <MdLock size={20} className="input-icon" />
              <input
                id="password"
                type="password"
                placeholder="Mín. 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                autoComplete="new-password"
                required
              />
            </div>
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          {/* Input Confirmar Senha */}
          <div className="input-group">
            <label htmlFor="confirmPassword" className="input-label">Confirme a Senha</label>
            <div className={`input-wrapper ${errors.confirmPassword ? 'error' : ''}`}>
              <MdLock size={20} className="input-icon" />
              <input
                id="confirmPassword"
                type="password"
                placeholder="Reescreva a senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input-field"
                autoComplete="new-password"
                required
              />
            </div>
            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
          </div>

          {/* Botão Submit */}
          <button
            type="submit"
            className="register-button"
            disabled={loading}
          >
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

        {/* Link para Login */}
        <p className="register-login">
          Já tem uma conta?{' '}
          <Link to="/" className="login-link">
            Faça login
          </Link>
        </p>
      </div>
    </div>
  )
}