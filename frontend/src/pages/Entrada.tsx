import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Wallet, TrendingUp, BarChart3, Shield } from 'lucide-react'
import { isAuthenticated } from '../utils/auth'
import '../styles/Entrada.css'

export default function Entrada() {
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated()) navigate('/dashboard', { replace: true })
  }, [navigate])
  return (
    <div className="entrada-page">
      <div className="entrada-hero">
        <div className="entrada-logo">
          <div className="entrada-logo-icon">💰</div>
          <span className="entrada-logo-text">FinanceHub</span>
        </div>
        <h1 className="entrada-title">
          Controle suas finanças com inteligência
        </h1>
        <p className="entrada-subtitle">
          Organize receitas, acompanhe gastos e alcance seus objetivos financeiros em um só lugar.
        </p>
      </div>

      <div className="entrada-features">
        <div className="feature-item">
          <div className="feature-icon">
            <Wallet size={24} />
          </div>
          <span>Controle de transações</span>
        </div>
        <div className="feature-item">
          <div className="feature-icon">
            <TrendingUp size={24} />
          </div>
          <span>Relatórios visuais</span>
        </div>
        <div className="feature-item">
          <div className="feature-icon">
            <BarChart3 size={24} />
          </div>
          <span>Metas financeiras</span>
        </div>
        <div className="feature-item">
          <div className="feature-icon">
            <Shield size={24} />
          </div>
          <span>Seus dados seguros</span>
        </div>
      </div>

      <div className="entrada-actions">
        <Link to="/login" className="entrada-btn entrada-btn-primary">
          Entrar
        </Link>
        <Link to="/register" className="entrada-btn entrada-btn-secondary">
          Criar conta
        </Link>
      </div>

      <p className="entrada-footer">
        Já tem conta? <Link to="/login">Faça login</Link>
      </p>
    </div>
  )
}
