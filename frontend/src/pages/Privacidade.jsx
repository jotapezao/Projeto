import React from 'react';
import { ArrowLeft, ShieldCheck, Eye, Lock, FileText, CheckCircle } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

function Privacidade({ onBack, theme, onToggleTheme }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--color-background)' }}>
            <Header
                title="Privacidade"
                theme={theme}
                onToggleTheme={onToggleTheme}
                leftAction={
                    <button className="icon-btn" onClick={onBack} style={{ borderRadius: 'var(--radius-full)' }}>
                        <ArrowLeft size={22} />
                    </button>
                }
            />

            <main className="container animate-fade-in" style={{ padding: '40px 20px', flex: 1, maxWidth: '800px' }}>
                <div style={{
                    background: 'var(--color-surface)',
                    backdropFilter: 'var(--glass-material)',
                    border: 'var(--glass-border)',
                    borderRadius: '28px',
                    padding: '40px',
                    boxShadow: 'var(--shadow-lg)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', color: 'var(--color-primary)' }}>
                        <ShieldCheck size={32} />
                        <h1 style={{ fontSize: '28px', fontWeight: '800', margin: 0 }}>Sua Segurança em Primeiro Lugar</h1>
                    </div>

                    <div style={{ display: 'grid', gap: '32px', color: 'var(--color-text-secondary)', lineHeight: '1.6' }}>
                        <section>
                            <h2 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--color-text-primary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Lock size={20} /> Armazenamento Local
                            </h2>
                            <p>
                                O sistema <strong>CosturaCerta</strong> utiliza o armazenamento local do seu navegador (LocalStorage) para preservar seus dados.
                                Isso significa que suas informações de clientes, pedidos e finanças permanecem no seu dispositivo, garantindo agilidade e privacidade.
                            </p>
                        </section>

                        <section>
                            <h2 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--color-text-primary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Eye size={20} /> Transparência
                            </h2>
                            <p>
                                Não compartilhamos seus dados com terceiros. As fotos enviadas para o sistema são processadas localmente para exibição no seu painel de gestão.
                            </p>
                        </section>

                        <section style={{ background: 'rgba(94, 92, 230, 0.05)', padding: '20px', borderRadius: '16px', borderLeft: '4px solid var(--color-primary)' }}>
                            <h2 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--color-primary)', marginBottom: '8px' }}>Compromisso com você</h2>
                            <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: '10px' }}>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <CheckCircle size={16} color="#30d158" /> Criptografia básica de sessão
                                </li>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <CheckCircle size={16} color="#30d158" /> Acesso restrito por login e senha
                                </li>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <CheckCircle size={16} color="#30d158" /> Controle total sobre a exclusão de dados
                                </li>
                            </ul>
                        </section>
                    </div>

                    <div style={{ marginTop: '40px', paddingTop: '30px', borderTop: '1px solid var(--color-border)' }}>
                        <button
                            className="btn btn-primary"
                            style={{ width: '100%', borderRadius: 'var(--radius-full)', padding: '16px' }}
                            onClick={onBack}
                        >
                            Entendido
                        </button>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default Privacidade;
