// frontend/src/pages/Profile.tsx
import React, { useState, useEffect, type FormEvent } from 'react';
import Sidebar from '../components/SideBar';
import { 
  apiGetProfile, apiUpdateProfile, 
  apiGetGoal, apiUpdateGoal, 
  type UserProfile, type FinancialGoal 
} from '../services/api/ApiService';
import { getUser } from '../utils/auth';
import { User, Target, Save, AlertTriangle, CheckCircle } from 'lucide-react';
import { toast } from 'react-toastify'; // Adicionado para alertas bonitos

import '../styles/Profile.css';

export default function Profile() {
  const [loading, setLoading] = useState(true);

  const user = getUser();
  const [perfil, setPerfil] = useState<UserProfile>({ 
    nome: user?.username ?? '', 
    email: user?.email ?? '', 
    telefone: '', 
    salario: 0, custos_basicos: 0, limite_alerta: 0 
  });

  const [meta, setMeta] = useState<FinancialGoal>({ 
    titulo: '', valor_objetivo: 0, valor_atual: 0, data_limite: '' 
  });

  const [progresso, setProgresso] = useState(0);
  const [falta, setFalta] = useState(0);
  const [mensalidade, setMensalidade] = useState(0);

  useEffect(() => {
    carregarTudo();
  }, []);

  useEffect(() => {
    calcularMetricas();
  }, [meta]);

  const carregarTudo = async () => {
    try {
      const [dadosPerfil, dadosMeta] = await Promise.all([
        apiGetProfile(),
        apiGetGoal()
      ]);
      
      const currentUser = getUser();
      setPerfil({
        ...dadosPerfil,
        nome: currentUser?.username ?? dadosPerfil.nome,
        email: currentUser?.email ?? dadosPerfil.email
      });
      setMeta(dadosMeta);
    } catch (error) {
      console.error('Erro ao carregar', error);
      toast.error("Erro ao carregar dados.");
    } finally {
      setLoading(false);
    }
  };

  const calcularMetricas = () => {
    const valorFalta = Math.max(0, meta.valor_objetivo - meta.valor_atual);
    setFalta(valorFalta);

    const porc = meta.valor_objetivo > 0
      ? (meta.valor_atual / meta.valor_objetivo) * 100
      : 0;
    setProgresso(Math.min(100, porc));

    if (meta.data_limite && valorFalta > 0) {
      const hoje = new Date();
      const limite = new Date(meta.data_limite);
      
      // Diferença em meses
      const meses = (limite.getFullYear() - hoje.getFullYear()) * 12 + (limite.getMonth() - hoje.getMonth());
      
      // Evita divisão por zero ou números negativos
      setMensalidade(valorFalta / Math.max(1, meses));
    } else {
      setMensalidade(0);
    }
  };

      const handleSalvarPerfil = async (e: FormEvent) => {
    e.preventDefault();
    try {
        await apiUpdateProfile(perfil);

        localStorage.setItem("limite_alerta", perfil.limite_alerta.toString());

        toast.success('Perfil atualizado com sucesso!');
    } catch (error) {
        toast.error('Erro ao atualizar perfil.');
    }
  };

  const handleSalvarMeta = async (e: FormEvent) => {
    e.preventDefault();
    try {
        await apiUpdateGoal(meta);
        toast.success('Meta atualizada com sucesso!');
    } catch (error) {
        toast.error('Erro ao atualizar meta.');
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar />

      <main className="main-content">
        <header className="content-header">
          <div>
            <h2>Meu Perfil</h2>
            <div className="date-display">
              <User size={16} />
              <span>Configure seus dados e objetivos</span>
            </div>
          </div>
        </header>

        <div className="profile-grid">
          {/* CARD 1: DADOS PESSOAIS */}
          <div className="card">
            <div className="card-header">
              <h3>Dados Pessoais & Finanças</h3>
              <div className="icon-bg green-light">
                <User size={20} className="text-green" />
              </div>
            </div>

            <form onSubmit={handleSalvarPerfil}>
              <div className="form-group">
                <label>Nome Completo</label>
                <input
                  className="form-input"
                  type="text"
                  value={perfil.nome}
                  onChange={e => setPerfil({ ...perfil, nome: e.target.value })}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Email</label>
                  <input
                    className="form-input"
                    type="email"
                    readOnly
                    style={{backgroundColor: '#F3F4F6', cursor: 'not-allowed'}}
                    value={perfil.email}
                  />
                </div>

                <div className="form-group">
                  <label>Telefone</label>
                  <input
                    className="form-input"
                    type="text"
                    value={perfil.telefone}
                    onChange={e => setPerfil({ ...perfil, telefone: e.target.value })}
                  />
                </div>
              </div>

              <div className="divider" style={{margin: '1.5rem 0', borderBottom: '1px solid #E5E7EB'}} />

              <div className="form-row">
                <div className="form-group">
                  <label>Salário (R$)</label>
                  <input
                    className="form-input"
                    type="number"
                    value={perfil.salario}
                    onChange={e => setPerfil({ ...perfil, salario: Number(e.target.value) })}
                  />
                </div>

                <div className="form-group">
                  <label>Custos Fixos (R$)</label>
                  <input
                    className="form-input"
                    type="number"
                    value={perfil.custos_basicos}
                    onChange={e => setPerfil({ ...perfil, custos_basicos: Number(e.target.value) })}
                  />
                </div>
              </div>

              {/* --- NOVO: CAMPO DE ALERTA --- */}
              <div className="form-group">
                <label style={{display: 'flex', alignItems: 'center', gap: '8px', color: '#B45309'}}>
                  <AlertTriangle size={16} />
                  Limite de Alerta Mensal (R$)
                </label>
                <input
                  className="form-input"
                  type="number"
                  style={{borderColor: '#FCD34D', backgroundColor: '#FFFBEB'}}
                  value={perfil.limite_alerta}
                  onChange={e => setPerfil({ ...perfil, limite_alerta: Number(e.target.value) })}
                  placeholder="Ex: 2500.00"
                />
                <small style={{color: '#6B7280', fontSize: '0.8rem', marginTop: '4px'}}>
                  Você será avisado no Dashboard ao atingir 80% deste valor.
                </small>
              </div>

              <button type="submit" className="btn-save">
                <Save size={18} />
                Salvar Dados
              </button>
            </form>
          </div>

          {/* CARD 2: META FINANCEIRA (Mantido Original) */}
          <div className="card">
            <div className="card-header">
              <h3>Objetivo Financeiro</h3>
              <div className="icon-bg green-light">
                <Target size={20} className="text-green" />
              </div>
            </div>

            <div className="progress-card">
              <div className="progress-header" style={{display:'flex', justifyContent:'space-between', marginBottom:'8px'}}>
                <span style={{fontSize:'0.9rem', color:'#6B7280'}}>Progresso</span>
                <span className="progress-percent" style={{fontWeight:'bold', color: '#10B981'}}>{progresso.toFixed(1)}%</span>
              </div>

              <div className="progress-bar-bg" style={{width:'100%', height:'10px', backgroundColor:'#E5E7EB', borderRadius:'5px', overflow:'hidden', marginBottom:'1rem'}}>
                <div
                  className="progress-bar-fill"
                  style={{ width: `${progresso}%`, height:'100%', backgroundColor: '#10B981', transition: 'width 0.5s ease' }}
                />
              </div>

              <div className="progress-info" style={{display:'flex', justifyContent:'space-between', fontSize:'0.9rem', marginBottom:'2rem'}}>
                <div>
                  <span style={{display:'block', color:'#6B7280'}}>Falta Juntar</span>
                  <strong className="danger" style={{color:'#EF4444'}}>
                    R$ {falta.toFixed(2)}
                  </strong>
                </div>
                <div style={{textAlign:'right'}}>
                  <span style={{display:'block', color:'#6B7280'}}>Economia Sugerida</span>
                  <strong className="info" style={{color:'#3B82F6'}}>
                    R$ {mensalidade.toFixed(2)}/mês
                  </strong>
                </div>
              </div>
            </div>

            <form onSubmit={handleSalvarMeta}>
              <div className="form-group">
                <label>Nome do Objetivo</label>
                <input
                  className="form-input"
                  type="text"
                  value={meta.titulo}
                  onChange={e => setMeta({ ...meta, titulo: e.target.value })}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Valor Meta</label>
                  <input
                    className="form-input"
                    type="number"
                    value={meta.valor_objetivo}
                    onChange={e => setMeta({ ...meta, valor_objetivo: Number(e.target.value) })}
                  />
                </div>

                <div className="form-group">
                  <label>Já Tenho</label>
                  <input
                    className="form-input"
                    type="number"
                    value={meta.valor_atual}
                    onChange={e => setMeta({ ...meta, valor_atual: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Data Limite</label>
                <input
                  className="form-input"
                  type="date"
                  value={meta.data_limite ? meta.data_limite.split('T')[0] : ''}
                  onChange={e => setMeta({ ...meta, data_limite: e.target.value })}
                />
              </div>

              <button type="submit" className="btn-save" >
                <Target size={18} />
                Atualizar Meta
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}