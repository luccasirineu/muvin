import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Routes, Route, useParams } from 'react-router-dom';
import type { Property, Lead, LeadStatus, QuickSearch, Corretor } from './types';
import * as api from './services/api';
import { Nav } from './components/Nav';
import { Footer } from './components/Footer';
import { WhatsAppFAB } from './components/WhatsAppFAB';
import { LGPDBanner } from './components/LGPDBanner';
import { HomeScreen } from './screens/HomeScreen';
import { ListScreen } from './screens/ListScreen';
import { DetailScreen } from './screens/DetailScreen';
import { AboutScreen } from './screens/AboutScreen';
import { ContactScreen } from './screens/ContactScreen';
import { PrivacyScreen } from './screens/PrivacyScreen';
import { TermsScreen } from './screens/TermsScreen';
import { AdminShell } from './admin/AdminShell';
import { AdminLogin } from './admin/AdminLogin';
import { AdminDashboard } from './admin/AdminDashboard';
import { AdminPropertyList } from './admin/AdminPropertyList';
import { AdminPropertyEdit } from './admin/AdminPropertyEdit';
import { AdminLeads } from './admin/AdminLeads';
import { AdminPerfil } from './admin/AdminPerfil';

type LeadPayload = Omit<Lead, 'id' | 'receivedAt' | 'status'>;
type DetailRouteWrapperProps = Omit<Parameters<typeof DetailScreen>[0], 'propertyId'>;

function DetailRouteWrapper(props: DetailRouteWrapperProps) {
  const { id } = useParams<{ id: string }>();
  return <DetailScreen propertyId={id ?? ''} {...props} />;
}

function pathnameToRoute(pathname: string): string {
  if (pathname === '/') return 'home';
  if (pathname.startsWith('/imoveis')) return 'list';
  if (pathname.startsWith('/imovel')) return 'detail';
  if (pathname.startsWith('/sobre')) return 'about';
  if (pathname.startsWith('/contato')) return 'contact';
  if (pathname.startsWith('/privacidade')) return 'privacy';
  if (pathname.startsWith('/termos')) return 'terms';
  return 'home';
}

