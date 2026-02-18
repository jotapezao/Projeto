import React from 'react';
import { Sun, Moon } from 'lucide-react';
import BrandedIcon from './BrandedIcon';

const Header = ({ title, leftAction, rightActions, backendHealth, theme, onToggleTheme, settings = {} }) => {
    return (
        <header className="app-header">
            <div className="container">
                <div className="app-header-content">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                        {leftAction}
                        <h1 className="app-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                            <BrandedIcon
                                size={32}
                                settings={settings}
                                style={{
                                    borderRadius: '8px',
                                    background: settings.system_logo ? 'transparent' : 'rgba(255,255,255,0.1)'
                                }}
                            />
                            <span style={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                            }}>
                                {settings.receipt_name || title || 'CosturaCerta'}
                            </span>
                            {backendHealth && (
                                <span
                                    title={`Status: ${backendHealth}`}
                                    style={{
                                        width: '8px',
                                        height: '8px',
                                        borderRadius: '50%',
                                        backgroundColor: backendHealth === 'online' ? '#4caf50' : (backendHealth === 'checking' ? '#ff9800' : '#f44336'),
                                        display: 'inline-block',
                                        marginLeft: '8px',
                                        border: '1.5px solid rgba(255,255,255,0.8)'
                                    }}
                                />
                            )}
                        </h1>
                    </div>
                    <div className="app-actions" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {onToggleTheme && (
                            <button
                                className="icon-btn theme-toggle"
                                onClick={onToggleTheme}
                                title={theme === 'dark' ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
                                style={{ background: 'rgba(255,255,255,0.1)', color: 'white', borderRadius: '12px', padding: '8px' }}
                            >
                                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                            </button>
                        )}
                        {rightActions}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
