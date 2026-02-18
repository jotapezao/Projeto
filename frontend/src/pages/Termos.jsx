import React from 'react';
import { ArrowLeft, FileText, Scale, UserCheck, AlertCircle } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

function Termos({ onBack, theme, onToggleTheme }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--color-background)' }}>
            <Header
                title="Termos de Uso"
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
                        <Scale size={32} />
                        <h1 style={{ fontSize: '28px', fontWeight: '800', margin: 0 }}>Direitos e Deveres</h1>
                    </div>

                    <div style={{ display: 'grid', gap: '32px', color: 'var(--color-text-secondary)', lineHeight: '1.6' }}>
                        <section>
                            <h2 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--color-text-primary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <UserCheck size={20} /> Uso Concedido
                            </h2>
                            <p>
                                Ao utilizar o sistema <strong>CosturaCerta</strong>, você concorda em fornecer informações verídicas para o bom funcionamento da gestão financeira e de pedidos de seus clientes.
                            </p>
                        </section>

                        <section>
                            <h2 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--color-text-primary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <AlertCircle size={20} /> Responsabilidade
                            </h2>
                            <p>
                                O sistema é uma ferramenta de auxílio à gestão. A responsabilidade pela entrega dos serviços de costura, negociação de valores e atendimento ao cliente é integralmente do proprietário do perfil.
                            </p>
                        </section>

                        <section>
                            <h2 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--color-text-primary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <FileText size={20} /> Atualizações
                            </h2>
                            <p>
                                Reservamo-nos o direito de atualizar as funcionalidades do sistema para melhor atender à comunidade de costura, visando sempre a melhoria da experiência do usuário.
                            </p>
                        </section>
                    </div>

                    <div style={{ marginTop: '40px', paddingTop: '30px', borderTop: '1px solid var(--color-border)' }}>
                        <button
                            className="btn btn-primary"
                            style={{ width: '100%', borderRadius: 'var(--radius-full)', padding: '16px' }}
                            onClick={onBack}
                        >
                            Aceitar Termos
                        </button>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default Termos;
