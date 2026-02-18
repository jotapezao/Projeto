import React from 'react';
import { User, Bell, Shield, Eye, EyeOff, LogOut } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

const Profile = () => {
    const { hideValues, setHideValues, notifications, setNotifications } = useUser();

    return (
        <div className="flex flex-col gap-md">
            <div className="card flex items-center gap-md">
                <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--bg-input)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <User size={32} color="var(--color-primary)" />
                </div>
                <div>
                    <h3>Investidor Iniciante</h3>
                    <p style={{ fontSize: '0.875rem' }}>investidor@email.com</p>
                </div>
            </div>

            <div className="card">
                <h3 style={{ marginBottom: 'var(--space-md)' }}>Configurações</h3>

                <div className="flex flex-col gap-md">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-sm">
                            <Eye size={20} />
                            <span>Modo Discreto (Ocultar Valores)</span>
                        </div>
                        <button
                            onClick={() => setHideValues(!hideValues)}
                            className={`btn ${hideValues ? 'btn-primary' : 'btn-outline'}`}
                            style={{ padding: '4px 12px' }}
                        >
                            {hideValues ? 'Ativado' : 'Desativado'}
                        </button>
                    </div>

                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-sm">
                            <Bell size={20} />
                            <span>Notificações de Preço</span>
                        </div>
                        <button
                            onClick={() => setNotifications(!notifications)}
                            className={`btn ${notifications ? 'btn-primary' : 'btn-outline'}`}
                            style={{ padding: '4px 12px' }}
                        >
                            {notifications ? 'Ativado' : 'Desativado'}
                        </button>
                    </div>

                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-sm">
                            <Shield size={20} />
                            <span>Segurança (2FA)</span>
                        </div>
                        <span style={{ fontSize: '0.875rem', color: 'var(--color-success)' }}>Ativo</span>
                    </div>
                </div>
            </div>

            <div className="card">
                <h3 style={{ marginBottom: 'var(--space-md)' }}>Alertas Configurados</h3>
                <div className="flex flex-col gap-sm">
                    <div className="flex justify-between items-center" style={{ padding: '8px', backgroundColor: 'var(--bg-input)', borderRadius: 'var(--radius-sm)' }}>
                        <span>BTC {'>'} R$ 600.000</span>
                        <button className="btn btn-outline" style={{ padding: '2px 8px', fontSize: '0.75rem', color: 'var(--color-danger)', borderColor: 'var(--color-danger)' }}>Excluir</button>
                    </div>
                    <div className="flex justify-between items-center" style={{ padding: '8px', backgroundColor: 'var(--bg-input)', borderRadius: 'var(--radius-sm)' }}>
                        <span>Variação {'>'} 5% (24h)</span>
                        <button className="btn btn-outline" style={{ padding: '2px 8px', fontSize: '0.75rem', color: 'var(--color-danger)', borderColor: 'var(--color-danger)' }}>Excluir</button>
                    </div>
                </div>
                <button className="btn btn-primary btn-full" style={{ marginTop: 'var(--space-md)' }}>
                    Criar Novo Alerta
                </button>
            </div>

            <button className="btn btn-outline btn-full" style={{ borderColor: 'var(--color-danger)', color: 'var(--color-danger)' }}>
                <LogOut size={16} style={{ marginRight: '8px' }} />
                Sair da Conta
            </button>
        </div>
    );
};

export default Profile;
