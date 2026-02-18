import React, { useState } from 'react';
import { ArrowLeft, Users, Phone, UserPlus, MessageCircle, FileText, Pencil, Trash2, X, IdCard } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

function Clientes({ clientes, pedidos, onBack, onAddCliente, onUpdateCliente, onDeleteCliente, theme, settings, onToggleTheme, onNavigateToSuporte, onNavigateToPrivacidade, onNavigateToTermos }) {
    const [showForm, setShowForm] = useState(false);
    const [isEditing, setIsEditing] = useState(null);
    const [formData, setFormData] = useState({ nome: '', telefone: '', cpf: '' });
    const [viewingHistory, setViewingHistory] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const formatCPF = (value) => {
        const numbers = value.replace(/\D/g, '').substring(0, 11);
        if (numbers.length <= 3) return numbers;
        if (numbers.length <= 6) return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
        if (numbers.length <= 9) return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
        return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`;
    };

    const formatTelefone = (value) => {
        const numbers = value.replace(/\D/g, '').substring(0, 11);
        if (numbers.length <= 2) return numbers;
        if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
        return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        let formattedValue = value;

        if (name === 'cpf') {
            formattedValue = formatCPF(value);
        } else if (name === 'telefone') {
            formattedValue = formatTelefone(value);
        }

        setFormData(prev => ({ ...prev, [name]: formattedValue }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.nome && formData.telefone) {
            try {
                if (isEditing) {
                    await onUpdateCliente({ ...formData, id: isEditing });
                } else {
                    const result = await onAddCliente(formData);
                    if (!result) {
                        alert("Ocorreu um erro ao salvar o cliente. Verifique se os dados estão corretos.");
                        return;
                    }
                }
                resetForm();
            } catch (err) {
                console.error("Erro ao processar cliente:", err);
                alert("Erro ao conectar com o servidor.");
            }
        }
    };

    const resetForm = () => {
        setFormData({ nome: '', telefone: '', cpf: '' });
        setShowForm(false);
        setIsEditing(null);
    };

    const handleEdit = (cliente) => {
        setFormData({ nome: cliente.nome, telefone: cliente.telefone, cpf: cliente.cpf || '' });
        setIsEditing(cliente.id);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = (id) => {
        if (window.confirm('Tem certeza que deseja excluir este cliente?')) {
            onDeleteCliente(id);
        }
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return '-';
        return new Date(timestamp).toLocaleDateString('pt-BR');
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2
        }).format(value);
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'PAGO': return 'badge-success';
            case 'A_PAGAR': return 'badge-danger';
            case 'PARCIAL': return 'badge-warning';
            default: return 'badge-info';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'PAGO': return 'Pago';
            case 'A_PAGAR': return 'A Pagar';
            case 'PARCIAL': return 'Parcial';
            default: return status;
        }
    };

    if (viewingHistory) {
        const clientePedidos = pedidos.filter(p => p.clienteId === viewingHistory.id).sort((a, b) => b.dataCriacao - a.dataCriacao);

        return (
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--color-background)' }}>
                <Header
                    title={`Histórico: ${viewingHistory.nome}`}
                    theme={theme}
                    settings={settings}
                    onToggleTheme={onToggleTheme}
                    leftAction={
                        <button className="icon-btn" onClick={() => setViewingHistory(null)}>
                            <ArrowLeft size={22} />
                        </button>
                    }
                />

                <main className="container" style={{ paddingTop: '24px', paddingBottom: '40px', flex: 1 }}>
                    {clientePedidos.length === 0 ? (
                        <div className="empty-state animate-fade-in">
                            <FileText className="empty-state-icon" size={80} style={{ opacity: 0.2 }} />
                            <h3 className="empty-state-title">Nenhum pedido encontrado</h3>
                            <p className="empty-state-text">Este cliente ainda não fez pedidos.</p>
                        </div>
                    ) : (
                        <div className="pedidos-list animate-fade-in">
                            {clientePedidos.map((pedido, index) => (
                                <div
                                    key={pedido.id}
                                    className="pedido-card"
                                    style={{ animationDelay: `${index * 50}ms`, cursor: 'default' }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div>
                                            <p className="pedido-descricao" style={{ fontWeight: '700', fontSize: '16px' }}>{pedido.descricao}</p>
                                            <div style={{ display: 'flex', gap: '12px', marginTop: '8px', color: 'var(--color-text-secondary)', fontSize: '13px' }}>
                                                <span>Data: {formatDate(pedido.dataEntrega)}</span>
                                                <span style={{ fontWeight: 'bold', color: 'var(--color-text-primary)' }}>{formatCurrency(pedido.valorTotal)}</span>
                                            </div>
                                        </div>
                                        <span className={`badge ${getStatusBadgeClass(pedido.statusPagamento)}`}>
                                            {getStatusText(pedido.statusPagamento)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </main>
                <Footer onNavigate={(type) => {
                    if (type === 'suporte') onNavigateToSuporte();
                    if (type === 'privacidade') onNavigateToPrivacidade();
                    if (type === 'termos') onNavigateToTermos();
                }} />
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--color-background)' }}>
            <Header
                title="Meus Clientes"
                theme={theme}
                settings={settings}
                onToggleTheme={onToggleTheme}
                leftAction={
                    <button className="icon-btn" onClick={onBack}>
                        <ArrowLeft size={22} />
                    </button>
                }
                rightActions={
                    <button className="icon-btn" onClick={() => setShowForm(!showForm)} title="Novo Cliente">
                        <UserPlus size={22} />
                    </button>
                }
            />

            <main className="container" style={{ paddingTop: '24px', paddingBottom: '40px', flex: 1 }}>
                <div style={{ marginBottom: '20px' }}>
                    <div className="search-container" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                        <input
                            type="text"
                            placeholder="Buscar por nome, CPF ou WhatsApp..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '14px 20px',
                                paddingLeft: '48px',
                                borderRadius: '16px',
                                border: '1px solid var(--color-border)',
                                background: 'var(--color-surface)',
                                color: 'var(--color-text-primary)',
                                fontSize: '16px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                            }}
                        />
                        <Users size={20} style={{ position: 'absolute', left: '16px', color: 'var(--color-text-tertiary)', opacity: 0.6 }} />
                    </div>
                </div>

                {showForm && (
                    <div className="card animate-slide-in" style={{ marginBottom: '24px', border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
                        <div style={{ padding: '16px', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2 style={{ fontSize: '18px', fontWeight: '800' }}>{isEditing ? 'Editar Cliente' : 'Novo Cliente'}</h2>
                            <button className="icon-btn" style={{ width: '32px', height: '32px', background: 'transparent' }} onClick={resetForm}><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit} style={{ padding: '20px' }}>
                            <div className="form-group">
                                <label className="form-label">Nome *</label>
                                <input
                                    type="text"
                                    name="nome"
                                    value={formData.nome}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="Nome completo"
                                    required
                                    style={{ background: '#fff', color: '#000' }}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">WhatsApp *</label>
                                <input
                                    type="tel"
                                    name="telefone"
                                    value={formData.telefone}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="11999999999"
                                    required
                                    style={{ background: '#fff', color: '#000' }}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">CPF (Opcional)</label>
                                <input
                                    type="text"
                                    name="cpf"
                                    value={formData.cpf}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="000.000.000-00"
                                    style={{ background: '#fff', color: '#000' }}
                                />
                            </div>

                            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: '14px', borderRadius: '12px', fontWeight: '800' }}>
                                    {isEditing ? 'Salvar Alterações' : 'Cadastrar Cliente'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {clientes.length === 0 ? (
                    <div className="empty-state animate-fade-in">
                        <Users className="empty-state-icon" size={100} style={{ opacity: 0.2 }} />
                        <h2 className="empty-state-title">Nenhum cliente</h2>
                        <p className="empty-state-text">Adicione seu primeiro cliente!</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: '16px' }} className="animate-fade-in">
                        {clientes
                            .filter(cliente =>
                                cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                (cliente.telefone && cliente.telefone.includes(searchTerm)) ||
                                (cliente.cpf && cliente.cpf.includes(searchTerm))
                            )
                            .map((cliente, index) => (
                                <div
                                    key={cliente.id}
                                    className="pedido-card-new"
                                    style={{
                                        animationDelay: `${index * 50}ms`,
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '20px',
                                        background: 'var(--color-surface-solid)',
                                        borderRadius: '20px',
                                        border: '1px solid var(--color-border)',
                                        boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                                        <div style={{
                                            width: '48px',
                                            height: '48px',
                                            borderRadius: '14px',
                                            background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)',
                                            color: 'white',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '20px',
                                            fontWeight: '900',
                                            boxShadow: '0 8px 16px rgba(94, 92, 230, 0.2)'
                                        }}>
                                            {cliente.nome.charAt(0).toUpperCase()}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '4px', color: 'var(--color-text-primary)' }}>{cliente.nome}</h3>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-text-secondary)', fontSize: '14px' }}>
                                                    <Phone size={14} style={{ opacity: 0.6 }} />
                                                    <span>{cliente.telefone}</span>
                                                </div>
                                                {cliente.cpf && (
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-text-tertiary)', fontSize: '14px' }}>
                                                        <IdCard size={14} style={{ opacity: 0.6 }} />
                                                        <span>{cliente.cpf}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button
                                            className="icon-btn"
                                            style={{ background: 'rgba(37, 211, 102, 0.1)', color: '#25D366', border: 'none', width: '40px', height: '40px' }}
                                            onClick={() => window.open(`https://wa.me/55${cliente.telefone.replace(/\D/g, '')}`, '_blank')}
                                            title="WhatsApp"
                                        >
                                            <MessageCircle size={20} />
                                        </button>
                                        <button
                                            className="icon-btn"
                                            style={{ background: 'var(--color-surface)', color: 'var(--color-accent)', width: '40px', height: '40px' }}
                                            onClick={() => setViewingHistory(cliente)}
                                            title="Histórico"
                                        >
                                            <FileText size={20} />
                                        </button>
                                        <button
                                            className="icon-btn"
                                            style={{ background: 'var(--color-surface)', color: 'var(--color-primary)', width: '40px', height: '40px' }}
                                            onClick={() => handleEdit(cliente)}
                                            title="Editar"
                                        >
                                            <Pencil size={20} />
                                        </button>
                                        <button
                                            className="icon-btn"
                                            style={{ background: 'rgba(255, 69, 58, 0.1)', color: '#ff453a', border: 'none', width: '40px', height: '40px' }}
                                            onClick={() => handleDelete(cliente.id)}
                                            title="Excluir"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                    </div>
                )}
            </main>
            <Footer onNavigate={(type) => {
                if (type === 'suporte') onNavigateToSuporte();
                if (type === 'privacidade') onNavigateToPrivacidade();
                if (type === 'termos') onNavigateToTermos();
            }} />
        </div>
    );
}

export default Clientes;
