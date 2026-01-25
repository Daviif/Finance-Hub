// frontend/src/pages/Dashboard.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiGetSummary, apiGetProfile, type SummaryResponse, type UserProfile } from '../services/api/ApiService';
import { MdTrendingUp, MdTrendingDown, MdAccountBalanceWallet, MdPerson, MdWarning } from 'react-icons/md';
import '../styles/Dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const [resumo, setResumo] = useState<SummaryResponse | null>(null);
  const [perfil, setPerfil] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      // Carrega Resumo e Perfil juntos
      const [dadosResumo, dadosPerfil] = await Promise.all([
        apiGetSummary(),
        apiGetProfile()
      ]);
      setResumo(dadosResumo);
      setPerfil(dadosPerfil);
    } catch (error) {
      console.error("Erro ao carregar", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Verifica se estourou o limite (apenas se o limite for maior que 0)
  const estourouLimite = resumo && perfil && perfil.limite_alerta > 0 && resumo.total_gastos > perfil.limite_alerta;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h2>💰 FinanceHub</h2>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button onClick={() => navigate('/profile')} className="btn-logout" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <MdPerson size={20}/> Perfil
            </button>
            <button onClick={handleLogout} className="btn-logout">Sair</button>
        </div>
      </header>

      <main className="dashboard-content">
        <h1 className="welcome-text">Visão Geral</h1>
        
        {/* --- ALERTA DE GASTOS --- */}
        {estourouLimite && (
            <div className="alert-banner">
                <MdWarning size={24} />
                <div>
                    <strong>Cuidado! Você excedeu seu limite de alerta.</strong>
                    <p>Seu teto é R$ {perfil?.limite_alerta.toFixed(2)}, mas você já gastou R$ {resumo?.total_gastos.toFixed(2)}.</p>
                </div>
            </div>
        )}

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

            {/* Se estourou, o card de gastos fica vermelho para chamar atenção */}
            <div className={`card card-expense ${estourouLimite ? 'danger-border' : ''}`}>
              <div className="card-header">
                <span>Saídas</span>
                <MdTrendingDown size={24} />
              </div>
              <strong className="card-value">R$ {resumo?.total_gastos.toFixed(2)}</strong>
              {perfil?.limite_alerta && perfil.limite_alerta > 0 ? (
                  <small style={{display:'block', marginTop:'5px', color:'#888'}}>Meta: R$ {perfil.limite_alerta}</small>
              ) : null}
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