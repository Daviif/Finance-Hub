// frontend/src/services/api/ApiService.ts
import axios from 'axios';
import { getToken } from '../../utils/auth';

const API_URL = 'http://localhost:3000';

function getAuthHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// --- 1. Interfaces ---

export interface LoginResponse {
  token: string;
  user: { id: string; username: string; email: string; }
}

export interface RegisterResponse {
  id: string;
  nome: string;
  email: string;
}

export interface ForgotResponse {
  email: string; message: string;
}

export interface Transaction {
  id: string | number;
  titulo: string;
  valor: number;
  tipo: 'receita' | 'gasto';
  categoria: string;
  data: string;
  forma_pagamento?: string;
  parcelas?: number;
  parcela_atual?: number;
  grupo_parcela_id?: string;
}

export interface SummaryResponse {
  saldo_total: number;
  total_receitas: number;
  total_gastos: number;
}

export interface UserProfile {
  nome: string;
  email: string;
  telefone: string;
  salario: number;
  custos_basicos: number;
  limite_alerta: number;
}

export interface FinancialGoal {
  titulo: string;
  valor_objetivo: number;
  valor_atual: number;
  data_limite: string;
}

// --- 2. Dados Falsos (Mock para o Dashboard) ---

const delay = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));
const generateToken = (email: string) => `fake-jwt-${btoa(email)}-${Date.now()}`;

let mockTransactions: Transaction[] = [
  { 
    id: 1, 
    titulo: 'Salário Mensal', 
    valor: 5000.00, 
    tipo: 'receita', 
    categoria: 'Trabalho', 
    data: new Date().toISOString() 
  },
  { 
    id: 2, 
    titulo: 'Almoço Restaurante', 
    valor: 45.90, 
    tipo: 'gasto', 
    categoria: 'Alimentação', 
    data: new Date().toISOString() 
  },
  { 
    id: 3, 
    titulo: 'Uber', 
    valor: 15.50, 
    tipo: 'gasto', 
    categoria: 'Transporte', 
    data: new Date().toISOString() 
  },
];

let mockProfile: UserProfile = {
  nome: 'Dev Teste',
  email: 'dev@email.com',
  telefone: '(31) 99999-9999',
  salario: 5000.00,
  custos_basicos: 2000.00,
  limite_alerta: 3000.00
};

let mockGoal: FinancialGoal = {
  titulo: 'Reserva de Emergência',
  valor_objetivo: 10000,
  valor_atual: 2500,
  data_limite: '2026-12-25'
};

// --- 3. Funções da API ---

// LOGIN - integrado com backend e banco
export const apiLogin = async (email: string, senha: string): Promise<LoginResponse> => {
  try {
    const response = await axios.post(`${API_URL}/users/login`, {
      email,
      password: senha
    });

    return {
      token: response.data.token,
      user: {
        id: response.data.user.id,
        username: response.data.user.username,
        email: response.data.user.email
      }
    };
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Falha ao conectar com o servidor');
  }
};

// CADASTRO REAL - integrado com o backend e banco
export const apiRegister = async (nome: string, email: string, senha: string): Promise<RegisterResponse> => {
  try {
    const response = await axios.post(`${API_URL}/users/register`, {
      username: nome,
      email: email,
      password: senha
    });

    return {
      id: response.data.id,
      nome: response.data.username,
      email: response.data.email
    };
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Erro ao conectar com o servidor');
  }
};

// --- MANTENDO O RESTO COMO MOCK ---

export const apiForgot = async (email: string): Promise<ForgotResponse> => {
  await delay(800);
  return { email, message: 'Email enviado' };
};

export const apiGetTransactions = async (): Promise<Transaction[]> => {
  try {
    const { data } = await axios.get<Transaction[]>(`${API_URL}/transactions`, {
      headers: getAuthHeaders()
    });
    return data;
  } catch {
    return [...mockTransactions];
  }
};

export interface CreateTransactionInput {
  titulo: string;
  valor?: number;
  valorTotal?: number;
  tipo: 'receita' | 'gasto';
  categoria: string;
  data: string;
  forma_pagamento?: string;
  parcelas?: number;
}

export const apiCreateTransaction = async (nova: CreateTransactionInput): Promise<Transaction | { transactions: Transaction[] }> => {
  try {
    const { data } = await axios.post(`${API_URL}/transactions`, nova, {
      headers: getAuthHeaders()
    });
    return data;
  } catch (err: any) {
    if (err.response?.data?.message) throw new Error(err.response.data.message);
    throw new Error('Erro ao criar transação');
  }
};

export const apiDeleteTransaction = async (id: string | number): Promise<void> => {
  await axios.delete(`${API_URL}/transactions/${id}`, {
    headers: getAuthHeaders()
  });
};

export const apiGetSummary = async (): Promise<SummaryResponse> => {
  try {
    const transacoes = await apiGetTransactions();
    const receitas = transacoes
      .filter(t => t.tipo === 'receita')
      .reduce((acc, t) => acc + Number(t.valor), 0);
    const gastos = transacoes
      .filter(t => t.tipo === 'gasto')
      .reduce((acc, t) => acc + Number(t.valor), 0);
    return {
      total_receitas: receitas,
      total_gastos: gastos,
      saldo_total: receitas - gastos
    };
  } catch {
    return { total_receitas: 0, total_gastos: 0, saldo_total: 0 };
  }
};

export const apiGetProfile = async (): Promise<UserProfile> => {
  await delay(600);
  return { ...mockProfile };
};

export const apiUpdateProfile = async (dados: UserProfile): Promise<UserProfile> => {
  await delay(1000);
  mockProfile = { ...dados };
  return mockProfile;
};

export const apiGetGoal = async (): Promise<FinancialGoal> => {
  await delay(600);
  return { ...mockGoal };
};

export const apiUpdateGoal = async (meta: FinancialGoal): Promise<FinancialGoal> => {
  await delay(1000);
  mockGoal = { ...meta };
  return mockGoal;
};