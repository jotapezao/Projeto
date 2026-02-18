import React from 'react';
import { NavLink } from 'react-router-dom';
import { Calculator, LineChart, Newspaper, TrendingUp, User } from 'lucide-react';

const Navigation = () => {
    const navItems = [
        { to: "/", icon: Calculator, label: "Calc" },
        { to: "/charts", icon: LineChart, label: "Gráficos" },
        { to: "/news", icon: Newspaper, label: "Notícias" },
        { to: "/simulation", icon: TrendingUp, label: "Simular" },
        { to: "/profile", icon: User, label: "Perfil" },
    ];

    return (
        <nav style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'var(--bg-card)',
            borderTop: '1px solid var(--bg-input)',
            padding: 'var(--space-sm) var(--space-md)',
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            zIndex: 1000,
            boxShadow: '0 -2px 10px rgba(0,0,0,0.05)'
        }}>
            {navItems.map(({ to, icon: Icon, label }) => (
                <NavLink
                    key={to}
                    to={to}
                    style={({ isActive }) => ({
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textDecoration: 'none',
                        color: isActive ? 'var(--color-primary)' : 'var(--text-muted)',
                        fontSize: '0.75rem',
                        gap: '4px',
                        transition: 'color 0.2s'
                    })}
                >
                    <Icon size={24} strokeWidth={2} />
                    <span>{label}</span>
                </NavLink>
            ))}
        </nav>
    );
};

export default Navigation;
