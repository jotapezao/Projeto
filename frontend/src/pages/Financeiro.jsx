import React, { useState, useMemo } from 'react';
import { ArrowLeft, Wallet, DollarSign, TrendingUp, AlertCircle, Calendar, ChevronRight, Filter, CheckCircle } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

function Financeiro({ pedidos, clientes, onBack, theme, settings, onToggleTheme, onNavigateToSuporte, onNavigateToPrivacidade, onNavigateToTermos }) {
    const [periodo, setPeriodo] = useState('TOTAL');
    const [customRange, setCustomRange] = useState({ start: '', end: '' });

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    const isWithinPeriod = (dateStr) => {
        if (periodo === 'TOTAL') return true;

        const date = new Date(dateStr);
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        if (periodo === 'HOJE') {
            return date >= startOfToday;
        }

        if (periodo === 'SEMANA') {
            const startOfWeek = new Date(startOfToday);
            startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
            return date >= startOfWeek;
        }

        if (periodo === 'MES') {
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            return date >= startOfMonth;
        }

        if (periodo === 'PERSONALIZADO') {
            if (!customRange.start || !customRange.end) return true;
            const start = new Date(customRange.start);
            const end = new Date(customRange.end);
            end.setHours(23, 59, 59, 999);
            return date >= start && date <= end;
        }

        return true;
    };

    const stats = useMemo(() => {
        const filtered = pedidos.filter(p => isWithinPeriod(p.dataCriacao));

        const totalGeral = filtered.reduce((sum, p) => sum + p.valorTotal, 0);
        const totalRecebido = filtered.reduce((sum, p) => sum + (p.valorPago || 0), 0);
        const totalAReceber = filtered.reduce((sum, p) => sum + (p.valorTotal - (p.valorPago || 0)), 0);

        const pendencias = filtered.filter(p => p.statusPagamento !== 'PAGO');

        return {
            totalGeral,
            totalRecebido,
            totalAReceber,
            pendencias,
            count: filtered.length
        };
    }, [pedidos, periodo, customRange]);

    const getClienteNome = (clienteId) => {
        const cliente = clientes.find(c => c.id === clienteId);
        return cliente ? cliente.nome : 'Cliente não encontrado';
    };

    const grouping = useMemo(() => {
        const filtered = pedidos.filter(p => isWithinPeriod(p.dataCriacao));
        const byPayment = {};
        filtered.forEach(p => {
            if (p.statusPagamento === 'PAGO') {
                const method = p.forma_pagamento || 'Outros';
                byPayment[method] = (byPayment[method] || 0) + p.valorTotal;
            }
        });
        return byPayment;
    }, [pedidos, periodo, customRange]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--color-background)' }}>
            <Header
                title="Financeiro"
                theme={theme}
                settings={settings}
                onToggleTheme={onToggleTheme}
                leftAction={
                    <button className="icon-btn" onClick={onBack}>
                        <ArrowLeft size={22} />
                    </button>
                }
            />

            <main className="container" style={{ paddingTop: '24px', paddingBottom: '40px', flex: 1 }}>

                {/* Period Selector */}
                <div style={{ marginBottom: '24px' }}>
                    <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px' }}>
                        {[
                            { id: 'TOTAL', label: 'Tudo' },
                            { id: 'HOJE', label: 'Hoje' },
                            { id: 'SEMANA', label: 'Semana' },
                            { id: 'MES', label: 'Mês' },
                            { id: 'PERSONALIZADO', label: 'Personalizado' }
                        ].map(p => (
                            <button
                                key={p.id}
                                onClick={() => setPeriodo(p.id)}
                                className={`btn-filter ${periodo === p.id ? 'active' : ''}`}
                                style={{ whiteSpace: 'nowrap' }}
                            >
                                {p.label}
                            </button>
                        ))}
                    </div>

                    {periodo === 'PERSONALIZADO' && (
                        <div className="card animate-slide-in" style={{ marginTop: '12px', padding: '16px', display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
                            <div style={{ flex: 1 }}>
                                <label className="form-label">Início</label>
                                <input
                                    type="date"
                                    className="form-input"
                                    value={customRange.start}
                                    onChange={(e) => setCustomRange(prev => ({ ...prev, start: e.target.value }))}
                                />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label className="form-label">Fim</label>
                                <input
                                    type="date"
                                    className="form-input"
                                    value={customRange.end}
                                    onChange={(e) => setCustomRange(prev => ({ ...prev, end: e.target.value }))}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Stats Grid */}
                <div className="stats-grid animate-fade-in" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                    <div className="stat-card" style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', right: '-10px', top: '-10px', opacity: 0.1 }}>
                            <DollarSign size={80} />
                        </div>
                        <div style={{ color: 'var(--color-text-secondary)', fontSize: '14px', fontWeight: 800, marginBottom: '8px' }}>PRODUZIDO</div>
                        <div style={{ fontSize: '32px', fontWeight: 900, color: 'var(--color-primary)' }}>{formatCurrency(stats.totalGeral)}</div>
                        <div style={{ fontSize: '12px', color: 'var(--color-text-tertiary)', marginTop: '4px' }}>{stats.count} pedidos no período</div>
                    </div>

                    <div className="stat-card" style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', right: '-10px', top: '-10px', opacity: 0.1 }}>
                            <TrendingUp size={80} />
                        </div>
                        <div style={{ color: 'var(--color-text-secondary)', fontSize: '14px', fontWeight: 800, marginBottom: '8px' }}>RECEBIDO</div>
                        <div style={{ fontSize: '32px', fontWeight: 900, color: 'var(--color-success)' }}>{formatCurrency(stats.totalRecebido)}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--color-success)', marginTop: '4px' }}>
                            <CheckCircle size={12} /> Pagamentos efetuados
                        </div>
                    </div>

                    <div className="stat-card" style={{ padding: '24px', position: 'relative', overflow: 'hidden', borderLeft: '4px solid var(--color-danger)' }}>
                        <div style={{ position: 'absolute', right: '-10px', top: '-10px', opacity: 0.1 }}>
                            <AlertCircle size={80} />
                        </div>
                        <div style={{ color: 'var(--color-text-secondary)', fontSize: '14px', fontWeight: 800, marginBottom: '8px' }}>PENDENTE</div>
                        <div style={{ fontSize: '32px', fontWeight: 900, color: 'var(--color-danger)' }}>{formatCurrency(stats.totalAReceber)}</div>
                        <div style={{ fontSize: '12px', color: 'var(--color-danger)', marginTop: '4px' }}>{stats.pendencias.length} pendências</div>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>

                    {/* Payment Method Breakdown */}
                    <div className="card" style={{ padding: '24px' }}>
                        <h2 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Wallet size={20} color="var(--color-primary)" />
                            Receita por Pagamento
                        </h2>
                        {Object.keys(grouping).length === 0 ? (
                            <p style={{ textAlign: 'center', padding: '20px', color: 'var(--color-text-tertiary)' }}>Nenhum valor recebido.</p>
                        ) : (
                            <div style={{ display: 'grid', gap: '10px' }}>
                                {Object.entries(grouping).map(([method, value]) => (
                                    <div key={method} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'var(--color-surface-solid)', borderRadius: '12px' }}>
                                        <span style={{ fontWeight: '700' }}>{method}</span>
                                        <span style={{ fontWeight: '900', color: 'var(--color-success)' }}>{formatCurrency(value)}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Pendências List Snippet */}
                    <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
                        <div style={{ padding: '20px', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2 style={{ fontSize: '18px', fontWeight: '800' }}>Pendências Atuais</h2>
                            <span className="badge badge-danger">{stats.pendencias.length}</span>
                        </div>

                        {stats.pendencias.length === 0 ? (
                            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-tertiary)' }}>
                                <CheckCircle size={48} style={{ opacity: 0.2, marginBottom: '12px' }} />
                                <p>Tudo em dia!</p>
                            </div>
                        ) : (
                            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                {stats.pendencias.map((pedido, index) => {
                                    const valorPendente = pedido.valorTotal - (pedido.valorPago || 0);
                                    return (
                                        <div
                                            key={pedido.id}
                                            style={{
                                                padding: '16px 20px',
                                                borderBottom: '1px solid var(--color-border)',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                background: index % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.02)'
                                            }}
                                        >
                                            <div style={{ flex: 1 }}>
                                                <h3 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '2px' }}>{getClienteNome(pedido.clienteId)}</h3>
                                                <span style={{ fontSize: '12px', color: 'var(--color-text-tertiary)' }}>{pedido.descricao}</span>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <div style={{ fontSize: '16px', fontWeight: '800', color: 'var(--color-danger)' }}>{formatCurrency(valorPendente)}</div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer onNavigate={(type) => {
                if (type === 'suporte') onNavigateToSuporte();
                if (type === 'privacidade') onNavigateToPrivacidade();
                if (type === 'termos') onNavigateToTermos();
            }} />
        </div >
    );
}

export default Financeiro;
