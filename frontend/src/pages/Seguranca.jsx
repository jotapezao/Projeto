import React, { useState } from 'react';
import { ArrowLeft, User, Lock, Trash2, Plus, ShieldCheck, ShieldAlert, KeyRound, FileText } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

function Seguranca({ users, onBack, onCreateUser, onDeleteUser, onResetPassword, currentUser, theme, onToggleTheme, onNavigateToSuporte, onNavigateToPrivacidade, onNavigateToTermos }) {
    const [showNewUserForm, setShowNewUserForm] = useState(false);
    const [newUser, setNewUser] = useState({ name: '', username: '', password: '', role: 'user' });
    const [notification, setNotification] = useState(null);

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const handleCreateUser = (e) => {
        e.preventDefault();
        try {
            onCreateUser(newUser);
            setNewUser({ name: '', username: '', password: '', role: 'user' });
            setShowNewUserForm(false);
            showNotification('Usuário criado com sucesso!');
        } catch (error) {
            showNotification(error.message, 'error');
        }
    };

    const handleDelete = (username) => {
        if (window.confirm(`Tem certeza que deseja excluir o usuário ${username}?`)) {
            try {
                onDeleteUser(username);
                showNotification('Usuário excluído.', 'success');
            } catch (error) {
                showNotification(error.message, 'error');
            }
        }
    };

    const handleReset = (username) => {
        const newPass = prompt(`Digite a nova senha para ${username}:`);
        if (newPass) {
            onResetPassword(username, newPass);
            showNotification('Senha alterada com sucesso!');
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--color-background)' }}>
            <Header
                title="Segurança"
                theme={theme}
                onToggleTheme={onToggleTheme}
                leftAction={
                    <button className="icon-btn" onClick={onBack}>
                        <ArrowLeft size={22} />
                    </button>
                }
            />

            {/* Notification Toast */}
            {notification && (
                <div style={{
                    position: 'fixed',
                    top: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: notification.type === 'error' ? 'var(--color-danger)' : 'var(--color-success)',
                    color: 'white',
                    padding: '12px 24px',
                    borderRadius: 'var(--radius-full)',
                    zIndex: 1000,
                    boxShadow: 'var(--shadow-lg)',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }} className="animate-fade-in">
                    {notification.type === 'error' ? <ShieldAlert size={20} /> : <ShieldCheck size={20} />}
                    {notification.message}
                </div>
            )}

            {/* Main Content */}
            <main className="container" style={{ paddingTop: 'var(--space-xl)', paddingBottom: 'var(--space-xl)', flex: 1 }}>

                {/* Configurações do Comprovante */}
                <div className="card animate-fade-in" style={{ marginBottom: '24px', border: 'none', boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                        <div style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, #5e5ce6 0%, #007aff 100%)', color: 'white', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <FileText size={24} />
                        </div>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800' }}>Dados do Comprovante</h3>
                            <p style={{ margin: 0, fontSize: '13px', color: 'var(--color-text-secondary)' }}>Personalize o cabeçalho do recibo PDF</p>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gap: '20px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px' }}>
                            <label className="form-label" style={{ fontWeight: '700', fontSize: '13px', marginBottom: '0' }}>NOME DO PROFISSIONAL / ATELIÊ</label>
                            <input
                                type="text"
                                className="form-input"
                                value={settings.receipt_name}
                                onChange={(e) => onUpdateSettings({ receipt_name: e.target.value })}
                                style={{ background: 'var(--color-surface-solid)', border: '1px solid var(--color-border)' }}
                            />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px' }}>
                            <label className="form-label" style={{ fontWeight: '700', fontSize: '13px', marginBottom: '0' }}>SUBTÍTULO / SLOGAN</label>
                            <input
                                type="text"
                                className="form-input"
                                value={settings.receipt_tagline}
                                onChange={(e) => onUpdateSettings({ receipt_tagline: e.target.value })}
                                style={{ background: 'var(--color-surface-solid)', border: '1px solid var(--color-border)' }}
                            />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div style={{ display: 'grid', gap: '8px' }}>
                                <label className="form-label" style={{ fontWeight: '700', fontSize: '13px', marginBottom: '0' }}>CONTATO (WHATSAPP)</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={settings.receipt_phone}
                                    onChange={(e) => onUpdateSettings({ receipt_phone: e.target.value })}
                                    style={{ background: 'var(--color-surface-solid)', border: '1px solid var(--color-border)' }}
                                />
                            </div>
                            <div style={{ display: 'grid', gap: '8px' }}>
                                <label className="form-label" style={{ fontWeight: '700', fontSize: '13px', marginBottom: '0' }}>ENDEREÇO (OPCIONAL)</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={settings.receipt_address}
                                    onChange={(e) => onUpdateSettings({ receipt_address: e.target.value })}
                                    style={{ background: 'var(--color-surface-solid)', border: '1px solid var(--color-border)' }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Lista de Usuários */}
                <div className="card animate-fade-in">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
                        <h3 className="card-title">Usuários do Sistema</h3>
                        <button className="btn btn-primary" onClick={() => setShowNewUserForm(true)}>
                            <Plus size={20} /> Novo Usuário
                        </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                        {users.map(user => (
                            <div key={user.username} style={{
                                padding: 'var(--space-md)',
                                background: 'var(--color-gray-50)',
                                borderRadius: 'var(--radius-lg)',
                                border: '1px solid var(--color-gray-200)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        background: user.role === 'admin' ? 'var(--color-primary)' : 'var(--color-gray-400)',
                                        color: 'white',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <User size={20} />
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 'bold' }}>{user.name}</div>
                                        <div style={{ fontSize: '0.875rem', color: 'var(--color-gray-500)' }}>
                                            @{user.username} • {user.role === 'admin' ? 'Administrador' : 'Usuário Padrão'}
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                                    <button
                                        className="btn btn-outline btn-sm"
                                        onClick={() => handleReset(user.username)}
                                        title="Redefinir Senha"
                                    >
                                        <KeyRound size={16} />
                                    </button>

                                    {user.username !== 'admin' && user.username !== currentUser.username && (
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleDelete(user.username)}
                                            title="Excluir Usuário"
                                            style={{ background: 'var(--color-danger)', color: 'white', border: 'none' }}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Modal / Form de Novo Usuário */}
                {showNewUserForm && (
                    <div style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0,0,0,0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 900
                    }}>
                        <div className="card animate-fade-in" style={{ width: '90%', maxWidth: '400px' }}>
                            <h3 className="card-title" style={{ marginBottom: 'var(--space-lg)' }}>Novo Usuário</h3>
                            <form onSubmit={handleCreateUser}>
                                <div className="form-group">
                                    <label className="form-label">Nome Completo</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={newUser.name}
                                        onChange={e => setNewUser({ ...newUser, name: e.target.value })}
                                        required
                                        placeholder="Ex: Maria Silva"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Nome de Usuário (Login)</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={newUser.username}
                                        onChange={e => setNewUser({ ...newUser, username: e.target.value.toLowerCase().replace(/\s/g, '') })}
                                        required
                                        placeholder="Ex: maria"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Senha Inicial</label>
                                    <input
                                        type="password"
                                        className="form-input"
                                        value={newUser.password}
                                        onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                                        required
                                        placeholder="******"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Nível de Acesso</label>
                                    <select
                                        className="form-select"
                                        value={newUser.role}
                                        onChange={e => setNewUser({ ...newUser, role: e.target.value })}
                                    >
                                        <option value="user">Usuário Padrão</option>
                                        <option value="admin">Administrador</option>
                                    </select>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)', marginTop: 'var(--space-xl)' }}>
                                    <button type="button" className="btn btn-outline" onClick={() => setShowNewUserForm(false)}>
                                        Cancelar
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        Criar
                                    </button>
                                </div>
                            </form>
                        </div>
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

export default Seguranca;
