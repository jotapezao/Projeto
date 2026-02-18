import React from 'react';
import { ArrowLeft, Phone, Mail, Instagram, ShieldCheck, ExternalLink, Globe, Award } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

function Suporte({ onBack, theme, onToggleTheme }) {
    // Foto do perfil (usando o caminho fornecido ou placeholder se preferir)
    // O ideal é que o usuário coloque esta foto na pasta public/ ou src/assets/
    const profilePic = "https://img.freepik.com/vetores-premium/cone-de-perfil-de-usuario-em-estilo-plano-ilustracao-em-vetor-avatar-membro-em-fundo-isolado-conceito-de-negocio-de-sinal-de-permissao-de-humano_157943-15752.jpg";

    // Tentativa de usar a imagem enviada (assumindo que o dev server a encontre se mapeada ou se o usuário a mover)
    // Por segurança, usaremos o estilo moderno com gradientes se a imagem não carregar.

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--color-background)' }}>
            <Header
                title="Suporte & Sobre"
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
                    boxShadow: 'var(--shadow-lg)',
                    textAlign: 'center'
                }}>
                    {/* Perfil */}
                    <div style={{ position: 'relative', width: '150px', height: '150px', margin: '0 auto 24px', borderRadius: '50%', padding: '4px', background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))' }}>
                        <div style={{ width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden', border: '4px solid var(--color-surface-solid)' }}>
                            <img
                                src="/perfil.png" // Placeholder profissional ou a foto do usuário se disponível
                                alt="João Paulo Fernandes"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                onError={(e) => { e.target.src = profilePic; }}
                            />
                        </div>
                        <div style={{ position: 'absolute', bottom: '5px', right: '5px', background: '#30d158', color: 'white', border: '3px solid var(--color-surface-solid)', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <ShieldCheck size={18} />
                        </div>
                    </div>

                    <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '8px', letterSpacing: '-0.02em' }}>João Paulo Fernandes</h1>
                    <p style={{ color: 'var(--color-primary)', fontWeight: '700', fontSize: '18px', marginBottom: '24px' }}>Especialista em Desenvolvimento de Sistemas</p>

                    <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '40px' }}>
                        <span className="badge badge-info" style={{ borderRadius: 'var(--radius-full)' }}>Desenvolvedor Full Stack</span>
                        <span className="badge badge-success" style={{ borderRadius: 'var(--radius-full)' }}>Suporte Ativo</span>
                    </div>

                    {/* Descrição Sobre */}
                    <div style={{ textAlign: 'left', marginBottom: '40px' }}>
                        <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Globe size={20} color="var(--color-primary)" /> Sobre o sistema
                        </h2>
                        <p style={{ color: 'var(--color-text-secondary)', lineHeight: '1.6', fontSize: '16px' }}>
                            A plataforma <strong>CosturaCerta</strong> foi desenvolvida com o objetivo de modernizar e simplificar a gestão de pequenos e médios negócios de costura.
                            Focada em usabilidade e agilidade, a ferramenta permite o controle total de pedidos, histórico de clientes e saúde financeira, tudo em um ambiente seguro e visualmente profissional.
                        </p>
                    </div>

                    {/* Contatos */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                        <a href="https://wa.me/5565992859585" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                            <div className="stat-card" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', borderRadius: '16px' }}>
                                <div style={{ background: '#25D366', color: 'white', padding: '10px', borderRadius: '12px' }}>
                                    <Phone size={20} />
                                </div>
                                <div style={{ textAlign: 'left' }}>
                                    <div style={{ fontSize: '12px', color: 'var(--color-text-tertiary)' }}>WhatsApp</div>
                                    <div style={{ fontWeight: '700', color: 'var(--color-text-primary)' }}>65 99285-9585</div>
                                </div>
                            </div>
                        </a>

                        <a href="mailto:jpffs@outlook.com" style={{ textDecoration: 'none' }}>
                            <div className="stat-card" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', borderRadius: '16px' }}>
                                <div style={{ background: '#0078d4', color: 'white', padding: '10px', borderRadius: '12px' }}>
                                    <Mail size={20} />
                                </div>
                                <div style={{ textAlign: 'left' }}>
                                    <div style={{ fontSize: '12px', color: 'var(--color-text-tertiary)' }}>Email</div>
                                    <div style={{ fontWeight: '700', color: 'var(--color-text-primary)' }}>jpffs@outlook.com</div>
                                </div>
                            </div>
                        </a>

                        <a href="https://www.instagram.com/jotapffs/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                            <div className="stat-card" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', borderRadius: '16px' }}>
                                <div style={{ background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)', color: 'white', padding: '10px', borderRadius: '12px' }}>
                                    <Instagram size={20} />
                                </div>
                                <div style={{ textAlign: 'left' }}>
                                    <div style={{ fontSize: '12px', color: 'var(--color-text-tertiary)' }}>Instagram</div>
                                    <div style={{ fontWeight: '700', color: 'var(--color-text-primary)' }}>@jotapffs</div>
                                </div>
                            </div>
                        </a>
                    </div>

                    <div style={{ marginTop: '40px', paddingTop: '30px', borderTop: '1px solid var(--color-border)' }}>
                        <button
                            className="btn btn-primary"
                            style={{ width: '100%', borderRadius: 'var(--radius-full)', padding: '16px' }}
                            onClick={onBack}
                        >
                            Voltar ao Sistema
                        </button>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default Suporte;
