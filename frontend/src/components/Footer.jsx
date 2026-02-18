import React from 'react';
import { HelpCircle, FileText, Shield, Info } from 'lucide-react';

const Footer = ({ onNavigate }) => {
    return (
        <footer className="app-footer">
            <div className="container">
                <div className="app-footer-content">
                    <div className="footer-brand">
                        <span className="footer-logo-text">CosturaCerta</span>
                        <span className="footer-tagline"> | Gestão Profissional</span>
                    </div>

                    <div className="footer-nav">
                        <button onClick={() => onNavigate && onNavigate('suporte')} className="footer-link">
                            <Info size={14} /> Sobre
                        </button>
                        <button onClick={() => onNavigate && onNavigate('suporte')} className="footer-link">
                            <HelpCircle size={14} /> Suporte
                        </button>
                        <button onClick={() => onNavigate && onNavigate('termos')} className="footer-link">
                            <FileText size={14} /> Termos
                        </button>
                        <button onClick={() => onNavigate && onNavigate('privacidade')} className="footer-link">
                            <Shield size={14} /> Privacidade
                        </button>
                    </div>

                    <div className="footer-copyright">
                        <p className="copyright">
                            © {new Date().getFullYear()} Todos os direitos reservados.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
