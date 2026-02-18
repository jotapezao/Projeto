import React from 'react';
import PriceChart from '../components/PriceChart';

const Charts = () => {
    return (
        <div className="flex flex-col gap-md">
            <PriceChart />
            <div className="card">
                <h3>Estatísticas</h3>
                <p>Mais detalhes em breve.</p>
            </div>
        </div>
    );
};

export default Charts;
