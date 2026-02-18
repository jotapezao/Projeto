const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware - Increase limit for base64 photos
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Database connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // Fallback to individual variables if DATABASE_URL is not provided
    ...(process.env.DATABASE_URL ? {} : {
        user: process.env.POSTGRES_USER || 'admin',
        host: process.env.POSTGRES_HOST || 'db',
        database: process.env.POSTGRES_DB || 'projota_db',
        password: process.env.POSTGRES_PASSWORD || 'secure_password_123',
        port: process.env.POSTGRES_PORT || 5432,
    }),
});

// Database Initialization
const fs = require('fs');
const path = require('path');

async function initDB() {
    const initSqlPath = path.join(__dirname, 'init.sql');
    if (fs.existsSync(initSqlPath)) {
        try {
            console.log('Initializing database tables...');
            const sql = fs.readFileSync(initSqlPath, 'utf8');
            await pool.query(sql);

            // Migrations for existing databases
            console.log('Running migrations...');
            await pool.query('ALTER TABLE clientes ADD COLUMN IF NOT EXISTS cpf VARCHAR(14)');
            await pool.query('ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS forma_pagamento VARCHAR(50)');

            console.log('Database initialized successfully.');
        } catch (err) {
            console.error('Database initialization error:', err);
        }
    }
}

initDB();

// Health check
app.get('/api/health', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.json({ status: 'ok', time: result.rows[0].now, db_connection: 'success' });
    } catch (err) {
        res.status(500).json({ status: 'error', error: err.message });
    }
});

// --- CLIENTES ---
app.get('/api/clientes', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM clientes ORDER BY nome ASC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/clientes', async (req, res) => {
    const { nome, telefone, cpf } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO clientes (nome, telefone, cpf) VALUES ($1, $2, $3) RETURNING *',
            [nome, telefone, cpf]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/clientes/:id', async (req, res) => {
    const { id } = req.params;
    const { nome, telefone, cpf } = req.body;
    try {
        const result = await pool.query(
            'UPDATE clientes SET nome = $1, telefone = $2, cpf = $3 WHERE id = $4 RETURNING *',
            [nome, telefone, cpf, id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/clientes/:id', async (req, res) => {
    const { id } = req.params;
    try {
        // Check if client has pedidos
        const orders = await pool.query('SELECT id FROM pedidos WHERE cliente_id = $1', [id]);
        if (orders.rows.length > 0) {
            return res.status(400).json({ error: 'Não é possível excluir cliente com pedidos vinculados.' });
        }
        await pool.query('DELETE FROM clientes WHERE id = $1', [id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- SERVICOS ---
app.get('/api/servicos', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM servicos ORDER BY nome ASC');
        res.json(result.rows.map(row => ({
            ...row,
            valor: parseFloat(row.valor)
        })));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/servicos', async (req, res) => {
    const { nome, valor } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO servicos (nome, valor) VALUES ($1, $2) RETURNING *',
            [nome, valor]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/servicos/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM servicos WHERE id = $1', [id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- PEDIDOS ---
app.get('/api/pedidos', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM pedidos ORDER BY data_criacao DESC');
        res.json(result.rows.map(row => ({
            ...row,
            clienteId: row.cliente_id,
            statusServico: row.status_servico,
            statusPagamento: row.status_pagamento,
            valorTotal: parseFloat(row.valor_total),
            valorPago: parseFloat(row.valor_pago),
            dataEntrega: row.data_entrega,
            dataCriacao: row.data_criacao
        })));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/pedidos', async (req, res) => {
    const p = req.body;
    console.log('Recebendo novo pedido:', JSON.stringify(p).substring(0, 500) + '...');
    try {
        const result = await pool.query(
            `INSERT INTO pedidos 
            (cliente_id, descricao, itens, data_entrega, status_servico, status_pagamento, valor_total, valor_pago, forma_pagamento, fotos) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
            [p.clienteId, p.descricao, JSON.stringify(p.itens), p.dataEntrega, p.statusServico, p.statusPagamento, p.valorTotal, p.valorPago || 0, p.formaPagamento, p.fotos]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/pedidos/:id', async (req, res) => {
    const { id } = req.params;
    const p = req.body;
    try {
        const result = await pool.query(
            `UPDATE pedidos SET 
            cliente_id = $1, descricao = $2, itens = $3, data_entrega = $4, 
            status_servico = $5, status_pagamento = $6, valor_total = $7, 
            valor_pago = $8, forma_pagamento = $9, fotos = $10 
            WHERE id = $11 RETURNING *`,
            [p.clienteId, p.descricao, JSON.stringify(p.itens), p.dataEntrega, p.statusServico, p.statusPagamento, p.valorTotal, p.valorPago, p.formaPagamento, p.fotos, id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.patch('/api/pedidos/:id/withdraw', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            "UPDATE pedidos SET status_servico = 'RETIRADO' WHERE id = $1 RETURNING *",
            [id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.patch('/api/pedidos/:id/pay', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            "UPDATE pedidos SET status_pagamento = 'PAGO', valor_pago = valor_total WHERE id = $1 RETURNING *",
            [id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- USUARIOS ---
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const result = await pool.query('SELECT * FROM users WHERE username = $1 AND password = $2', [username, password]);
        if (result.rows.length > 0) {
            const user = result.rows[0];
            delete user.password;
            res.json({ success: true, user });
        } else {
            res.status(401).json({ success: false, message: 'Usuário ou senha inválidos' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/users', async (req, res) => {
    try {
        const result = await pool.query('SELECT id, username, name, role FROM users');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/users', async (req, res) => {
    const { username, password, name, role } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO users (username, password, name, role) VALUES ($1, $2, $3, $4) RETURNING id, username, name, role',
            [username, password, name, role]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/users/:username', async (req, res) => {
    const { username } = req.params;
    if (username === 'admin') return res.status(400).json({ error: 'Cannot delete admin' });
    try {
        await pool.query('DELETE FROM users WHERE username = $1', [username]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.patch('/api/users/:username/password', async (req, res) => {
    const { username } = req.params;
    const { password } = req.body;
    try {
        await pool.query('UPDATE users SET password = $1 WHERE username = $2', [password, username]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- SETTINGS ---
app.get('/api/settings', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM settings');
        const settings = {};
        result.rows.forEach(row => {
            settings[row.key] = row.value;
        });
        res.json(settings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/settings', async (req, res) => {
    const settings = req.body; // Expecting { key: value }
    try {
        for (const [key, value] of Object.entries(settings)) {
            await pool.query(
                'INSERT INTO settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = $2',
                [key, value]
            );
        }
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
