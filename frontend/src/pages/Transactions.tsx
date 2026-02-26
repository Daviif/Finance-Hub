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
import Sidebar from '../components/SideBar';
import '../styles/Transactions.css';

const Transactions: React.FC = () => {
  const navigate = useNavigate();
  
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | number | null>(null);

  const [formData, setFormData] = useState({
    titulo: '',
    valor: '',
    tipo: 'gasto', 
    categoria: 'Outros',
    data: new Date().toISOString().split('T')[0]
  });

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000); 
  };

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
      tipo: 'gasto',
      categoria: 'Outros',
      data: new Date().toISOString().split('T')[0]
    });
    setIsModalOpen(true);
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingId(transaction.id);
    setFormData({
      titulo: transaction.titulo,
      valor: transaction.valor.toString(),
      tipo: (transaction.tipo === 'despesa' ? 'gasto' : transaction.tipo) as string, 
      categoria: transaction.categoria,
      data: transaction.data.split('T')[0]
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
        tipo: formData.tipo as 'receita' | 'gasto',
        categoria: formData.categoria,
        data: formData.data
      };

      if (editingId) {
        await apiUpdateTransaction(editingId, payload);
        showToast('Transação atualizada com sucesso!', 'success');
      } else {
        await apiCreateTransaction(payload);
        showToast('Transação criada com sucesso!', 'success');
      }

      setIsModalOpen(false);
      loadTransactions(); 
    } catch (err: any) {
      console.error('Erro ao salvar:', err);
      const errorMsg = err.message || 'Erro ao salvar transação. Verifique os dados.';
      showToast(errorMsg, 'error');
    }
  };

  const handleDelete = async (id: string | number) => {
    if (!window.confirm('Tem certeza que deseja excluir esta transação?')) return;
    try {
      await apiDeleteTransaction(id);
      setTransactions(transactions.filter(t => t.id !== id));
      showToast('Transação excluída.', 'success');
    } catch (err) {
      showToast('Erro ao excluir transação.', 'error');
    }
  };

  return (
    <div className="dashboard-container">
      
      <Sidebar />

      <main className="main-content">
        <div className="transactions-content">
          
          <div className="transactions-header">
            <h2>Minhas Transações</h2>
          </div>

          <div className="actions-bar">
            <h3>Histórico</h3>
            <button onClick={handleOpenNew} className="btn-new">
              <Plus size={20} />
              Nova Transação
            </button>
          </div>

          {loading && <p>Carregando...</p>}
          {error && <p className="text-red">{error}</p>}

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

      {toast && (
        <div className={`toast-notification ${toast.type}`}>
          {toast.message}
        </div>
      )}

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
                    <option value="gasto">Despesa</option>
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