// frontend/src/services/api/ApiService.ts

// --- 1. Definições de Tipos (Interfaces) ---

export interface LoginResponse {
  token: string;
  user: { id: number; nome: string; email: string; }
}

export interface RegisterResponse {
  id: number; nome: string; email: string;
}

export interface ForgotResponse {
  email: string; message: string;
}

export interface Transaction {
  id: number;
  titulo: string;
  valor: number;
  tipo: 'receita' | 'gasto';
  categoria: string;
  data: string;
}

export interface SummaryResponse {
  saldo_total: number;
  total_receitas: number;
  total_gastos: number;
}

// --- 2. Dados Falsos e Simuladores ---

const delay = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));
const generateToken = (email: string) => `fake-jwt-${btoa(email)}-${Date.now()}`;

// Banco de dados em memória (reseta ao atualizar a página)
const mockTransactions: Transaction[] = [
  { id: 1, titulo: 'Salário', valor: 5000, tipo: 'receita', categoria: 'Trabalho', data: new Date().toISOString() },
  { id: 2, titulo: 'Almoço', valor: 25.50, tipo: 'gasto', categoria: 'Alimentação', data: new Date().toISOString() },
];

// --- 3. Funções Exportadas ---

export const apiLogin = async (email: string, senha: string): Promise<LoginResponse> => {
  await delay(800);
  if (email === 'dev@email.com' && senha === '123456') {
    return { token: generateToken(email), user: { id: 1, nome: 'Dev', email } };
  }
  throw new Error('Login inválido');
};

export const apiRegister = async (nome: string, email: string, senha: string): Promise<RegisterResponse> => {
  await delay(1000);
  return { id: Math.random(), nome, email };
};

export const apiForgot = async (email: string): Promise<ForgotResponse> => {
  await delay(800);
  return { email, message: 'Email enviado' };
};

export const apiGetTransactions = async (): Promise<Transaction[]> => {
  await delay(500);
  return [...mockTransactions];
};

export const apiCreateTransaction = async (nova: Omit<Transaction, 'id'>): Promise<Transaction> => {
  await delay(500);
  const item = { id: Date.now(), ...nova };
  mockTransactions.push(item);
  return item;
};

export const apiDeleteTransaction = async (id: number): Promise<void> => {
  await delay(500);
  const index = mockTransactions.findIndex(t => t.id === id);
  if (index !== -1) mockTransactions.splice(index, 1);
};

export const apiGetSummary = async (): Promise<SummaryResponse> => {
  await delay(500);
  const receitas = mockTransactions.filter(t => t.tipo === 'receita').reduce((acc, t) => acc + Number(t.valor), 0);
  const gastos = mockTransactions.filter(t => t.tipo === 'gasto').reduce((acc, t) => acc + Number(t.valor), 0);
  
  return {
    total_receitas: receitas,
    total_gastos: gastos,
    saldo_total: receitas - gastos
  };
};