import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ArrowRightLeft, 
  User, 
  LogOut, 
  Wallet, 
  TrendingUp, 
  TrendingDown,
  MessageCircle
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import '../styles/Dashboard.css';

// Importando serviços
import { apiGetTransactions, apiGetProfile, type Transaction } from '../services/api/ApiService';

interface ChartData {
  name: string;
  receitas: number;
  despesas: number;
  originalDate: Date;
}

interface CategoryData {
  name: string;
  value: number;
}

const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

const Dashboard: React.FC = () => {
  const [userName, setUserName] = useState('Usuário');
  const [dataChart, setDataChart] = useState<ChartData[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [resumo, setResumo] = useState({
    saldo: 0,
    receitas: 0,
    despesas: 0,
    countReceitas: 0,
    countDespesas: 0
  });

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const [listaTransacoes, perfil] = await Promise.all([
        apiGetTransactions(),
        apiGetProfile()
      ]);

      if (perfil.nome) setUserName(perfil.nome);
      calcularResumo(listaTransacoes);
      processarDadosGrafico(listaTransacoes);
      processarDadosCategorias(listaTransacoes);
      
    } catch (error) {
      console.error("Erro ao carregar dashboard", error);
    }
  };

  const calcularResumo = (lista: Transaction[]) => {
    let rec = 0;
    let desp = 0;
    let cRec = 0;
    let cDesp = 0;

    lista.forEach(t => {
      const valor = Number(t.valor);
      if (t.tipo === 'receita') {
        rec += valor;
        cRec++;
      } else {
        desp += valor;
        cDesp++;
      }
    });

    setResumo({
      saldo: rec - desp,
      receitas: rec,
      despesas: desp,
      countReceitas: cRec,
      countDespesas: cDesp
    });
  };

  const processarDadosGrafico = (lista: Transaction[]) => {
    const hoje = new Date();
    const ultimosMeses: ChartData[] = [];

    for (let i = 5; i >= 0; i--) {
      const d = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
      const nomeMes = d.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '');
      
      ultimosMeses.push({
        name: nomeMes,
        receitas: 0,
        despesas: 0,
        originalDate: d
      });
    }

    lista.forEach(t => {
      const dataTransacao = new Date(t.data);
      const mesCorrespondente = ultimosMeses.find(m => 
        m.originalDate.getMonth() === dataTransacao.getMonth() &&
        m.originalDate.getFullYear() === dataTransacao.getFullYear()
      );

      if (mesCorrespondente) {
        if (t.tipo === 'receita') {
          mesCorrespondente.receitas += Number(t.valor);
        } else {
          mesCorrespondente.despesas += Number(t.valor);
        }
      }
    });

    setDataChart(ultimosMeses);
  };

  const processarDadosCategorias = (lista: Transaction[]) => {
    const gastos = lista.filter(t => t.tipo === 'gasto');
    
    const agrupado = gastos.reduce((acc: Record<string, number>, curr) => {
      const cat = curr.categoria || 'Outros';
      acc[cat] = (acc[cat] || 0) + Number(curr.valor);
      return acc;
    }, {});

    const formatado = Object.keys(agrupado).map(key => ({
      name: key,
      value: agrupado[key]
    })).sort((a, b) => b.value - a.value);

    setCategoryData(formatado);
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-icon">B</div>
          <div>
            <h1 className="logo-text">FinanceHub</h1>
            <span className="logo-subtext">Controle Inteligente</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section">
            <p className="nav-title">MENU PRINCIPAL</p>
            <ul>
              <Link to="/dashboard" className="nav-link">
                <li className="active">
                  <LayoutDashboard size={20} />
                  <span>Dashboard</span>
                </li>
              </Link>
              <Link to="/transactions" className="nav-link">
                <li>
                  <ArrowRightLeft size={20} />
                  <span>Transações</span>
                </li>
              </Link>
              <Link to="/profile" className="nav-link">
                <li>
                  <User size={20} />
                  <span>Perfil</span>
                </li>
              </Link>
            </ul>
          </div>
          <div className="nav-section">
            <p className="nav-title">WHATSAPP</p>
            <button className="whatsapp-btn">
              <MessageCircle size={20} />
              Conectar WhatsApp
            </button>
          </div>
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="avatar">{userName.charAt(0).toUpperCase()}</div>
            <div className="user-info">
              <p className="user-name">{userName}</p>
              <p className="user-email">Ver perfil completo</p>
            </div>
          </div>
          <button className="logout-btn">
            <LogOut size={18} />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="content-header">
          <h2>Dashboard Financeiro</h2>
          <div className="date-display">
            📅 {new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
          </div>
        </header>

        <div className="cards-grid">
          <div className="card">
            <div className="card-header">
              <span>Saldo Atual</span>
              <div className="icon-bg green-light">
                <Wallet size={20} className="text-green" />
              </div>
            </div>
            <div className="card-value">
              R$ {resumo.saldo.toFixed(2)}
            </div>
            <div className="card-footer text-gray">
              Atualizado agora
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <span>Receitas Totais</span>
              <div className="icon-bg green-light">
                <TrendingUp size={20} className="text-green" />
              </div>
            </div>
            <div className="card-value text-green">
              R$ {resumo.receitas.toFixed(2)}
            </div>
            <div className="card-footer text-green">
              ↗ {resumo.countReceitas} transações
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <span>Despesas Totais</span>
              <div className="icon-bg red-light">
                <TrendingDown size={20} className="text-red" />
              </div>
            </div>
            <div className="card-value text-red">
              R$ {resumo.despesas.toFixed(2)}
            </div>
            <div className="card-footer text-red">
              ↘ {resumo.countDespesas} transações
            </div>
          </div>
        </div>

        <div className="charts-grid">
          <div className="chart-card">
            <h3>Fluxo de Caixa (Últimos 6 meses)</h3>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={dataChart} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorReceitas" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorDespesas" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280'}} />
                  
                  <Tooltip 
                    formatter={(value: any) => [`R$ ${Number(value || 0).toFixed(2)}`, '']}
                  />
                  
                  <Area 
                    type="monotone" 
                    dataKey="receitas" 
                    name="Receitas"
                    stroke="#10B981" 
                    fillOpacity={1} 
                    fill="url(#colorReceitas)" 
                    strokeWidth={2}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="despesas" 
                    name="Despesas"
                    stroke="#EF4444" 
                    fillOpacity={1} 
                    fill="url(#colorDespesas)" 
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
              <div className="chart-legend">
                <span className="legend-item"><span className="dot green"></span> Receitas</span>
                <span className="legend-item"><span className="dot red"></span> Despesas</span>
              </div>
            </div>
          </div>

          <div className="chart-card">
            <h3>Gastos por Categoria</h3>
            <div className="chart-wrapper">
              {categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {categoryData.map((_entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: any) => `R$ ${Number(value || 0).toFixed(2)}`}
                    />
                    <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="empty-state">Sem dados de gastos</div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;