import React, { useState, useEffect } from 'react';
import BrandedIcon from './components/BrandedIcon';
import './App.css';
import Home from './pages/Home';
import NovoPedido from './pages/NovoPedido';
import Clientes from './pages/Clientes';
import Financeiro from './pages/Financeiro';
import Login from './pages/Login';
import Configuracoes from './pages/Configuracoes';
import Suporte from './pages/Suporte';
import Privacidade from './pages/Privacidade';
import Termos from './pages/Termos';
import Footer from './components/Footer';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('home');
  const [pedidoEmEdicao, setPedidoEmEdicao] = useState(null);
  const [backendHealth, setBackendHealth] = useState('checking');

  // Dados do sistema - Inicializados vazios, carregados via API
  const [pedidos, setPedidos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [users, setUsers] = useState([]);
  const [settings, setSettings] = useState({
    receipt_name: 'COSTURACERTA',
    receipt_tagline: 'Comprovante de Serviço Profissional'
  });

  // Tema (Dark por padrão)
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Configuração da URL do Backend
  const BASE_URL = import.meta.env.VITE_API_URL || '';
  console.log('API Conectada em:', BASE_URL || '(Local)');

  // Carregar dados iniciais do Backend
  const fetchData = async () => {
    try {
      const [pRes, cRes, sRes, uRes, setRes] = await Promise.all([
        fetch(`${BASE_URL}/api/pedidos`),
        fetch(`${BASE_URL}/api/clientes`),
        fetch(`${BASE_URL}/api/servicos`),
        fetch(`${BASE_URL}/api/users`),
        fetch(`${BASE_URL}/api/settings`)
      ]);

      if (pRes.ok) setPedidos(await pRes.json());
      if (cRes.ok) setClientes(await cRes.json());
      if (sRes.ok) setServicos(await sRes.json());
      if (uRes.ok) setUsers(await uRes.json());
      if (setRes.ok) {
        const data = await setRes.json();
        setSettings(prev => ({ ...prev, ...data }));
      }

      setBackendHealth('online');
    } catch (err) {
      console.error('Fetch error:', err);
      setBackendHealth('offline');
    }
  };

  useEffect(() => {
    // Carregar sessão local
    try {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        const user = JSON.parse(savedUser);
        if (user && user.username) {
          setIsAuthenticated(true);
          setCurrentUser(user);
        }
      }
    } catch (e) {
      console.error('Session restore error:', e);
      localStorage.removeItem('user');
    }

    fetchData();
  }, []);

  const addServico = async (novoServico) => {
    try {
      const res = await fetch(`${BASE_URL}/api/servicos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoServico)
      });
      if (res.ok) {
        const saved = await res.json();
        setServicos(prev => [...prev, saved]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteServico = async (servicoId) => {
    try {
      const res = await fetch(`${BASE_URL}/api/servicos/${servicoId}`, { method: 'DELETE' });
      if (res.ok) {
        setServicos(prev => prev.filter(s => s.id !== servicoId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const updateSettings = async (newSettings) => {
    try {
      const res = await fetch(`${BASE_URL}/api/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings)
      });
      if (res.ok) {
        setSettings(prev => ({ ...prev, ...newSettings }));
        return true;
      }
      return false;
    } catch (err) {
      console.error('Update settings error:', err);
      return false;
    }
  };

  const handleCreateUser = async (newUser) => {
    try {
      const res = await fetch(`${BASE_URL}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });
      if (res.ok) {
        const saved = await res.json();
        setUsers(prev => [...prev, saved]);
      } else {
        const err = await res.json();
        throw new Error(err.error || 'Erro ao criar usuário');
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteUser = async (username) => {
    try {
      const res = await fetch(`${BASE_URL}/api/users/${username}`, { method: 'DELETE' });
      if (res.ok) {
        setUsers(prev => prev.filter(u => u.username !== username));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogin = async (credentials) => {
    try {
      const res = await fetch(`${BASE_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      const data = await res.json();
      if (data.success) {
        setIsAuthenticated(true);
        setCurrentUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        return { success: true };
      }
      return { success: false, message: data.message };
    } catch (err) {
      return { success: false, message: 'Erro de conexão com servidor' };
    }
  };

  const resetPassword = async (username, newPassword) => {
    try {
      const res = await fetch(`${BASE_URL}/api/users/${username}/password`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: newPassword })
      });
      return res.ok;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    localStorage.removeItem('user');
    setCurrentPage('home');
  };

  const addPedido = async (pedido) => {
    try {
      const res = await fetch(`${BASE_URL}/api/pedidos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pedido)
      });
      if (res.ok) {
        await fetchData();
        setCurrentPage('home');
        return true;
      } else {
        const errorData = await res.json();
        alert('Erro ao criar pedido: ' + (errorData.error || 'Erro desconhecido'));
        return false;
      }
    } catch (err) {
      console.error(err);
      alert('Erro de conexão com o servidor');
      return false;
    }
  };

  const updatePedido = async (pedidoAtualizado) => {
    try {
      const res = await fetch(`${BASE_URL}/api/pedidos/${pedidoAtualizado.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pedidoAtualizado)
      });
      if (res.ok) {
        fetchData();
        setCurrentPage('home');
        setPedidoEmEdicao(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleQuickPay = async (pedidoId) => {
    try {
      const res = await fetch(`${BASE_URL}/api/pedidos/${pedidoId}/pay`, { method: 'PATCH' });
      if (res.ok) fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleWithdraw = async (pedidoId) => {
    try {
      const res = await fetch(`${BASE_URL}/api/pedidos/${pedidoId}/withdraw`, { method: 'PATCH' });
      if (res.ok) fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const addCliente = async (cliente) => {
    try {
      const res = await fetch(`${BASE_URL}/api/clientes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cliente)
      });
      if (res.ok) {
        const saved = await res.json();
        setClientes(prev => [...prev, saved]);
        return saved;
      } else {
        const errorData = await res.json();
        console.error('Erro ao adicionar cliente:', errorData);
        return null;
      }
    } catch (err) {
      console.error('Erro de conexão ao adicionar cliente:', err);
      return null;
    }
  };

  const updateCliente = async (cliente) => {
    try {
      const res = await fetch(`${BASE_URL}/api/clientes/${cliente.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cliente)
      });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteCliente = async (clienteId) => {
    try {
      const res = await fetch(`${BASE_URL}/api/clientes/${clienteId}`, { method: 'DELETE' });
      if (res.ok) {
        fetchData();
      } else {
        const err = await res.json();
        alert(err.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditPedido = (pedido) => {
    setPedidoEmEdicao(pedido);
    setCurrentPage('novo-pedido');
  };

  const handleNavigate = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('A logo deve ter menos de 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        updateSettings({ system_logo: reader.result }).then(success => {
          if (success) {
            alert('Logo atualizada!');
          } else {
            alert('Erro ao salvar logo');
          }
        });
      };
      reader.readAsDataURL(file);
    }
  };

  if (backendHealth === 'checking') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--color-background)', gap: '20px' }}>
        <div className="animate-pulse" style={{ width: '80px', height: '80px', background: 'var(--color-primary)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
          <BrandedIcon size={40} settings={settings} style={{ borderRadius: '10px' }} />
        </div>
        <p style={{ color: 'var(--color-text-secondary)', fontWeight: '600', animation: 'pulse 1.5s infinite' }}>Carregando sistema...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="app">
        <Login onLogin={handleLogin} theme={theme} onToggleTheme={toggleTheme} settings={settings} />
        <Footer onNavigate={handleNavigate} />
      </div>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <Home
            pedidos={pedidos}
            clientes={clientes}
            currentUser={currentUser}
            theme={theme}
            settings={settings}
            onToggleTheme={toggleTheme}
            onNovoPedido={() => {
              setPedidoEmEdicao(null);
              setCurrentPage('novo-pedido');
            }}
            onEditPedido={handleEditPedido}
            onQuickPay={handleQuickPay}
            onWithdraw={handleWithdraw}
            onNavigateToClientes={() => handleNavigate('clientes')}
            onNavigateToFinanceiro={() => handleNavigate('financeiro')}
            onNavigateToSeguranca={() => handleNavigate('seguranca')}
            onNavigateToSuporte={() => handleNavigate('suporte')}
            onNavigateToPrivacidade={() => handleNavigate('privacidade')}
            onNavigateToTermos={() => handleNavigate('termos')}
            onLogout={handleLogout}
            backendHealth={backendHealth}
            onLogoChange={handleLogoChange}
          />
        );
      case 'novo-pedido':
        return (
          <NovoPedido
            clientes={clientes}
            servicos={servicos}
            pedidoEmEdicao={pedidoEmEdicao}
            isEditing={true}
            theme={theme}
            settings={settings}
            onToggleTheme={toggleTheme}
            onBack={() => handleNavigate('home')}
            onSave={pedidoEmEdicao ? updatePedido : addPedido}
            onAddCliente={addCliente}
            onAddServico={addServico}
            onDeleteServico={deleteServico}
            onNavigateToSuporte={() => handleNavigate('suporte')}
            onNavigateToPrivacidade={() => handleNavigate('privacidade')}
            onNavigateToTermos={() => handleNavigate('termos')}
          />
        );
      case 'clientes':
        return (
          <Clientes
            clientes={clientes}
            pedidos={pedidos}
            theme={theme}
            settings={settings}
            onToggleTheme={toggleTheme}
            onBack={() => handleNavigate('home')}
            onAddCliente={addCliente}
            onUpdateCliente={updateCliente}
            onDeleteCliente={deleteCliente}
            onNavigateToSuporte={() => handleNavigate('suporte')}
            onNavigateToPrivacidade={() => handleNavigate('privacidade')}
            onNavigateToTermos={() => handleNavigate('termos')}
          />
        );
      case 'financeiro':
        return (
          <Financeiro
            pedidos={pedidos}
            clientes={clientes}
            theme={theme}
            settings={settings}
            onToggleTheme={toggleTheme}
            onBack={() => handleNavigate('home')}
            onNavigateToSuporte={() => handleNavigate('suporte')}
            onNavigateToPrivacidade={() => handleNavigate('privacidade')}
            onNavigateToTermos={() => handleNavigate('termos')}
          />
        );
      case 'seguranca':
        return (
          <Configuracoes
            users={users}
            currentUser={currentUser}
            theme={theme}
            settings={settings}
            onUpdateSettings={updateSettings}
            onToggleTheme={toggleTheme}
            onBack={() => handleNavigate('home')}
            onCreateUser={handleCreateUser}
            onDeleteUser={handleDeleteUser}
            onResetPassword={resetPassword}
            onNavigateToSuporte={() => handleNavigate('suporte')}
            onNavigateToPrivacidade={() => handleNavigate('privacidade')}
            onNavigateToTermos={() => handleNavigate('termos')}
          />
        );
      case 'suporte':
        return (
          <Suporte
            theme={theme}
            onToggleTheme={toggleTheme}
            onBack={() => handleNavigate('home')}
          />
        );
      case 'privacidade':
        return (
          <Privacidade
            theme={theme}
            onToggleTheme={toggleTheme}
            onBack={() => handleNavigate('home')}
          />
        );
      case 'termos':
        return (
          <Termos
            theme={theme}
            onToggleTheme={toggleTheme}
            onBack={() => handleNavigate('home')}
          />
        );
      default:
        return null;
    }
  };

  return <div className="app">{renderPage()}</div>;
}

export default App;
