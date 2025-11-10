-- Tabela 1: Usuarios
-- Usamos SERIAL para um ID numérico automático (1, 2, 3...)
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha_hash VARCHAR(255) NOT NULL,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela 2: Transacoes
-- Também usa SERIAL para seu ID
CREATE TABLE IF NOT EXISTS transacoes (
    id SERIAL PRIMARY KEY,
    
    -- Linka com o ID numérico do usuário
    usuario_id INTEGER NOT NULL,
    
    titulo VARCHAR(100) NOT NULL,
    valor NUMERIC(10, 2) NOT NULL, -- Ex: 12345678.90
    
    -- 'receita' ou 'gasto'
    tipo VARCHAR(10) NOT NULL CHECK (tipo IN ('receita', 'gasto')),
    
    categoria VARCHAR(50) NOT NULL,
    data TIMESTAMP WITH TIME ZONE NOT NULL,
    
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Define a relação: uma transação PERTENCE a um usuário.
    -- Se um usuário for deletado, todas as suas transações também serão.
    CONSTRAINT fk_usuario
        FOREIGN KEY(usuario_id) 
        REFERENCES usuarios(id)
        ON DELETE CASCADE
);

-- Índices para otimizar buscas
CREATE INDEX IF NOT EXISTS idx_transacoes_usuario_id ON transacoes(usuario_id);
CREATE INDEX IF NOT EXISTS idx_transacoes_tipo ON transacoes(tipo);