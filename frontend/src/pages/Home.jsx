import React, { useState, useMemo, useRef } from 'react';
import { Users, Wallet, Calendar, DollarSign, LogOut, ShieldCheck, AlertCircle, Clock, CheckCircle, Package, Printer, Share2, FileText, Settings, Plus } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BrandedIcon from '../components/BrandedIcon';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

function Home({ pedidos, clientes, onNovoPedido, onNavigateToClientes, onNavigateToFinanceiro, onLogout, currentUser, onNavigateToSeguranca, onEditPedido, onQuickPay, onWithdraw, backendHealth, theme, settings, onToggleTheme, onNavigateToSuporte, onNavigateToPrivacidade, onNavigateToTermos }) {
    const [filterStatus, setFilterStatus] = useState('A_PAGAR');
    const [paymentModal, setPaymentModal] = useState(null); // { pedidoId: id }
    const [deliveryConfirm, setDeliveryConfirm] = useState(false);
    const receiptRef = useRef(null);
    const [activeReceipt, setActiveReceipt] = useState(null);

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2
        }).format(value);
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return '-';
        return new Date(timestamp).toLocaleDateString('pt-BR');
    };

    const stats = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const summary = {
            today: 0,
            tomorrow: 0,
            overdue: 0,
            totalToReceive: 0
        };

        pedidos.forEach(p => {
            const entrega = new Date(p.dataEntrega);
            entrega.setHours(0, 0, 0, 0);

            if (p.statusPagamento !== 'PAGO') {
                summary.totalToReceive += (p.valorTotal - (p.valorPago || 0));
            }

            if (p.statusServico !== 'RETIRADO') {
                if (entrega.getTime() === today.getTime()) {
                    summary.today++;
                } else if (entrega < today) {
                    summary.overdue++;
                }
            }
        });

        return summary;
    }, [pedidos]);

    const getStatusServicoInfo = (status) => {
        switch (status) {
            case 'EM_ANDAMENTO': return { label: 'Iniciado', color: 'var(--color-status-progress)', icon: <Clock size={16} /> };
            case 'PROVA': return { label: 'Retorno', color: 'var(--color-status-fitting)', icon: <CheckCircle size={16} /> };
            case 'PRONTO': return { label: 'Pronto', color: 'var(--color-status-ready)', icon: <Package size={16} /> };
            case 'RETIRADO': return { label: 'Entregue', color: 'var(--color-status-pickup)', icon: <CheckCircle size={16} /> };
            default: return { label: 'Iniciado', color: 'var(--color-status-progress)', icon: <Clock size={16} /> };
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

    const getCliente = (clienteId) => clientes.find(c => c.id === clienteId);

    const generatePDF = async (pedido, shareOnWhatsApp = false) => {
        const cliente = getCliente(pedido.clienteId);
        const fileName = `Comprovante - ${cliente?.nome || 'Cliente'} - ${pedido.descricao.substring(0, 20)} - ${pedido.id}.pdf`;

        // Temporarily show receipt off-screen to capture it
        setActiveReceipt(pedido);

        // Wait for state to update and DOM to render
        setTimeout(async () => {
            const element = document.getElementById('printable-receipt');
            if (!element) return;

            const canvas = await html2canvas(element, {
                scale: 2,
                logging: false,
                useCORS: true,
                backgroundColor: '#ffffff'
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

            if (shareOnWhatsApp) {
                pdf.save(fileName);
                const msg = `🧾 *COMPROVANTE DE PEDIDO*%0A%0AOlá *${cliente?.nome}*, o seu pedido #${pedido.id} foi marcado como *PAGO*.%0A%0A*Resumo:* ${pedido.descricao}%0A*Total:* ${formatCurrency(pedido.valorTotal)}%0A%0A_O PDF foi baixado automaticamente. Por favor, anexe-o aqui para o seu registro._`;
                window.open(`https://wa.me/55${cliente?.telefone.replace(/\D/g, '')}?text=${msg}`, '_blank');
            } else {
                pdf.save(fileName);
            }

            setActiveReceipt(null);
        }, 500);
    };

    const filteredPedidos = pedidos.filter(pedido => {
        if (filterStatus === 'TODOS') return true;
        return pedido.statusPagamento === filterStatus;
    });

    return (
        <div className="home-page">
            <Header
                title="CosturaCerta"
                theme={theme}
                settings={settings}
                onToggleTheme={onToggleTheme}
                backendHealth={backendHealth}
                rightActions={
                    <div className="header-actions-group">
                        <button className="icon-btn" onClick={onNavigateToClientes} title="Clientes"><Users size={22} /></button>
                        <button className="icon-btn" onClick={onNavigateToFinanceiro} title="Financeiro"><Wallet size={22} /></button>
                        {currentUser?.role === 'admin' && (
                            <button className="icon-btn" onClick={onNavigateToSeguranca} title="Configurações"><Settings size={22} /></button>
                        )}
                        <button className="icon-btn logout-btn" onClick={onLogout} title="Sair"><LogOut size={22} /></button>
                    </div>
                }
            />

            <main className="container" style={{ paddingBottom: '120px', paddingTop: '24px', flex: 1 }}>

                {/* Stats */}
                <section className="stats-grid" style={{ marginBottom: '32px', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
                    <div className="stat-card animate-fade-in" style={{
                        padding: '24px',
                        background: stats.overdue > 0 ? 'rgba(255, 69, 58, 0.1)' : 'var(--color-surface)',
                        border: stats.overdue > 0 ? '1px solid rgba(255, 69, 58, 0.2)' : '1px solid var(--color-border)',
                        borderRadius: '24px',
                        animationDelay: '100ms'
                    }}>
                        <div style={{ color: stats.overdue > 0 ? '#ff453a' : '#8e8e93', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Atrasados</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ fontSize: '32px', fontWeight: 900, color: stats.overdue > 0 ? '#ff453a' : 'var(--color-text-primary)' }}>{stats.overdue}</div>
                            {stats.overdue > 0 && <AlertCircle size={24} color="#ff453a" className="animate-pulse" />}
                        </div>
                    </div>

                    <div className="stat-card animate-fade-in" style={{
                        padding: '24px',
                        background: 'rgba(94, 92, 230, 0.05)',
                        border: '1px solid rgba(94, 92, 230, 0.1)',
                        borderRadius: '24px',
                        animationDelay: '200ms'
                    }}>
                        <div style={{ color: 'var(--color-primary)', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Para Hoje</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ fontSize: '32px', fontWeight: 900, color: 'var(--color-primary)' }}>{stats.today}</div>
                            <Clock size={24} color="var(--color-primary)" />
                        </div>
                    </div>

                    <div className="stat-card animate-fade-in" style={{
                        padding: '24px',
                        background: 'rgba(52, 199, 89, 0.05)',
                        border: '1px solid rgba(52, 199, 89, 0.1)',
                        borderRadius: '24px',
                        animationDelay: '300ms'
                    }}>
                        <div style={{ color: '#34c759', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>A Receber</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ fontSize: '24px', fontWeight: 900, color: '#34c759' }}>{formatCurrency(stats.totalToReceive)}</div>
                            <Wallet size={24} color="#34c759" />
                        </div>
                    </div>
                </section>

                {/* Filters */}
                <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '16px', marginBottom: '8px' }}>
                    <button className={`btn-filter ${filterStatus === 'TODOS' ? 'active' : ''}`} onClick={() => setFilterStatus('TODOS')}>Todos</button>
                    <button className={`btn-filter danger ${filterStatus === 'A_PAGAR' ? 'active' : ''}`} onClick={() => setFilterStatus('A_PAGAR')}>A Pagar</button>
                    <button className={`btn-filter warning ${filterStatus === 'PARCIAL' ? 'active' : ''}`} onClick={() => setFilterStatus('PARCIAL')}>Parcial</button>
                    <button className={`btn-filter success ${filterStatus === 'PAGO' ? 'active' : ''}`} onClick={() => setFilterStatus('PAGO')}>Pagos</button>
                </div>

                {filteredPedidos.length === 0 ? (
                    <div className="empty-state animate-fade-in" style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '80px 20px',
                        background: 'rgba(255, 255, 255, 0.02)',
                        borderRadius: '32px',
                        border: '1px dashed var(--color-border)',
                        marginTop: '20px'
                    }}>
                        <div style={{
                            width: '120px',
                            height: '120px',
                            borderRadius: '60px',
                            background: 'var(--color-surface)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '24px'
                        }}>
                            <BrandedIcon
                                size={48}
                                settings={settings}
                                style={{
                                    opacity: settings.system_logo ? 0.4 : 0.2,
                                    color: 'var(--color-primary)',
                                    filter: settings.system_logo ? 'grayscale(1) brightness(1.5)' : 'none'
                                }}
                            />
                        </div>
                        <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '8px', color: 'var(--color-text-primary)' }}>Tudo pronto!</h2>
                        <p style={{ fontSize: '15px', color: 'var(--color-text-secondary)', textAlign: 'center', maxWidth: '300px' }}>
                            {filterStatus === 'TODOS' ? 'Não há nenhum pedido registrado no momento.' :
                                filterStatus === 'A_PAGAR' ? 'Não há pedidos pendentes de pagamento. Parabéns!' :
                                    filterStatus === 'PAGO' ? 'Ainda não existem pedidos marcados como pagos.' :
                                        'Nenhum pedido encontrado para este filtro.'}
                        </p>
                        <button className="btn btn-primary" style={{ marginTop: '24px', padding: '12px 32px' }} onClick={onNovoPedido}>
                            <Plus size={20} /> Criar Novo Pedido
                        </button>
                    </div>
                ) : (
                    <div className="pedidos-list">
                        {filteredPedidos.map((pedido, index) => {
                            const cliente = getCliente(pedido.clienteId);
                            const statusServ = getStatusServicoInfo(pedido.statusServico);

                            return (
                                <div key={pedido.id} className="pedido-card-new" onClick={() => onEditPedido(pedido)}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                        <h3 style={{ fontSize: '18px', fontWeight: '800' }}>{cliente?.nome || 'Cliente'}</h3>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: statusServ.color, background: `${statusServ.color}15`, padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '800' }}>
                                            {statusServ.icon} {statusServ.label}
                                        </div>
                                    </div>

                                    <p style={{ fontSize: '14px', marginBottom: '12px', color: 'var(--color-text-secondary)' }}>{pedido.descricao}</p>

                                    <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '16px', marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                        <div>
                                            <div style={{ fontSize: '11px', color: 'var(--color-text-tertiary)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total do Pedido</div>
                                            <div style={{ fontSize: '22px', fontWeight: '900', color: 'var(--color-text-primary)' }}>{formatCurrency(pedido.valorTotal)}</div>
                                            {pedido.valorTotal - (pedido.valorPago || 0) > 0 && (
                                                <div style={{ fontSize: '12px', color: '#ff453a', fontWeight: '700', marginTop: '2px' }}>
                                                    Pendente: {formatCurrency(pedido.valorTotal - (pedido.valorPago || 0))}
                                                </div>
                                            )}
                                        </div>

                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button
                                                className={`icon-btn-sm ${pedido.statusPagamento !== 'PAGO' ? 'disabled' : ''}`}
                                                onClick={(e) => { e.stopPropagation(); if (pedido.statusPagamento === 'PAGO') generatePDF(pedido); }}
                                                title={pedido.statusPagamento === 'PAGO' ? "Baixar PDF" : "Disponível apenas após o pagamento"}
                                                style={{
                                                    opacity: pedido.statusPagamento === 'PAGO' ? 1 : 0.3,
                                                    cursor: pedido.statusPagamento === 'PAGO' ? 'pointer' : 'not-allowed',
                                                    background: 'var(--color-surface)',
                                                    border: '1px solid var(--color-border)'
                                                }}
                                            >
                                                <Printer size={18} />
                                            </button>
                                            <button
                                                className={`icon-btn-sm success ${pedido.statusPagamento !== 'PAGO' ? 'disabled' : ''}`}
                                                onClick={(e) => { e.stopPropagation(); if (pedido.statusPagamento === 'PAGO') generatePDF(pedido, true); }}
                                                title={pedido.statusPagamento === 'PAGO' ? "Compartilhar WhatsApp" : "Disponível apenas após o pagamento"}
                                                style={{
                                                    opacity: pedido.statusPagamento === 'PAGO' ? 1 : 0.3,
                                                    cursor: pedido.statusPagamento === 'PAGO' ? 'pointer' : 'not-allowed',
                                                    background: 'rgba(37, 211, 102, 0.1)',
                                                    border: '1px solid rgba(37, 211, 102, 0.2)'
                                                }}
                                            >
                                                <Share2 size={18} />
                                            </button>
                                        </div>
                                    </div>

                                    {pedido.statusPagamento !== 'PAGO' && (
                                        <button className="btn-pay-now" onClick={(e) => { e.stopPropagation(); setPaymentModal(pedido); }}>
                                            <DollarSign size={16} /> Marcar como Pago
                                        </button>
                                    )}

                                    {pedido.statusServico === 'PRONTO' && (
                                        <button className="btn-withdraw-now" onClick={(e) => { e.stopPropagation(); if (window.confirm('Confirmar entrega?')) onWithdraw(pedido.id); }}>
                                            <Package size={16} /> Marcar como Entregue
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>

            {/* Hidden component for PDF capture */}
            {activeReceipt && (
                <div style={{ position: 'absolute', left: '-9999px', top: '0' }}>
                    <div id="printable-receipt" style={{ width: '210mm', padding: '20mm', background: '#fff', color: '#000', fontFamily: 'sans-serif' }}>
                        <div style={{ textAlign: 'center', borderBottom: '4px solid #5e5ce6', paddingBottom: '10px', marginBottom: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            {settings.system_logo && (
                                <img src={settings.system_logo} alt="Logo" style={{ maxHeight: '80px', marginBottom: '15px' }} />
                            )}
                            <h1 style={{ margin: '0', fontSize: '32px', color: '#5e5ce6', textTransform: 'uppercase' }}>{settings.receipt_name || 'COSTURACERTA'}</h1>
                            <p style={{ margin: '5px 0', fontSize: '16px', fontWeight: 'bold' }}>{settings.receipt_tagline || 'Comprovante de Serviço Profissional'}</p>
                            <div style={{ fontSize: '13px', color: '#666', marginTop: '5px' }}>
                                {settings.receipt_phone && <span>{settings.receipt_phone}</span>}
                                {settings.receipt_address && <span> • {settings.receipt_address}</span>}
                                {settings.receipt_cnpj && <span> • CNPJ: {settings.receipt_cnpj}</span>}
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
                            <div>
                                <h4 style={{ margin: '0 0 5px 0', fontSize: '12px', color: '#666' }}>CLIENTE</h4>
                                <p style={{ margin: '0', fontSize: '18px', fontWeight: 'bold' }}>{getCliente(activeReceipt.clienteId)?.nome}</p>
                                <p style={{ margin: '2px 0', fontSize: '14px' }}>WhatsApp: {getCliente(activeReceipt.clienteId)?.telefone}</p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <h4 style={{ margin: '0 0 5px 0', fontSize: '12px', color: '#666' }}>PEDIDO</h4>
                                <p style={{ margin: '0', fontSize: '18px', fontWeight: 'bold' }}>#{activeReceipt.id}</p>
                                <p style={{ margin: '2px 0', fontSize: '14px' }}>Data: {formatDate(activeReceipt.dataCriacao)}</p>
                            </div>
                        </div>

                        <div style={{ marginBottom: '30px' }}>
                            <h4 style={{ borderBottom: '2px solid #eee', paddingBottom: '5px', marginBottom: '15px' }}>DESCRIÇÃO DOS SERVIÇOS</h4>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ textAlign: 'left', background: '#f9f9f9' }}>
                                        <th style={{ padding: '10px', borderBottom: '1px solid #eee' }}>Item</th>
                                        <th style={{ padding: '10px', borderBottom: '1px solid #eee', textAlign: 'right' }}>Valor</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {activeReceipt.itens.map((item, i) => (
                                        <tr key={i}>
                                            <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>{item.descricao}</td>
                                            <td style={{ padding: '10px', borderBottom: '1px solid #eee', textAlign: 'right' }}>{formatCurrency(item.preco)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '40px' }}>
                            <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px' }}>
                                <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#5e5ce6', borderBottom: '1px solid #ddd', paddingBottom: '5px' }}>DADOS DO PAGAMENTO</h4>
                                <p style={{ margin: '5px 0', fontSize: '14px' }}><strong>Forma de Pagamento:</strong> {activeReceipt.forma_pagamento || activeReceipt.formaPagamento || '-'}</p>
                                <p style={{ margin: '5px 0', fontSize: '14px' }}><strong>Status:</strong> {getStatusText(activeReceipt.statusPagamento)}</p>
                                <p style={{ margin: '5px 0', fontSize: '14px' }}><strong>Data do Pagamento:</strong> {activeReceipt.statusPagamento === 'PAGO' ? formatDate(activeReceipt.dataEntrega || new Date()) : '-'}</p>
                            </div>
                            <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                <div style={{ fontSize: '16px', marginBottom: '5px' }}>
                                    Total do Serviço: <span style={{ fontWeight: 'bold' }}>{formatCurrency(activeReceipt.valorTotal)}</span>
                                </div>
                                <div style={{ fontSize: '16px', color: '#34c759' }}>
                                    Valor Pago: <span style={{ fontWeight: 'bold' }}>{formatCurrency(activeReceipt.valorPago || 0)}</span>
                                </div>
                                <div style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '10px', borderTop: '2px solid #5e5ce6', paddingTop: '10px', color: '#5e5ce6' }}>
                                    SALDO: {formatCurrency(Math.max(0, activeReceipt.valorTotal - (activeReceipt.valorPago || 0)))}
                                </div>
                            </div>
                        </div>

                        <div style={{ marginTop: '50px', paddingTop: '20px', borderTop: '1px solid #eee', textAlign: 'center', fontSize: '12px', color: '#888' }}>
                            <p>Este documento é um comprovante de entrega de serviços.</p>
                            <p>CosturaCerta - Sistemas de Gestão Profissional</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Payment Confirmation Modal */}
            {paymentModal && (
                <div className="modal-overlay" style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    padding: '20px'
                }}>
                    <div className="card animate-slide-in" style={{ maxWidth: '400px', width: '100%', padding: '24px' }}>
                        {!deliveryConfirm ? (
                            <>
                                <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '16px', textAlign: 'center' }}>Confirmação de Entrega</h2>
                                <p style={{ textAlign: 'center', marginBottom: '24px', color: 'var(--color-text-secondary)' }}>O produto já foi entregue ao cliente?</p>
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <button
                                        className="btn btn-primary"
                                        style={{ flex: 1, padding: '12px' }}
                                        onClick={() => setDeliveryConfirm(true)}
                                    >
                                        SIM
                                    </button>
                                    <button
                                        className="btn"
                                        style={{ flex: 1, padding: '12px', background: 'var(--color-surface-solid)', color: 'var(--color-text-primary)' }}
                                        onClick={() => {
                                            if (window.confirm('Confirmar recebimento do pagamento?')) {
                                                onQuickPay(paymentModal.id);
                                                setPaymentModal(null);
                                            }
                                        }}
                                    >
                                        NÃO
                                    </button>
                                </div>
                                <button
                                    onClick={() => setPaymentModal(null)}
                                    style={{ width: '100%', marginTop: '12px', background: 'transparent', border: 'none', color: 'var(--color-text-tertiary)', fontSize: '13px' }}
                                >
                                    Cancelar
                                </button>
                            </>
                        ) : (
                            <>
                                <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '16px', textAlign: 'center', color: 'var(--color-success)' }}>Confirmar Pagamento</h2>
                                <p style={{ textAlign: 'center', marginBottom: '24px', color: 'var(--color-text-secondary)' }}>Status será alterado para <strong style={{ color: 'var(--color-text-primary)' }}>ENTREGUE</strong> e <strong style={{ color: 'var(--color-success)' }}>PAGO</strong>. Confirmar?</p>
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <button
                                        className="btn btn-success"
                                        style={{ flex: 1, padding: '12px' }}
                                        onClick={async () => {
                                            // 1. Mark as delivered
                                            await onWithdraw(paymentModal.id);
                                            // 2. Mark as paid
                                            await onQuickPay(paymentModal.id);
                                            setPaymentModal(null);
                                            setDeliveryConfirm(false);
                                        }}
                                    >
                                        Confirmar Recebimento
                                    </button>
                                    <button
                                        className="btn"
                                        style={{ flex: 1, padding: '12px', background: 'transparent', color: 'var(--color-text-secondary)' }}
                                        onClick={() => {
                                            setDeliveryConfirm(false);
                                            setPaymentModal(null);
                                        }}
                                    >
                                        Voltar
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            <button className="fab" onClick={onNovoPedido}>
                <span style={{ fontSize: '32px', fontWeight: 'bold' }}>+</span>
            </button>
            <Footer onNavigate={(type) => {
                if (type === 'suporte') onNavigateToSuporte();
                if (type === 'privacidade') onNavigateToPrivacidade();
                if (type === 'termos') onNavigateToTermos();
            }} />
        </div>
    );
}

export default Home;