export default function App() {
  const [adminRoute, setAdminRoute] = useState('admin-dashboard');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [corretor, setCorretor] = useState<Corretor | null>(null);
  const [loading, setLoading] = useState(true);
  const [pendingFilter, setPendingFilter] = useState<QuickSearch | null>(null);
  const [showLgpd, setShowLgpd] = useState(false);
  const [dark, setDark] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const currentRoute = pathnameToRoute(location.pathname);

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  }, [dark]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.shiftKey && e.key === 'T') setShowLgpd((v) => !v);
      if (e.shiftKey && e.key === 'D') setDark((v) => !v);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    function handleExpired() {
      api.setAuthState(false);
      setIsAuthenticated(false);
      setLeads([]);
      navigate('/');
    }
    window.addEventListener('auth:expired', handleExpired);
    return () => window.removeEventListener('auth:expired', handleExpired);
  }, [navigate]);

  useEffect(() => {
    Promise.all([
      api.getProperties(),
      api.getPerfil().catch(() => null),
      api.checkAuth().then(() => true).catch(() => false),
    ]).then(([ps, c, authenticated]) => {
      setProperties(ps);
      setCorretor(c);
      if (authenticated) {
        api.setAuthState(true);
        setIsAuthenticated(true);
      }
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      api.getLeads().then(setLeads).catch(console.error);
    }
  }, [isAuthenticated]);

  function openProperty(id: string) {
    navigate(`/imovel/${id}`);
  }

  async function onLeadSubmit(payload: LeadPayload) {
    try {
      const lead = await api.createLead({
        name: payload.name || '—',
        phone: payload.phone || '',
        email: payload.email || '',
        message: payload.message,
        interest: payload.desejo || 'Comprar',
      });
      setLeads((ls) => [lead, ...ls]);
    } catch (err) {
      console.error('Erro ao enviar lead:', err);
    }
  }

  async function saveProperty(draft: Property) {
    try {
      if (draft.id) {
        const updated = await api.updateProperty(draft.id, draft);
        setProperties((ps) => ps.map((p) => (p.id === updated.id ? updated : p)));
      } else {
        const created = await api.createProperty(draft);
        setProperties((ps) => [created, ...ps]);
      }
      setAdminRoute('admin-list');
    } catch (err) {
      console.error('Erro ao salvar imóvel:', err);
      alert('Erro ao salvar imóvel. Verifique os dados e tente novamente.');
    }
  }

  async function deleteProperty(id: string) {
    try {
      await api.deleteProperty(id);
      setProperties((ps) => ps.filter((p) => p.id !== id));
    } catch (err) {
      console.error('Erro ao remover imóvel:', err);
      alert('Erro ao remover imóvel. Tente novamente.');
    }
  }

  async function setLeadStatus(id: string, status: LeadStatus) {
    try {
      const updated = await api.updateLeadStatus(id, status);
      setLeads((ls) => ls.map((l) => (l.id === id ? { ...l, status: updated.status } : l)));
    } catch (err) {
      console.error('Erro ao atualizar status do lead:', err);
    }
  }

  function handleSearch(filter: QuickSearch) {
    setPendingFilter(filter);
    navigate('/imoveis');
  }

  function navigateTo(r: string) {
    switch (r) {
      case 'home':        navigate('/');            break;
      case 'list':        setPendingFilter(null); navigate('/imoveis'); break;
      case 'about':       navigate('/sobre');       break;
      case 'contact':     navigate('/contato');     break;
      case 'privacy':     navigate('/privacidade'); break;
      case 'terms':       navigate('/termos');      break;
      default:
        setAdminRoute(r);
        if (!location.pathname.startsWith('/admin')) navigate('/admin');
        break;
    }
  }

  function handleLogin() {
    api.setAuthState(true);
    setIsAuthenticated(true);
    api.getLeads().then(setLeads).catch(console.error);
    setAdminRoute('admin-dashboard');
  }

  async function handleLogout() {
    await api.logout().catch(() => {});
    api.setAuthState(false);
    setIsAuthenticated(false);
    setLeads([]);
    navigate('/');
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <p className="muted">Carregando imóveis…</p>
      </div>
    );
  }

  return (
    <>
      {!isAdmin && <Nav route={currentRoute} setRoute={navigateTo} corretor={corretor} />}

      <Routes>
        <Route path="/" element={
          <HomeScreen setRoute={navigateTo} openProperty={openProperty} properties={properties} onSearch={handleSearch} corretor={corretor} />
        } />
        <Route path="/imoveis" element={
          <ListScreen openProperty={openProperty} properties={properties} initialFilter={pendingFilter} />
        } />
        <Route path="/imovel/:id" element={
          <DetailRouteWrapper setRoute={navigateTo} openProperty={openProperty} properties={properties} onLeadSubmit={onLeadSubmit} corretor={corretor} />
        } />
        <Route path="/sobre" element={<AboutScreen setRoute={navigateTo} corretor={corretor} />} />
        <Route path="/contato" element={<ContactScreen onLeadSubmit={onLeadSubmit} corretor={corretor} />} />
        <Route path="/privacidade" element={<PrivacyScreen setRoute={navigateTo} />} />
        <Route path="/termos" element={<TermsScreen setRoute={navigateTo} />} />
        <Route path="/admin/*" element={
          !isAuthenticated
            ? <AdminLogin onLogin={handleLogin} />
            : <AdminShell route={adminRoute} setRoute={setAdminRoute} onLogout={handleLogout} corretor={corretor}>
                {adminRoute === 'admin-dashboard' && (
                  <AdminDashboard setRoute={setAdminRoute} properties={properties} leads={leads} setEditingId={setEditingId} corretor={corretor} />
                )}
                {adminRoute === 'admin-list' && (
                  <AdminPropertyList setRoute={setAdminRoute} properties={properties} setEditingId={setEditingId} deleteProperty={deleteProperty} />
                )}
                {adminRoute === 'admin-edit' && (
                  <AdminPropertyEdit setRoute={setAdminRoute} properties={properties} editingId={editingId} saveProperty={saveProperty} />
                )}
                {adminRoute === 'admin-leads' && (
                  <AdminLeads leads={leads} setLeadStatus={setLeadStatus} />
                )}
                {adminRoute === 'admin-perfil' && <AdminPerfil onUpdate={setCorretor} />}
              </AdminShell>
        } />
      </Routes>

      {!isAdmin && <Footer setRoute={navigateTo} corretor={corretor} />}
      {!isAdmin && <WhatsAppFAB corretor={corretor} />}
      {!isAdmin && showLgpd && <LGPDBanner />}
    </>
  );
}
