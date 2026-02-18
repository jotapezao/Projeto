import React, { useState } from 'react';
import { User, Lock, ArrowRight, ShieldCheck, Sun, Moon } from 'lucide-react';
import BrandedIcon from '../components/BrandedIcon';

function Login({ onLogin, theme, onToggleTheme, settings = {} }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await onLogin({ username, password });
        if (result && !result.success) {
            setError(result.message || 'Usuário ou senha incorretos');
        } else {
            setError('');
        }
    };

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            background: theme === 'dark' ? 'linear-gradient(135deg, #1d1d1f 0%, #2c2c2e 100%)' : 'linear-gradient(135deg, #f4f4f7 0%, #e8e8f0 100%)',
            padding: '24px',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Theme Toggle Floating */}
            <button
                onClick={onToggleTheme}
                style={{
                    position: 'absolute',
                    top: '24px',
                    right: '24px',
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '12px',
                    padding: '10px',
                    color: theme === 'dark' ? 'white' : '#1d1d1f',
                    cursor: 'pointer',
                    zIndex: 10,
                    backdropFilter: 'blur(10px)'
                }}
            >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Decorative Orbs */}
            <div style={{
                position: 'absolute',
                top: '-10%',
                left: '-10%',
                width: '40%',
                height: '40%',
                background: 'radial-gradient(circle, rgba(94, 92, 230, 0.15) 0%, transparent 70%)',
                borderRadius: '50%'
            }}></div>
            <div style={{
                position: 'absolute',
                bottom: '-10%',
                right: '-10%',
                width: '50%',
                height: '50%',
                background: 'radial-gradient(circle, rgba(0, 113, 227, 0.1) 0%, transparent 70%)',
                borderRadius: '50%'
            }}></div>

            <div className="animate-fade-in" style={{
                width: '100%',
                maxWidth: '420px',
                background: theme === 'dark' ? 'rgba(255, 255, 255, 0.03)' : 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(25px)',
                border: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.05)',
                borderRadius: '28px',
                padding: '48px 40px',
                boxShadow: theme === 'dark' ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)' : '0 10px 30px rgba(0, 0, 0, 0.05)',
                zIndex: 1
            }}>
                <div style={{
                    textAlign: 'center',
                    marginBottom: '40px'
                }}>
                    <div style={{
                        width: '100px',
                        height: '100px',
                        background: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '30px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        margin: '0 auto 28px',
                        boxShadow: '0 12px 30px rgba(0, 0, 0, 0.15)',
                        overflow: 'hidden',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}>
                        <BrandedIcon
                            size={60}
                            settings={settings}
                            style={{
                                background: settings.system_logo ? 'transparent' : 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)',
                                borderRadius: '18px'
                            }}
                            fallbackIcon={(props) => <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}><BrandedIcon.defaultFallback {...props} size={32} /></div>}
                        />
                    </div>
                    <h1 style={{
                        fontSize: '32px',
                        fontWeight: '900',
                        color: theme === 'dark' ? 'white' : '#1d1d1f',
                        letterSpacing: '-0.04em',
                        marginBottom: '8px',
                        textTransform: 'uppercase'
                    }}>
                        {settings.receipt_name || 'CosturaCerta'}
                    </h1>
                    <p style={{ color: theme === 'dark' ? 'rgba(255, 255, 255, 0.5)' : '#6e6e73', fontSize: '15px' }}>
                        Acesso Restrito ao Sistema
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '24px' }}>
                        <label style={{ color: theme === 'dark' ? 'rgba(255, 255, 255, 0.8)' : '#1d1d1f', fontSize: '14px', fontWeight: '600', marginBottom: '8px', display: 'block' }}>
                            Usuário
                        </label>
                        <div style={{ position: 'relative' }}>
                            <User size={18} style={{ position: 'absolute', left: '16px', top: '14px', color: theme === 'dark' ? 'rgba(255, 255, 255, 0.3)' : '#86868b' }} />
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                style={{
                                    width: '100%',
                                    background: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : '#ffffff',
                                    border: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #d1d1d6',
                                    borderRadius: '14px',
                                    padding: '14px 16px 14px 48px',
                                    color: theme === 'dark' ? 'white' : '#1d1d1f',
                                    fontSize: '16px',
                                    outline: 'none',
                                    transition: 'all 0.3s'
                                }}
                                placeholder="Seu usuário"
                                onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                                onBlur={(e) => e.target.style.borderColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : '#d1d1d6'}
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: '32px' }}>
                        <label style={{ color: theme === 'dark' ? 'rgba(255, 255, 255, 0.8)' : '#1d1d1f', fontSize: '14px', fontWeight: '600', marginBottom: '8px', display: 'block' }}>
                            Senha
                        </label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '16px', top: '14px', color: theme === 'dark' ? 'rgba(255, 255, 255, 0.3)' : '#86868b' }} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={{
                                    width: '100%',
                                    background: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : '#ffffff',
                                    border: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #d1d1d6',
                                    borderRadius: '14px',
                                    padding: '14px 16px 14px 48px',
                                    color: theme === 'dark' ? 'white' : '#1d1d1f',
                                    fontSize: '16px',
                                    outline: 'none',
                                    transition: 'all 0.3s'
                                }}
                                placeholder="••••••••"
                                onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                                onBlur={(e) => e.target.style.borderColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : '#d1d1d6'}
                            />
                        </div>
                    </div>

                    {error && (
                        <div style={{
                            padding: '12px',
                            background: 'rgba(255, 59, 48, 0.15)',
                            color: '#ff453a',
                            borderRadius: '12px',
                            marginBottom: '24px',
                            textAlign: 'center',
                            fontSize: '14px',
                            fontWeight: '600',
                            border: '1px solid rgba(255, 59, 48, 0.2)'
                        }}>
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{
                            width: '100%',
                            padding: '16px',
                            fontSize: '16px',
                            fontWeight: '700',
                            borderRadius: '14px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px',
                            boxShadow: 'var(--btn-shadow)'
                        }}
                    >
                        Entrar no Sistema <ArrowRight size={20} />
                    </button>

                    <div style={{ marginTop: '32px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: theme === 'dark' ? 'rgba(255, 255, 255, 0.3)' : '#86868b', fontSize: '13px' }}>
                        <ShieldCheck size={16} />
                        Conexão Segura
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;
