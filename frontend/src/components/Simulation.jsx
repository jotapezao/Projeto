import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useUser } from '../contexts/UserContext';

const Simulation = () => {
    const { hideValues } = useUser();
    const [initial, setInitial] = useState(1000);
    const [monthly, setMonthly] = useState(200);
    const [years, setYears] = useState(5);
    const [growth, setGrowth] = useState(5); // Monthly growth % (optimistic crypto scenario)
    const [data, setData] = useState([]);
    const [result, setResult] = useState({ totalInvested: 0, totalValue: 0 });

    useEffect(() => {
        const months = years * 12;
        const newData = [];
        let currentVal = initial;
        let totalInv = initial;

        for (let i = 0; i <= months; i++) {
            newData.push({
                month: i,
                value: currentVal,
                invested: totalInv
            });

            if (i < months) {
                currentVal = currentVal * (1 + growth / 100) + monthly;
                totalInv += monthly;
            }
        }

        setData(newData);
        setResult({
            totalInvested: totalInv,
            totalValue: currentVal
        });
    }, [initial, monthly, years, growth]);

    return (
        <div className="card">
            <h2>Simulação de Investimento</h2>
            <p style={{ fontSize: '0.875rem', marginBottom: 'var(--space-md)' }}>
                Projete seus ganhos com aportes mensais e juros compostos.
            </p>

            <div className="flex flex-col gap-md">
                <div className="flex flex-col gap-sm">
                    <label style={{ fontSize: '0.875rem' }}>Aporte Inicial (R$)</label>
                    <input
                        type="number"
                        value={initial}
                        onChange={(e) => setInitial(Number(e.target.value))}
                        className="input"
                    />
                </div>

                <div className="flex flex-col gap-sm">
                    <label style={{ fontSize: '0.875rem' }}>Aporte Mensal (R$)</label>
                    <input
                        type="number"
                        value={monthly}
                        onChange={(e) => setMonthly(Number(e.target.value))}
                        className="input"
                    />
                </div>

                <div className="flex gap-md">
                    <div className="flex flex-col gap-sm" style={{ flex: 1 }}>
                        <label style={{ fontSize: '0.875rem' }}>Tempo (Anos)</label>
                        <input
                            type="number"
                            value={years}
                            onChange={(e) => setYears(Number(e.target.value))}
                            className="input"
                        />
                    </div>
                    <div className="flex flex-col gap-sm" style={{ flex: 1 }}>
                        <label style={{ fontSize: '0.875rem' }}>Crescimento Mensal (%)</label>
                        <input
                            type="number"
                            value={growth}
                            onChange={(e) => setGrowth(Number(e.target.value))}
                            className="input"
                        />
                    </div>
                </div>

                <div className="card" style={{ backgroundColor: 'var(--bg-input)', marginTop: 'var(--space-sm)' }}>
                    <div className="flex justify-between" style={{ marginBottom: 'var(--space-xs)' }}>
                        <span>Total Investido:</span>
                        <strong>{hideValues ? '••••••' : result.totalInvested.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong>
                    </div>
                    <div className="flex justify-between" style={{ color: 'var(--color-primary)' }}>
                        <span>Valor Final:</span>
                        <strong>{hideValues ? '••••••' : result.totalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong>
                    </div>
                    <div className="flex justify-between" style={{ fontSize: '0.875rem', color: 'var(--color-success)', marginTop: 'var(--space-xs)' }}>
                        <span>Lucro:</span>
                        <span>{hideValues ? '••••••' : `+${(result.totalValue - result.totalInvested).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`}</span>
                    </div>
                </div>

                <div style={{ width: '100%', height: 200, marginTop: 'var(--space-md)' }}>
                    <ResponsiveContainer>
                        <AreaChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--bg-card)" />
                            <XAxis dataKey="month" hide />
                            <YAxis hide />
                            <Tooltip
                                formatter={(value) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                labelFormatter={(label) => `Mês ${label}`}
                            />
                            <Area type="monotone" dataKey="value" stroke="var(--color-primary)" fill="var(--color-primary)" fillOpacity={0.2} name="Valor Total" />
                            <Area type="monotone" dataKey="invested" stroke="var(--text-muted)" fill="var(--text-muted)" fillOpacity={0.1} name="Investido" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Simulation;
