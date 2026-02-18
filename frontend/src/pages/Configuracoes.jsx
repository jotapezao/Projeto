import React, { useState } from 'react';
import { ArrowLeft, User, Lock, Trash2, Plus, ShieldCheck, ShieldAlert, KeyRound, FileText, Settings, Building2, Camera, Phone, MapPin, Hash } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BrandedIcon from '../components/BrandedIcon';

function Configuracoes({ users, onBack, onCreateUser, onDeleteUser, onResetPassword, currentUser, theme, settings, onUpdateSettings, onToggleTheme, onNavigateToSuporte, onNavigateToPrivacidade, onNavigateToTermos }) {
    const [activeTab, setActiveTab] = useState('branding'); // 'branding' or 'security'
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

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                showNotification('A imagem deve ter no máximo 2MB', 'error');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                onUpdateSettings({ system_logo: reader.result });
                showNotification('Logo atualizada!');
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveLogo = () => {
        if (window.confirm('Deseja remover a logo atual?')) {
            onUpdateSettings({ system_logo: '' });
            showNotification('Logo removida.');
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--color-background)' }}>
            <Header
                title="Configurações"
                theme={theme}
                onToggleTheme={onToggleTheme}
                leftAction={
                    <button className="icon-btn" onClick={onBack}>
                        <ArrowLeft size={22} />
                    </button>
                }
            />

            {notification && (
                <div style={{
                    position: 'fixed',
                    top: '80px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: notification.type === 'error' ? 'var(--color-danger)' : 'var(--color-success)',
                    color: 'white',
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

            <main className="container" style={{ paddingTop: '24px', paddingBottom: '40px', flex: 1 }}>

                {/* Tabs */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', background: 'var(--color-surface)', padding: '6px', borderRadius: '16px', border: '1px solid var(--color-border)' }}>
                    <button
                        onClick={() => setActiveTab('branding')}
                        style={{
                            flex: 1,
                            padding: '12px',
                            borderRadius: '12px',
                            border: 'none',
                            background: activeTab === 'branding' ? 'var(--color-primary)' : 'transparent',
                            color: activeTab === 'branding' ? 'white' : 'var(--color-text-secondary)',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            transition: 'all 0.2s'
                        }}
                    >
                        <Building2 size={18} /> Personalização
                    </button>
                    <button
                        onClick={() => setActiveTab('security')}
                        style={{
                            flex: 1,
                            padding: '12px',
                            borderRadius: '12px',
                            border: 'none',
                            background: activeTab === 'security' ? 'var(--color-primary)' : 'transparent',
                            color: activeTab === 'security' ? 'white' : 'var(--color-text-secondary)',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            transition: 'all 0.2s'
                        }}
                    >
                        <Lock size={18} /> Segurança
                    </button>
                </div>

                {activeTab === 'branding' && (
                    <div className="animate-fade-in">
                        <div className="card" style={{ marginBottom: '24px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                                <div style={{ position: 'relative' }}>
                                    <div style={{
                                        width: '80px',
                                        height: '80px',
                                        borderRadius: '20px',
                                        background: 'var(--color-surface-solid)',
                                        border: '2px dashed var(--color-border)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        overflow: 'hidden'
                                    }}>
                                        <BrandedIcon
                                            size={64}
                                            settings={settings}
                                            fallbackIcon={Building2}
                                            style={{ opacity: settings.system_logo ? 1 : 0.3 }}
                                        />
                                    </div>
                                    <label style={{
                                        position: 'absolute',
                                        bottom: '-8px',
                                        right: '-8px',
                                        background: 'var(--color-primary)',
                                        color: 'white',
                                        width: '32px',
                                        height: '32px',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        boxShadow: 'var(--shadow-md)'
                                    }}>
                                        <Camera size={16} />
                                        <input type="file" accept="image/*" onChange={handleLogoChange} style={{ display: 'none' }} />
                                    </label>
                                </div>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '800' }}>Identidade Visual</h3>
                                    <p style={{ margin: '4px 0 0', fontSize: '14px', color: 'var(--color-text-secondary)' }}>Logo e informações da sua empresa</p>
                                    <div style={{
                                        marginTop: '12px',
                                        fontSize: '11px',
                                        padding: '8px 12px',
                                        background: 'rgba(94, 92, 230, 0.05)',
                                        borderRadius: '8px',
                                        border: '1px solid var(--color-border)',
                                        color: 'var(--color-text-secondary)',
                                        lineHeight: '1.4'
                                    }}>
                                        <strong>Requisitos da Logo:</strong><br />
                                        • Formatos: PNG, JPG ou WEBP<br />
                                        • Tamanho Máx: 2MB<br />
                                        • Recomendado: Quadrada (Ex: 512x512px)
                                    </div>
                                    {settings.system_logo && (
                                        <button
                                            onClick={handleRemoveLogo}
                                            style={{
                                                marginTop: '8px',
                                                background: 'none',
                                                border: 'none',
                                                color: '#ff453a',
                                                fontSize: '12px',
                                                fontWeight: '600',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '4px'
                                            }}
                                        >
                                            <Trash2 size={12} /> Remover Logo
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div style={{ display: 'grid', gap: '20px' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '16px' }}>
                                    <div className="form-group">
                                        <label className="form-label"><Building2 size={14} /> Nome da Empresa</label>
                                        <input
                                            className="form-input"
                                            value={settings.receipt_name}
                                            onChange={e => onUpdateSettings({ receipt_name: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label"><Hash size={14} /> CNPJ (Opcional)</label>
                                        <input
                                            className="form-input"
                                            value={settings.receipt_cnpj}
                                            onChange={e => onUpdateSettings({ receipt_cnpj: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label"><FileText size={14} /> Slogan / Subtítulo</label>
                                    <input
                                        className="form-input"
                                        value={settings.receipt_tagline}
                                        onChange={e => onUpdateSettings({ receipt_tagline: e.target.value })}
                                    />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '16px' }}>
                                    <div className="form-group">
                                        <label className="form-label"><Phone size={14} /> Telefone Contato</label>
                                        <input
                                            className="form-input"
                                            value={settings.receipt_phone}
                                            onChange={e => onUpdateSettings({ receipt_phone: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label"><MapPin size={14} /> Endereço</label>
                                        <input
                                            className="form-input"
                                            value={settings.receipt_address}
                                            onChange={e => onUpdateSettings({ receipt_address: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'security' && (
                    <div className="animate-fade-in">
                        <div className="card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '800' }}>Usuários</h3>
                                    <p style={{ margin: '4px 0 0', fontSize: '14px', color: 'var(--color-text-secondary)' }}>Gerencie acessos ao sistema</p>
                                </div>
                                <button className="btn btn-primary" onClick={() => setShowNewUserForm(true)} style={{ borderRadius: '14px' }}>
                                    <Plus size={20} /> Novo
                                </button>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {users.map(user => (
                                    <div key={user.username} style={{
                                        padding: '16px',
                                        background: 'var(--color-surface)',
                                        borderRadius: '16px',
                                        border: '1px solid var(--color-border)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={{
                                                width: '44px',
                                                height: '44px',
                                                borderRadius: '12px',
                                                background: user.role === 'admin' ? 'linear-gradient(135deg, #5e5ce6 0%, #007aff 100%)' : 'rgba(255,255,255,0.05)',
                                                color: 'white',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                                <User size={20} />
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: '800' }}>{user.name}</div>
                                                <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                                                    @{user.username} • {user.role === 'admin' ? 'Administrador' : 'Operador'}
                                                </div>
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button className="icon-btn" onClick={() => handleReset(user.username)} title="Mudar Senha" style={{ borderRadius: '10px', height: '36px', width: '36px' }}>
                                                <KeyRound size={16} />
                                            </button>
                                            {user.username !== 'admin' && user.username !== currentUser?.username && (
                                                <button className="icon-btn" onClick={() => handleDelete(user.username)} title="Excluir" style={{ background: 'rgba(255,59,48,0.1)', color: '#ff453a', border: 'none', borderRadius: '10px', height: '36px', width: '36px' }}>
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {showNewUserForm && (
                    <div className="modal-overlay">
                        <div className="card animate-fade-in" style={{ width: '90%', maxWidth: '400px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                <h3 style={{ margin: 0 }}>Novo Usuário</h3>
                                <button onClick={() => setShowNewUserForm(false)} style={{ background: 'none', border: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer' }}><Plus size={24} style={{ transform: 'rotate(45deg)' }} /></button>
                            </div>
                            <form onSubmit={handleCreateUser} style={{ display: 'grid', gap: '16px' }}>
                                <div className="form-group">
                                    <label className="form-label">Nome Completo</label>
                                    <input className="form-input" value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })} required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Login</label>
                                    <input className="form-input" value={newUser.username} onChange={e => setNewUser({ ...newUser, username: e.target.value.toLowerCase().trim() })} required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Senha</label>
                                    <input type="password" className="form-input" value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Tipo de Conta</label>
                                    <select className="form-input" value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })}>
                                        <option value="user">Operador (Acesso Limitado)</option>
                                        <option value="admin">Administrador (Acesso Total)</option>
                                    </select>
                                </div>
                                <button type="submit" className="btn btn-primary" style={{ marginTop: '12px', height: '54px' }}>Criar Usuário</button>
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

export default Configuracoes;
