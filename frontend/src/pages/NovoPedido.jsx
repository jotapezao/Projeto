import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Plus, X, Camera, Trash2, Calendar, DollarSign, User, MessageCircle, Clock, Package, CheckCircle, Smartphone, Settings } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BrandedIcon from '../components/BrandedIcon';

function NovoPedido({ onSave, onBack, clientes, onAddCliente, pedidoEmEdicao, isEditing, servicos, onAddServico, onDeleteServico, theme, settings, onToggleTheme, onNavigateToSuporte, onNavigateToPrivacidade, onNavigateToTermos }) {
    const defaultPedido = {
        clienteId: '',
        descricao: '',
        itens: [{ descricao: '', preco: '' }],
        dataCriacao: Date.now(),
        dataEntrega: null,
        statusServico: 'EM_ANDAMENTO',
        statusPagamento: 'A_PAGAR',
        valorTotal: 0,
        valorPago: '',
        formaPagamento: 'Dinheiro',
        fotos: []
    };

    const [pedido, setPedido] = useState(pedidoEmEdicao || defaultPedido);
    const [showNovoCliente, setShowNovoCliente] = useState(false);
    const [novoCliente, setNovoCliente] = useState({ nome: '', telefone: '', cpf: '' });
    const [showNovoServico, setShowNovoServico] = useState(false);
    const [novoServ, setNovoServ] = useState({ nome: '', valor: '' });
    const [showServicosManager, setShowServicosManager] = useState(false);

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

    const handleNovoClienteChange = (e) => {
        const { name, value } = e.target;
        let formattedValue = value;
        if (name === 'cpf') formattedValue = formatCPF(value);
        if (name === 'telefone') formattedValue = formatTelefone(value);
        setNovoCliente(prev => ({ ...prev, [name]: formattedValue }));
    };

    useEffect(() => {
        const total = pedido.itens.reduce((sum, item) => sum + (parseFloat(item.preco.toString().replace(',', '.')) || 0), 0);
        let status = 'A_PAGAR';
        const pago = parseFloat(pedido.valorPago.toString().replace(',', '.')) || 0;

        if (pago >= total && total > 0) {
            status = 'PAGO';
        } else if (pago > 0) {
            status = 'PARCIAL';
        }

        setPedido(prev => ({ ...prev, valorTotal: total, statusPagamento: status }));
    }, [pedido.itens, pedido.valorPago]);

    const handleItemChange = (index, field, value) => {
        const novosItens = [...pedido.itens];
        novosItens[index][field] = value;
        setPedido({ ...pedido, itens: novosItens });
    };

    const handleAddClienteRapido = () => {
        if (novoCliente.nome && novoCliente.telefone) {
            onAddCliente(novoCliente).then(clienteCriado => {
                if (clienteCriado) {
                    setPedido(prev => ({ ...prev, clienteId: clienteCriado.id }));
                    setShowNovoCliente(false);
                    setNovoCliente({ nome: '', telefone: '', cpf: '' });
                }
            });
        }
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPedido(prev => ({
                    ...prev,
                    fotos: [...prev.fotos, reader.result]
                }));
            };
            reader.readAsDataURL(file);
        });
    };

    const removeFoto = (index) => {
        const novasFotos = [...pedido.fotos];
        novasFotos.splice(index, 1);
        setPedido({ ...pedido, fotos: novasFotos });
    };

    const handleSave = async () => {
        if (!pedido.clienteId) {
            alert('Por favor, selecione um cliente');
            return;
        }

        // Ensure values are numbers before saving
        const finalPedido = {
            ...pedido,
            valorTotal: parseFloat(pedido.valorTotal),
            valorPago: parseFloat(pedido.valorPago.toString().replace(',', '.')) || 0,
            itens: pedido.itens.map(item => ({
                ...item,
                preco: parseFloat(item.preco.toString().replace(',', '.')) || 0
            }))
        };

        const success = await onSave(finalPedido);
        if (success) {
            onBack();
        }
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2
        }).format(value);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--color-background)' }}>
            <Header
                title={pedidoEmEdicao ? (isEditing ? 'Editar Pedido' : 'Detalhes') : 'Novo Pedido'}
                theme={theme}
                settings={settings}
                onToggleTheme={onToggleTheme}
                leftAction={
                    <button className="icon-btn" onClick={onBack} style={{ borderRadius: 'var(--radius-full)' }}>
                        <ArrowLeft size={22} />
                    </button>
                }
            />

            <main className="container animate-fade-in" style={{ paddingBottom: '140px', paddingTop: '24px', flex: 1 }}>

                {/* GRUPO 1: CLIENTE */}
                <div className="card" style={{ marginBottom: '24px', padding: '0', overflow: 'hidden' }}>
                    <div style={{ background: 'var(--color-primary)', padding: '12px 20px', color: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <User size={18} /> <span style={{ fontWeight: '800', fontSize: '15px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Informações do Cliente</span>
                    </div>

                    <div style={{ padding: '20px' }}>
                        {!showNovoCliente ? (
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <div style={{ flex: 1 }}>
                                    <select
                                        className="form-input"
                                        style={{ background: '#fff', color: '#000', height: '50px', fontSize: '16px' }}
                                        value={pedido.clienteId}
                                        onChange={(e) => setPedido({ ...pedido, clienteId: parseInt(e.target.value) })}
                                        disabled={!isEditing && pedidoEmEdicao}
                                    >
                                        <option value="">Selecione o cliente...</option>
                                        {clientes.map(c => (
                                            <option key={c.id} value={c.id}>{c.nome}</option>
                                        ))}
                                    </select>
                                </div>
                                {(isEditing || !pedidoEmEdicao) && (
                                    <button className="btn btn-primary" onClick={() => setShowNovoCliente(true)} style={{ width: '50px', height: '50px', padding: '0', borderRadius: '12px' }}>
                                        <Plus size={24} />
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div style={{ background: 'rgba(94, 92, 230, 0.05)', padding: '20px', borderRadius: '16px', border: '1px dashed var(--color-primary)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                                    <strong style={{ fontSize: '15px' }}>Cadastro Rápido</strong>
                                    <X size={20} style={{ cursor: 'pointer' }} onClick={() => setShowNovoCliente(false)} />
                                </div>
                                <div style={{ display: 'grid', gap: '12px' }}>
                                    <input className="form-input" name="nome" style={{ background: '#fff', color: '#000' }} placeholder="Nome" value={novoCliente.nome} onChange={handleNovoClienteChange} />
                                    <input className="form-input" name="telefone" style={{ background: '#fff', color: '#000' }} placeholder="WhatsApp (xx) xxxxx-xxxx" type="tel" value={novoCliente.telefone} onChange={handleNovoClienteChange} />
                                    <input className="form-input" name="cpf" style={{ background: '#fff', color: '#000' }} placeholder="CPF (opcional)" type="text" value={novoCliente.cpf} onChange={handleNovoClienteChange} />
                                    <button className="btn btn-primary" onClick={handleAddClienteRapido} style={{ padding: '14px', borderRadius: '12px', fontWeight: '800' }}>Confirmar Cliente</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* GRUPO 2: SERVIÇOS E ITENS */}
                <div className="card" style={{ marginBottom: '24px', padding: '0', overflow: 'hidden' }}>
                    <div style={{ background: 'var(--color-accent)', padding: '12px 20px', color: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <BrandedIcon size={18} settings={settings} style={{ background: settings.system_logo ? 'white' : 'transparent', borderRadius: '4px' }} /> <span style={{ fontWeight: '800', fontSize: '15px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Itens do Pedido</span>
                    </div>

                    <div style={{ padding: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <label className="form-label" style={{ fontWeight: '700', marginBottom: '0' }}>Adicionar do Catálogo</label>
                            <button
                                className="btn-sm"
                                style={{
                                    fontSize: '12px',
                                    color: 'white',
                                    background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)',
                                    border: 'none',
                                    fontWeight: '800',
                                    padding: '8px 16px',
                                    borderRadius: '12px',
                                    boxShadow: '0 4px 12px rgba(94, 92, 230, 0.4)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    textTransform: 'uppercase'
                                }}
                                onClick={() => setShowServicosManager(true)}
                            >
                                <Settings size={14} /> Gerenciar catálogo
                            </button>
                        </div>

                        {showServicosManager && (
                            <div style={{ background: 'rgba(0,0,0,0.03)', padding: '12px', borderRadius: '12px', marginBottom: '12px', display: 'grid', gap: '8px' }}>
                                {servicos.map(s => (
                                    <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', padding: '8px 12px', borderRadius: '8px', border: '1px solid #eee' }}>
                                        <span style={{ fontSize: '14px', fontWeight: '600' }}>{s.nome} - {formatCurrency(s.valor)}</span>
                                        <button
                                            onClick={() => {
                                                if (window.confirm(`Excluir o serviço "${s.nome}" permanentemente?`)) {
                                                    onDeleteServico(s.id);
                                                }
                                            }}
                                            style={{ background: 'none', border: 'none', color: '#ff453a', padding: '4px' }}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                                <div style={{ padding: '8px', borderTop: '1px solid #eee', marginTop: '4px' }}>
                                    {!showNovoServico ? (
                                        <button className="btn btn-outline" style={{ width: '100%', fontSize: '13px', padding: '8px' }} onClick={() => setShowNovoServico(true)}>
                                            <Plus size={14} /> Novo Serviço no Catálogo
                                        </button>
                                    ) : (
                                        <div style={{ display: 'grid', gap: '8px' }}>
                                            <input className="form-input" style={{ fontSize: '14px', height: '36px' }} placeholder="Nome do Serviço" value={novoServ.nome} onChange={e => setNovoServ({ ...novoServ, nome: e.target.value })} />
                                            <input className="form-input" style={{ fontSize: '14px', height: '36px' }} placeholder="Valor (Ex: 25,00)" value={novoServ.valor} onChange={e => setNovoServ({ ...novoServ, valor: e.target.value })} />
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <button className="btn btn-primary" style={{ flex: 1, height: '36px', fontSize: '13px' }} onClick={() => {
                                                    if (novoServ.nome && novoServ.valor) {
                                                        onAddServico({ nome: novoServ.nome, valor: parseFloat(novoServ.valor.replace(',', '.')) });
                                                        setNovoServ({ nome: '', valor: '' });
                                                        setShowNovoServico(false);
                                                    }
                                                }}>Adicionar</button>
                                                <button className="btn btn-outline" style={{ height: '36px', fontSize: '13px' }} onClick={() => setShowNovoServico(false)}>Cancelar</button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        <select
                            className="form-input"
                            style={{ background: '#fff', color: '#000' }}
                            defaultValue=""
                            onChange={(e) => {
                                const serv = servicos.find(s => s.id.toString() === e.target.value);
                                if (serv) {
                                    const novosItens = [...pedido.itens];
                                    if (novosItens.length === 1 && !novosItens[0].descricao && !novosItens[0].preco) {
                                        novosItens[0] = { descricao: serv.nome, preco: serv.valor.toString().replace('.', ',') };
                                    } else {
                                        novosItens.push({ descricao: serv.nome, preco: serv.valor.toString().replace('.', ',') });
                                    }
                                    setPedido({ ...pedido, itens: novosItens });
                                }
                                e.target.value = "";
                            }}
                            disabled={!isEditing && pedidoEmEdicao}
                        >
                            <option value="" disabled>Escolha um serviço pronto...</option>
                            {servicos.map(s => (
                                <option key={s.id} value={s.id}>{s.nome} - {formatCurrency(s.valor)}</option>
                            ))}
                        </select>

                        <div style={{ display: 'grid', gap: '12px' }}>
                            {pedido.itens.map((item, index) => (
                                <div key={index} style={{ display: 'flex', gap: '10px', background: 'rgba(0,0,0,0.02)', padding: '12px', borderRadius: '12px', alignItems: 'center' }}>
                                    <input
                                        className="form-input"
                                        style={{ flex: 3, background: '#fff', color: '#000', border: '1px solid #ddd' }}
                                        placeholder="O que será feito?"
                                        value={item.descricao}
                                        onChange={(e) => handleItemChange(index, 'descricao', e.target.value)}
                                        disabled={!isEditing && pedidoEmEdicao}
                                    />
                                    <div style={{ position: 'relative', flex: 1.5 }}>
                                        <span style={{ position: 'absolute', left: '10px', top: '12px', fontSize: '14px', fontWeight: '800', color: 'var(--color-primary)' }}>R$</span>
                                        <input
                                            className="form-input"
                                            style={{ paddingLeft: '32px', background: '#fff', color: '#000', fontWeight: '800', border: '1px solid #ddd' }}
                                            placeholder="0,00"
                                            value={item.preco}
                                            onChange={(e) => handleItemChange(index, 'preco', e.target.value)}
                                            disabled={!isEditing && pedidoEmEdicao}
                                        />
                                    </div>
                                    {(isEditing || !pedidoEmEdicao) && pedido.itens.length > 1 && (
                                        <button onClick={() => setPedido({ ...pedido, itens: pedido.itens.filter((_, i) => i !== index) })} className="icon-btn" style={{ background: 'rgba(255,59,48,0.1)', color: '#ff453a' }}>
                                            <Trash2 size={18} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>

                        {(isEditing || !pedidoEmEdicao) && (
                            <button
                                className="btn btn-outline"
                                style={{ width: '100%', marginTop: '16px', borderRadius: '12px', borderStyle: 'dashed', fontWeight: '700' }}
                                onClick={() => setPedido({ ...pedido, itens: [...pedido.itens, { descricao: '', preco: '' }] })}
                            >
                                <Plus size={18} /> Adicionar outro item
                            </button>
                        )}
                    </div>
                </div>

                {/* GRUPO 3: STATUS E PRAZO */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                    <div className="card" style={{ padding: '20px' }}>
                        <label className="form-label" style={{ fontWeight: '700' }}><Clock size={16} /> Status</label>
                        <select
                            className="form-input"
                            style={{ background: '#fff', color: '#000' }}
                            value={pedido.statusServico}
                            onChange={(e) => setPedido({ ...pedido, statusServico: e.target.value })}
                            disabled={!isEditing && pedidoEmEdicao}
                        >
                            <option value="EM_ANDAMENTO">Iniciado</option>
                            <option value="PROVA">Retorno</option>
                            <option value="PRONTO">Pronto</option>
                            <option value="RETIRADO">Entregue</option>
                        </select>
                    </div>
                    <div className="card" style={{ padding: '20px' }}>
                        <label className="form-label" style={{ fontWeight: '700' }}><Calendar size={16} /> Entrega</label>
                        <input
                            type="date"
                            className="form-input"
                            style={{ background: '#fff', color: '#000' }}
                            value={pedido.dataEntrega || ''}
                            onChange={(e) => setPedido({ ...pedido, dataEntrega: e.target.value || null })}
                            disabled={!isEditing && pedidoEmEdicao}
                        />
                    </div>
                </div>

                {/* GRUPO 4: PAGAMENTO */}
                <div className="card" style={{ marginBottom: '24px', padding: '0', overflow: 'hidden' }}>
                    <div style={{ background: '#34c759', padding: '12px 20px', color: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <DollarSign size={18} /> <span style={{ fontWeight: '800', fontSize: '15px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Financeiro</span>
                    </div>

                    <div style={{ padding: '20px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                            <div>
                                <label className="form-label" style={{ fontSize: '12px', color: '#666' }}>Forma de Pagto</label>
                                <select className="form-input" style={{ background: '#fff', color: '#000' }} value={pedido.formaPagamento} onChange={(e) => setPedido({ ...pedido, formaPagamento: e.target.value })} disabled={!isEditing && pedidoEmEdicao}>
                                    <option>Dinheiro</option>
                                    <option>Pix</option>
                                    <option>Cartão</option>
                                    <option>Outro</option>
                                </select>
                            </div>
                            <div>
                                <label className="form-label" style={{ fontSize: '12px', color: '#666' }}>Já Pago (Sinal)</label>
                                <div style={{ position: 'relative' }}>
                                    <span style={{ position: 'absolute', left: '10px', top: '12px', fontSize: '14px', fontWeight: '800', color: '#34c759' }}>R$</span>
                                    <input type="text" className="form-input" style={{ paddingLeft: '32px', background: '#fff', color: '#000', fontWeight: '800' }} placeholder="0,00" value={pedido.valorPago} onChange={(e) => setPedido({ ...pedido, valorPago: e.target.value })} disabled={!isEditing && pedidoEmEdicao} />
                                </div>
                            </div>
                        </div>

                        <div style={{ background: 'rgba(52, 199, 89, 0.1)', padding: '20px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <span style={{ display: 'block', fontSize: '13px', color: '#1d1d1f', fontWeight: '600' }}>TOTAL:</span>
                                <strong style={{ fontSize: '24px', color: '#1d1d1f' }}>{formatCurrency(pedido.valorTotal)}</strong>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <span style={{ display: 'block', fontSize: '13px', color: (pedido.valorTotal - (parseFloat(pedido.valorPago.toString().replace(',', '.')) || 0)) > 0 ? '#ff3b30' : '#34c759', fontWeight: '600' }}>RESTANTE:</span>
                                <strong style={{ fontSize: '24px', color: (pedido.valorTotal - (parseFloat(pedido.valorPago.toString().replace(',', '.')) || 0)) > 0 ? '#ff3b30' : '#34c759' }}>
                                    {formatCurrency(Math.max(0, pedido.valorTotal - (parseFloat(pedido.valorPago.toString().replace(',', '.')) || 0)))}
                                </strong>
                            </div>
                        </div>
                    </div>
                </div>

                {/* GRUPO 5: FOTOS */}
                <div className="card" style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                        <Camera size={18} style={{ color: 'var(--color-primary)' }} /> <span style={{ fontWeight: '700' }}>Fotos das Peças</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                        {pedido.fotos.map((foto, index) => (
                            <div key={index} style={{ position: 'relative', aspectRatio: '1', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                                <img src={foto} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                {(isEditing || !pedidoEmEdicao) && (
                                    <button onClick={() => removeFoto(index)} style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(255,59,48,0.8)', color: 'white', border: 'none', borderRadius: '50%', width: '24px', height: '24px' }}>
                                        <X size={14} />
                                    </button>
                                )}
                            </div>
                        ))}
                        {(isEditing || !pedidoEmEdicao) && (
                            <label style={{ aspectRatio: '1', border: '2px dashed #ccc', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: '#fff', color: '#999' }}>
                                <Camera size={24} />
                                <input type="file" accept="image/*" multiple onChange={handleFileChange} style={{ display: 'none' }} />
                            </label>
                        )}
                    </div>
                </div>

                {/* BOTÃO SALVAR */}
                {(isEditing || !pedidoEmEdicao) && (
                    <div style={{
                        position: 'sticky',
                        bottom: '20px',
                        padding: '20px',
                        background: 'linear-gradient(transparent, var(--color-background) 20%)',
                        zIndex: 10,
                        display: 'flex',
                        justifyContent: 'center'
                    }}>
                        <button
                            className="btn btn-primary"
                            style={{ width: '100%', maxWidth: '500px', padding: '20px', fontSize: '18px', fontWeight: '800', borderRadius: '20px', boxShadow: 'var(--btn-shadow)' }}
                            onClick={handleSave}
                        >
                            <Save size={24} /> {pedidoEmEdicao ? 'Salvar Alterações' : 'Finalizar Pedido'}
                        </button>
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

export default NovoPedido;
