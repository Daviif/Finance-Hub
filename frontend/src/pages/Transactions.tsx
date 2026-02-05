import { useState, useEffect, type FormEvent } from 'react';
import Sidebar from '../components/SideBar';
import {
  apiGetTransactions,
  apiCreateTransaction,
  apiUpdateTransaction,
  apiDeleteTransaction,
  type Transaction
} from '../services/api/ApiService';
import { MdAdd, MdDelete, MdEdit, MdAttachMoney, MdClose, MdArrowBack, MdCreditCard } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import '../styles/Transactions.css';

type FormaPagamento = 'dinheiro' | 'debito' | 'credito' | 'boleto' | 'pix';

export default function Transactions() {
  const [transacoes, setTransacoes] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | number | null>(null);

  const [titulo, setTitulo] = useState('');
  const [valor, setValor] = useState('');
  const [valorTotal, setValorTotal] = useState('');
  const [tipo, setTipo] = useState<'receita' | 'gasto' | 'despesa'>('gasto');
  const [categoria, setCategoria] = useState('');
  const [data, setData] = useState('');
  const [formaPagamento, setFormaPagamento] = useState<FormaPagamento>('dinheiro');
  const [parcelas, setParcelas] = useState(1);

  const isParcelado = !editId && tipo === 'gasto' && (formaPagamento === 'credito' || formaPagamento === 'boleto') && parcelas > 1;
  const valorParcela = isParcelado && valorTotal ? (Number(valorTotal) / parcelas).toFixed(2) : null;

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const dados = await apiGetTransactions();
      setTransacoes(dados);
    } catch (error) {
      console.error('Erro ao carregar', error);
    } finally {
      setLoading(false);
    }
  };

  const limparFormulario = () => {
    setTitulo('');
    setValor('');
    setValorTotal('');
    setTipo('gasto');
    setCategoria('');
    setData('');
    setFormaPagamento('dinheiro');
    setParcelas(1);
    setEditId(null);
  };

  const abrirModalEdicao = (t: Transaction) => {
    setEditId(t.id);
    setTitulo(t.titulo);
    setValor(t.valor.toString());
    setValorTotal(t.valor.toString());
    setTipo(t.tipo === 'despesa' ? 'gasto' : t.tipo); 
    setCategoria(t.categoria);
    setData(t.data ? t.data.split('T')[0] : '');
    setFormaPagamento((t.forma_pagamento as FormaPagamento) || 'dinheiro');
    setParcelas(1); 
    setIsModalOpen(true);
  };

  const abrirModalCriacao = () => {
    limparFormulario();
    setIsModalOpen(true);
  };

  const handleSalvar = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const dataStr = data || new Date().toISOString().split('T')[0];

      if (editId) {
        await apiUpdateTransaction(editId, {
            titulo,
            valor: Number(valor),
            tipo,
            categoria,
            data: dataStr,
            forma_pagamento: formaPagamento
        });
        toast.success('Transação atualizada!');
      } else {
        if (isParcelado) {
            await apiCreateTransaction({
            titulo,
            valorTotal: Number(valorTotal),
            tipo,
            categoria,
            data: dataStr,
            forma_pagamento: formaPagamento,
            parcelas
            });
        } else {
            await apiCreateTransaction({
            titulo,
            valor: Number(isParcelado ? valorTotal : valor),
            tipo,
            categoria,
            data: dataStr,
            forma_pagamento: formaPagamento
            });
        }
        toast.success('Transação criada!');
      }

      setIsModalOpen(false);
      limparFormulario();
      await carregarDados();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao salvar transação');
    }
  };

  const handleDelete = async (id: string | number) => {
    if (confirm('Tem certeza que deseja excluir?')) {
      try {
        await apiDeleteTransaction(id);
        toast.info('Transação excluída');
        await carregarDados();
      } catch {
        toast.error('Erro ao excluir');
      }
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar />

      <main className="main-content">
        <div className="transactions-container">
          <div className="transactions-content">
            <header className="transactions-header">
              <Link to="/dashboard" className="btn-back">
                <MdArrowBack size={24} />
              </Link>
              <h2>Transações</h2>
            </header>

            <div className="actions-bar">
              <h3>Histórico Completo</h3>
              <button className="btn-new" onClick={abrirModalCriacao}>
                <MdAdd size={20} /> Nova Transação
              </button>
            </div>

            {loading ? (
              <p>Carregando...</p>
            ) : (
              <ul className="transaction-list">
                {transacoes.map(t => (
                  <li key={t.id} className={`transaction-item ${t.tipo === 'despesa' ? 'gasto' : t.tipo}`}>
                    <div className="icon-area">
                      <MdAttachMoney />
                    </div>

                    <div className="info-area">
                      <strong>{t.titulo}</strong>
                      <span>
                        {t.categoria} •{' '}
                        {new Date(t.data).toLocaleDateString()}
                        {t.parcelas && t.parcelas > 1 && (
                          <span className="parcela-badge"> • {t.parcela_atual}/{t.parcelas}</span>
                        )}
                      </span>
                    </div>

                    <div className="value-area">
                      <span className="value">
                        {(t.tipo === 'gasto' || t.tipo === 'despesa') ? '- ' : '+ '}
                        R$ {Number(t.valor).toFixed(2)}
                      </span>
                      
                      <button 
                        className="btn-edit" 
                        onClick={() => abrirModalEdicao(t)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#3B82F6', marginRight: '8px' }}
                      >
                        <MdEdit size={20} />
                      </button>

                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(t.id)}
                      >
                        <MdDelete size={20} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {isModalOpen && (
            <div className="modal-overlay">
              <div className="modal-content">
                <div className="modal-header">
                  <h3>{editId ? 'Editar Transação' : 'Nova Transação'}</h3>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="btn-close"
                  >
                    <MdClose size={24} />
                  </button>
                </div>

                <form onSubmit={handleSalvar}>
                  <div className="form-group">
                    <label>Descrição</label>
                    <input
                      type="text"
                      value={titulo}
                      onChange={e => setTitulo(e.target.value)}
                      required
                      placeholder="Ex: Almoço, TV nova..."
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Tipo</label>
                      <select
                        value={tipo}
                        onChange={e => setTipo(e.target.value as 'receita' | 'gasto')}
                      >
                        <option value="gasto">Despesa</option>
                        <option value="receita">Receita</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Forma de pagamento</label>
                      <select
                        value={formaPagamento}
                        onChange={e => setFormaPagamento(e.target.value as FormaPagamento)}
                      >
                        <option value="dinheiro">Dinheiro</option>
                        <option value="debito">Débito</option>
                        <option value="credito">Cartão de crédito</option>
                        <option value="boleto">Boleto</option>
                        <option value="pix">PIX</option>
                      </select>
                    </div>
                  </div>

                  {!editId && (formaPagamento === 'credito' || formaPagamento === 'boleto') && tipo === 'gasto' && (
                    <div className="form-group">
                      <label>Parcelar em</label>
                      <select
                        value={parcelas}
                        onChange={e => setParcelas(Number(e.target.value))}
                      >
                        <option value={1}>À vista (1x)</option>
                        {[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(n => (
                          <option key={n} value={n}>{n}x</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {isParcelado ? (
                    <>
                      <div className="form-group">
                        <label>Valor total (R$)</label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={valorTotal}
                          onChange={e => setValorTotal(e.target.value)}
                          required
                          placeholder="Ex: 1200.00"
                        />
                      </div>
                      {valorParcela && (
                        <p className="parcela-info">
                          <MdCreditCard size={16} /> {parcelas}x de R$ {valorParcela}
                        </p>
                      )}
                    </>
                  ) : (
                    <div className="form-group">
                      <label>Valor (R$)</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={valor}
                        onChange={e => setValor(e.target.value)}
                        required
                        placeholder="0.00"
                      />
                    </div>
                  )}

                  <div className="form-group">
                    <label>Categoria</label>
                    <input
                      type="text"
                      value={categoria}
                      onChange={e => setCategoria(e.target.value)}
                      required
                      placeholder="Ex: Alimentação"
                    />
                  </div>

                  <div className="form-group">
                    <label>Data {isParcelado ? '(1ª parcela)' : ''}</label>
                    <input
                      type="date"
                      value={data}
                      onChange={e => setData(e.target.value)}
                    />
                  </div>

                  <button type="submit" className="btn-save">
                    {editId ? 'Salvar Alterações' : (isParcelado ? `Criar ${parcelas} parcelas` : 'Salvar')}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}