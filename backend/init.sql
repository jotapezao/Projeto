-- Create tables for the CosturaCerta application

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100),
    role VARCHAR(20) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS clientes (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    telefone VARCHAR(20),
    cpf VARCHAR(14),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS servicos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    valor DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pedidos (
    id SERIAL PRIMARY KEY,
    cliente_id INTEGER REFERENCES clientes(id),
    descricao TEXT,
    itens JSONB, -- Stores array of {descricao, preco}
    data_entrega TIMESTAMP,
    status_servico VARCHAR(20) DEFAULT 'EM_ANDAMENTO',
    status_pagamento VARCHAR(20) DEFAULT 'A_PAGAR',
    valor_total DECIMAL(10, 2),
    valor_pago DECIMAL(10, 2) DEFAULT 0,
    forma_pagamento VARCHAR(50),
    fotos TEXT[], -- Array of base64 strings or URLs
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin user if not exists
INSERT INTO users (username, password, name, role) 
VALUES ('admin', 'admin', 'Administrador', 'admin')
ON CONFLICT (username) DO NOTHING;

-- Insert default services
INSERT INTO servicos (nome, valor) VALUES 
('Barra de Calça', 25.00),
('Barra Original', 35.00),
('Ajuste de Cintura', 30.00),
('Troca de Zíper', 20.00),
('Vestido de Festa (Ajuste)', 80.00),
('Conserto Pequeno', 15.00)
ON CONFLICT DO NOTHING;

CREATE TABLE IF NOT EXISTS settings (
    key VARCHAR(50) PRIMARY KEY,
    value TEXT
);

INSERT INTO settings (key, value) VALUES ('receipt_name', 'COSTURACERTA') ON CONFLICT (key) DO NOTHING;
INSERT INTO settings (key, value) VALUES ('receipt_tagline', 'Comprovante de Serviço Profissional') ON CONFLICT (key) DO NOTHING;
INSERT INTO settings (key, value) VALUES ('receipt_phone', '(00) 00000-0000') ON CONFLICT (key) DO NOTHING;
INSERT INTO settings (key, value) VALUES ('receipt_address', '') ON CONFLICT (key) DO NOTHING;
INSERT INTO settings (key, value) VALUES ('receipt_cnpj', '') ON CONFLICT (key) DO NOTHING;
INSERT INTO settings (key, value) VALUES ('system_logo', '') ON CONFLICT (key) DO NOTHING;
