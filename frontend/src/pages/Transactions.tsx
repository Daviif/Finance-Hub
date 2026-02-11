import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  TrendingUp, 
  TrendingDown,
  Pencil, 
  X 
} from 'lucide-react';
import { 
  apiGetTransactions, 
  apiCreateTransaction, 
  apiUpdateTransaction, 
  apiDeleteTransaction, 
  type Transaction 
} from '../services/api/ApiService';
import Sidebar from '../components/SideBar'; // <--- IMPORTANTE: Importando a Sidebar
import '../styles/Transactions.css';

const Transactions: React.FC = () => {
  const navigate = useNavigate();
  
  // Estados da Lista
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Estados do Modal e Formulário
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | number | null>(null);

  const [formData, setFormData] = useState({
    titulo: '',
    valor: '',
    tipo: 'despesa', 
    categoria: 'Outros',
    data: new Date().toISOString().split('T')[0],
    parcelas: 1
  });

  // Carregar transações ao abrir a tela
  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      const data = await apiGetTransactions();
      setTransactions(data);
    } catch (err) {
      console.error('Erro ao buscar transações:', err);
      setError('Erro ao carregar transações.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenNew = () => {
    setEditingId(null);
    setFormData({
      titulo: '',
      valor: '',
      tipo: 'despesa',
      categoria: 'Outros',
      data: new Date().toISOString().split('T')[0],
      parcelas: 1
    });
    setIsModalOpen(true);
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingId(transaction.id);
    setFormData({
      titulo: transaction.titulo,
      valor: transaction.valor.toString(),
      tipo: (transaction.tipo === 'gasto' ? 'despesa' : transaction.tipo) as string, 
      categoria: transaction.categoria,
      data: transaction.data.split('T')[0],
      parcelas: 1 
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const valorNumber = parseFloat(formData.valor.toString().replace(',', '.'));
      
      const payload: any = {
        titulo: formData.titulo,
        valor: valorNumber,
        tipo: formData.tipo as 'receita' | 'despesa' | 'gasto',
        categoria: formData.categoria,
        data: formData.data,
        parcelas: Number(formData.parcelas)
      };

      if (editingId) {
        await apiUpdateTransaction(editingId, payload);
        alert('Transação atualizada com sucesso!');
      } else {
        if (payload.parcelas > 1) {
             payload.valorTotal = valorNumber; 
        }
        await apiCreateTransaction(payload);
        alert('Transação criada com sucesso!');
      }

      setIsModalOpen(false);
      loadTransactions(); 
    } catch (err) {
      console.error('Erro ao salvar:', err);
      alert('Erro ao salvar transação. Verifique os dados.');
    }
  };

  const handleDelete = async (id: string | number) => {
    if (!window.confirm('Tem certeza que deseja excluir esta transação?')) return;
    try {
      await apiDeleteTransaction(id);
      setTransactions(transactions.filter(t => t.id !== id));
    } catch (err) {
      alert('Erro ao excluir transação.');
    }
  };

  return (
    <div className="dashboard-container"> {/* <--- Usando o container padrão do Dashboard */}
      
      <Sidebar /> {/* <--- A Sidebar entra aqui */}

      <main className="main-content"> {/* <--- Empurra o conteúdo para a direita */}
        <div className="transactions-content">
          
          {/* Cabeçalho */}
          <div className="transactions-header">
            {/* Botão Voltar removido ou mantido conforme preferência (geralmente não precisa com sidebar) */}
            <h2>Minhas Transações</h2>
          </div>

          {/* Barra de Ações */}
          <div className="actions-bar">
            <h3>Histórico</h3>
            <button onClick={handleOpenNew} className="btn-new">
              <Plus size={20} />
              Nova Transação
            </button>
          </div>

          {/* Mensagens */}
          {loading && <p>Carregando...</p>}
          {error && <p className="text-red">{error}</p>}

          {/* Lista */}
          <ul className="transaction-list">
            {transactions.map((t) => (
              <li key={t.id} className={`transaction-item ${t.tipo === 'receita' ? 'receita' : 'gasto'}`}>
                <div className="icon-area">
                  {t.tipo === 'receita' ? <TrendingUp size={24} /> : <TrendingDown size={24} />}
                </div>
                
                <div className="info-area">
                  <strong>{t.titulo}</strong>
                  <span>{new Date(t.data).toLocaleDateString('pt-BR')} • {t.categoria}</span>
                  {t.parcelas && t.parcelas > 1 && (
                    <div className="parcela-info" style={{marginTop: '4px', width: 'fit-content'}}>
                      Parcela {t.parcela_atual}/{t.parcelas}
                    </div>
                  )}
                </div>

                <div className="value-area">
                  <span className="value">
                    {t.tipo !== 'receita' ? '- ' : '+ '}
                    {Number(t.valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                  
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      onClick={() => handleEdit(t)} 
                      className="btn-delete" 
                      title="Editar"
                      style={{ color: '#10B981', backgroundColor: '#ECFDF5' }} 
                    >
                      <Pencil size={18} />
                    </button>

                    <button onClick={() => handleDelete(t.id)} className="btn-delete" title="Excluir">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </main>

      {/* --- MODAL --- */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingId ? 'Editar Transação' : 'Nova Transação'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="btn-close">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div className="form-group">
                <label>Descrição</label>
                <input 
                  type="text" 
                  placeholder="Ex: Salário, Mercado..." 
                  value={formData.titulo}
                  onChange={e => setFormData({...formData, titulo: e.target.value})}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Valor (R$)</label>
                  <input 
                    type="number" 
                    placeholder="0,00" 
                    step="0.01"
                    value={formData.valor}
                    onChange={e => setFormData({...formData, valor: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Tipo</label>
                  <select 
                    value={formData.tipo}
                    onChange={e => setFormData({...formData, tipo: e.target.value})}
                  >
                    <option value="despesa">Despesa</option>
                    <option value="receita">Receita</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Categoria</label>
                  <select 
                    value={formData.categoria}
                    onChange={e => setFormData({...formData, categoria: e.target.value})}
                  >
                    <option value="Outros">Outros</option>
                    <option value="Alimentação">Alimentação</option>
                    <option value="Lazer">Lazer</option>
                    <option value="Transporte">Transporte</option>
                    <option value="Saúde">Saúde</option>
                    <option value="Moradia">Moradia</option>
                    <option value="Salário">Salário</option>
                    <option value="Vendas">Vendas</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Data</label>
                  <input 
                    type="date" 
                    value={formData.data}
                    onChange={e => setFormData({...formData, data: e.target.value})}
                    required
                  />
                </div>
              </div>

              {!editingId && (
                <div className="form-group">
                  <label>Parcelas (1x = À vista)</label>
                  <input 
                    type="number" 
                    min="1" 
                    max="48"
                    value={formData.parcelas}
                    onChange={e => setFormData({...formData, parcelas: Number(e.target.value)})}
                  />
                </div>
              )}

              <button type="submit" className="btn-save">
                {editingId ? 'Salvar Alterações' : 'Adicionar'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;