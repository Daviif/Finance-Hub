// frontend/src/pages/Dashboard.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiGetSummary, type SummaryResponse } from '../services/api/ApiService';
import { MdTrendingUp, MdTrendingDown, MdAccountBalanceWallet } from 'react-icons/md';
import '../styles/Dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const [resumo, setResumo] = useState<SummaryResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarResumo();
  }, []);

  const carregarResumo = async () => {
    try {
      const dados = await apiGetSummary();
      setResumo(dados);
    } catch (error) {
      console.error("Erro ao carregar resumo", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h2>💰 FinanceHub</h2>
        <button onClick={handleLogout} className="btn-logout">Sair</button>
      </header>

      <main className="dashboard-content">
        <h1 className="welcome-text">Visão Geral</h1>
        
        {loading ? <p>Carregando...</p> : (
          <div className="summary-cards">
            <div className="card card-balance">
              <div className="card-header">
                <span>Saldo Total</span>
                <MdAccountBalanceWallet size={24} />
              </div>
              <strong className="card-value">R$ {resumo?.saldo_total.toFixed(2)}</strong>
            </div>

            <div className="card card-income">
              <div className="card-header">
                <span>Entradas</span>
                <MdTrendingUp size={24} />
              </div>
              <strong className="card-value">R$ {resumo?.total_receitas.toFixed(2)}</strong>
            </div>

            <div className="card card-expense">
              <div className="card-header">
                <span>Saídas</span>
                <MdTrendingDown size={24} />
              </div>
              <strong className="card-value">R$ {resumo?.total_gastos.toFixed(2)}</strong>
            </div>
          </div>
        )}

        <div className="navigation-area">
            <button className="btn-go-transactions" onClick={() => navigate('/transactions')}>
                Ver e Criar Transações
            </button>
        </div>
      </main>
    </div>
  );
}