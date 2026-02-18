import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getMarketChart } from '../services/api';

const PriceChart = () => {
    const [data, setData] = useState([]);
    const [timeframe, setTimeframe] = useState('1'); // days
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const prices = await getMarketChart('brl', timeframe);
            const formattedData = prices.map(([timestamp, price]) => ({
                date: new Date(timestamp).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }),
                price: price,
                timestamp
            }));
            setData(formattedData);
            setLoading(false);
        };
        fetchData();
    }, [timeframe]);

    const timeframes = [
        { label: '24h', value: '1' },
        { label: '7d', value: '7' },
        { label: '30d', value: '30' },
        { label: '1a', value: '365' },
    ];

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="card" style={{ padding: '8px', border: '1px solid var(--color-primary)' }}>
                    <p style={{ fontSize: '0.75rem', marginBottom: '4px' }}>{label}</p>
                    <p style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>
                        {payload[0].value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="card">
            <div className="flex justify-between items-center" style={{ marginBottom: 'var(--space-md)' }}>
                <div className="flex items-center gap-sm">
                    <h2>Histórico</h2>
                    <button className="btn btn-outline" style={{ padding: '2px 8px', fontSize: '0.75rem' }} onClick={() => alert('Exportar imagem: Em breve')}>
                        📷
                    </button>
                </div>
                <div className="flex gap-sm">
                    {timeframes.map((tf) => (
                        <button
                            key={tf.value}
                            onClick={() => setTimeframe(tf.value)}
                            className={`btn ${timeframe === tf.value ? 'btn-primary' : 'btn-outline'}`}
                            style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                        >
                            {tf.label}
                        </button>
                    ))}
                </div>
            </div>

            <div style={{ width: '100%', height: 300 }}>
                {loading ? (
                    <div className="flex items-center justify-center" style={{ height: '100%' }}>
                        <p>Carregando gráfico...</p>
                    </div>
                ) : (
                    <ResponsiveContainer>
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--bg-input)" />
                            <XAxis
                                dataKey="date"
                                hide={true}
                            />
                            <YAxis
                                domain={['auto', 'auto']}
                                tickFormatter={(val) => `R$${(val / 1000).toFixed(0)}k`}
                                style={{ fontSize: '0.75rem' }}
                                width={40}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Area
                                type="monotone"
                                dataKey="price"
                                stroke="var(--color-primary)"
                                fillOpacity={1}
                                fill="url(#colorPrice)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
};

export default PriceChart;
