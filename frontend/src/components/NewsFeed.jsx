import React, { useState } from 'react';
import { ExternalLink, Filter } from 'lucide-react';

const MOCK_NEWS = [
    {
        id: 1,
        title: "Bitcoin atinge nova máxima histórica no Brasil",
        source: "CryptoNews BR",
        time: "2h atrás",
        summary: "O preço do Bitcoin superou a marca de R$ 500.000 em diversas corretoras nacionais, impulsionado pela alta demanda institucional.",
        url: "#",
        relevance: "high"
    },
    {
        id: 2,
        title: "Banco Central anuncia novidades sobre o Real Digital",
        source: "Finanças Hoje",
        time: "4h atrás",
        summary: "O Drex, versão digital do real, terá integração facilitada com protocolos de finanças descentralizadas (DeFi).",
        url: "#",
        relevance: "medium"
    },
    {
        id: 3,
        title: "Análise: O que esperar do Halving em 2028?",
        source: "Investidor Crypto",
        time: "6h atrás",
        summary: "Especialistas debatem os possíveis impactos do próximo halving na mineração e no preço do ativo.",
        url: "#",
        relevance: "low"
    },
    {
        id: 4,
        title: "ETFs de Bitcoin registram entrada recorde de capital",
        source: "Global Markets",
        time: "12h atrás",
        summary: "Os fundos negociados em bolsa nos EUA continuam atraindo bilhões de dólares de investidores institucionais.",
        url: "#",
        relevance: "high"
    }
];

const NewsFeed = () => {
    const [filter, setFilter] = useState('all');

    const filteredNews = filter === 'all'
        ? MOCK_NEWS
        : MOCK_NEWS.filter(n => n.relevance === 'high');

    return (
        <div className="flex flex-col gap-md">
            <div className="flex justify-between items-center">
                <h2>Notícias</h2>
                <button
                    onClick={() => setFilter(filter === 'all' ? 'high' : 'all')}
                    className={`btn ${filter === 'high' ? 'btn-primary' : 'btn-outline'}`}
                    style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                >
                    <Filter size={14} style={{ marginRight: '4px' }} />
                    {filter === 'all' ? 'Todas' : 'Destaques'}
                </button>
            </div>

            {filteredNews.map((item) => (
                <div key={item.id} className="card" style={{ padding: 'var(--space-md)' }}>
                    <div className="flex justify-between items-start" style={{ marginBottom: 'var(--space-sm)' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-primary)', fontWeight: 'bold' }}>
                            {item.source}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {item.time}
                        </span>
                    </div>

                    <h3 style={{ fontSize: '1rem', marginBottom: 'var(--space-sm)' }}>{item.title}</h3>
                    <p style={{ fontSize: '0.875rem', marginBottom: 'var(--space-md)' }}>{item.summary}</p>

                    <a href={item.url} className="btn btn-outline btn-full" style={{ fontSize: '0.875rem' }}>
                        Ler completa <ExternalLink size={14} style={{ marginLeft: '4px' }} />
                    </a>
                </div>
            ))}
        </div>
    );
};

export default NewsFeed;
