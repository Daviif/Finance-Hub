-- Orçamento por categoria (Histórias 12-13: limites e alertas)
CREATE TABLE IF NOT EXISTS budget_limits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    categoria VARCHAR(100) NOT NULL,
    limite_mensal NUMERIC(12, 2) NOT NULL,
    mes INTEGER CHECK (mes IS NULL OR (mes >= 1 AND mes <= 12)),
    ano INTEGER,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_budget_limits_user_id ON budget_limits(user_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_budget_limits_user_categoria ON budget_limits(user_id, categoria);