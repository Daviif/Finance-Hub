-- Perfil financeiro do usuário (1:1 com users)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    nome VARCHAR(200),
    email VARCHAR(100),
    telefone VARCHAR(30),
    salario NUMERIC(12, 2) DEFAULT 0,
    custos_basicos NUMERIC(12, 2) DEFAULT 0,
    limite_alerta NUMERIC(12, 2) DEFAULT 0,
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);