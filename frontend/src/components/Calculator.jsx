import React, { useState, useEffect } from 'react';
import { ArrowRightLeft, RefreshCw } from 'lucide-react';
import { getBitcoinPrice } from '../services/api';
import { useUser } from '../contexts/UserContext';

const Calculator = () => {
    const { hideValues } = useUser();
    const [priceData, setPriceData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [amount, setAmount] = useState('1');
    const [currency, setCurrency] = useState('brl');
    const [isBtcBase, setIsBtcBase] = useState(true); // true = BTC -> Fiat, false = Fiat -> BTC

    const fetchPrice = async () => {
        setLoading(true);
        try {
            const data = await getBitcoinPrice();
            setPriceData(data);
            setError(null);
        } catch (err) {
            setError('Erro ao atualizar preço');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPrice();
        const interval = setInterval(fetchPrice, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleSwap = () => {
        setIsBtcBase(!isBtcBase);
    };

    const calculate = () => {
        if (!priceData || !amount) return '0.00';
        const rate = priceData[currency];
        const val = parseFloat(amount);
        if (isNaN(val)) return '0.00';

        if (isBtcBase) {
            // BTC -> Fiat
            return (val * rate).toLocaleString('pt-BR', { style: 'currency', currency: currency.toUpperCase() });
        } else {
            // Fiat -> BTC
            return (val / rate).toFixed(8);
        }
    };

    const currentRate = priceData ? priceData[currency] : 0;
    const change24h = priceData ? priceData[`${currency}_24h_change`] : 0;

    return (
        <div className="card">
            <div className="flex justify-between items-center" style={{ marginBottom: 'var(--space-md)' }}>
                <h2>Calculadora</h2>
                <button onClick={fetchPrice} className="btn btn-outline" style={{ padding: '4px 8px' }}>
                    <RefreshCw size={16} className={loading ? 'spin' : ''} />
                </button>
            </div>

            {error && <div style={{ color: 'var(--color-danger)', marginBottom: 'var(--space-sm)' }}>{error}</div>}

            <div className="flex flex-col gap-md">
                {/* Input Section */}
                <div className="flex flex-col gap-sm">
                    <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                        {isBtcBase ? 'Bitcoin (BTC)' : currency.toUpperCase()}
                    </label>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="input"
                        placeholder="0.00"
                    />
                </div>

                {/* Swap Button */}
                <div className="flex justify-center">
                    <button onClick={handleSwap} className="btn btn-outline" style={{ borderRadius: '50%', padding: '8px' }}>
                        <ArrowRightLeft size={20} />
                    </button>
                </div>

                {/* Result Section */}
                <div className="flex flex-col gap-sm">
                    <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                        {isBtcBase ? currency.toUpperCase() : 'Bitcoin (BTC)'}
                    </label>
                    <div className="input" style={{ backgroundColor: 'var(--bg-app)', fontWeight: 'bold', fontSize: '1.25rem' }}>
                        {hideValues ? '••••••' : calculate()}
                    </div>
                </div>

                {/* Currency Selector */}
                <div className="flex justify-end">
                    <select
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        className="input"
                        style={{ width: 'auto' }}
                    >
                        <option value="brl">BRL (R$)</option>
                        <option value="usd">USD ($)</option>
                        <option value="eur">EUR (€)</option>
                    </select>
                </div>

                {/* Rate Info */}
                {priceData && (
                    <div style={{ marginTop: 'var(--space-sm)', fontSize: '0.875rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
                        1 BTC = {currentRate.toLocaleString('pt-BR', { style: 'currency', currency: currency.toUpperCase() })}
                        <span style={{ marginLeft: '8px', color: change24h >= 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>
                            {change24h > 0 ? '+' : ''}{change24h.toFixed(2)}%
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Calculator;
