-- Adiciona suporte a parcelas (cartão de crédito, boleto parcelado)
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS forma_pagamento VARCHAR(30) DEFAULT 'dinheiro';
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS parcelas INTEGER DEFAULT 1;
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS parcela_atual INTEGER DEFAULT 1;
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS grupo_parcela_id UUID;
