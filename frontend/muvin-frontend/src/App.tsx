import { useState, useEffect } from 'react';
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

export default function App() {
  const [route, setRoute] = useState('home');
  const [detailId, setDetailId] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [corretor, setCorretor] = useState<Corretor | null>(null);
  const [loading, setLoading] = useState(true);
  const [pendingFilter, setPendingFilter] = useState<QuickSearch | null>(null);
  const [showLgpd, setShowLgpd] = useState(false);
  const [dark, setDark] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  }, [dark]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [route, detailId]);

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
      setRoute('home');
    }
    window.addEventListener('auth:expired', handleExpired);
    return () => window.removeEventListener('auth:expired', handleExpired);
  }, []);

  useEffect(() => {
    Promise.all([
      api.getProperties(),
      api.getPerfil().catch(() => null),
      api.checkAuth().then(() => true).catch(() => false),
    ]).then(([ps, c, authenticated]) => {
      setProperties(ps);
      if (ps.length > 0) setDetailId(ps[0].id);
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
    setDetailId(id);
    setRoute('detail');
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
      setRoute('admin-list');
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
  }

  function navigateTo(r: string) {
    if (r === 'list') setPendingFilter(null);
    setRoute(r);
  }

  function handleLogin() {
    api.setAuthState(true);
    setIsAuthenticated(true);
    api.getLeads().then(setLeads).catch(console.error);
  }

  async function handleLogout() {
    await api.logout().catch(() => {});
    api.setAuthState(false);
    setIsAuthenticated(false);
    setLeads([]);
    setRoute('home');
  }

  const isAdmin = route.startsWith('admin');

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <p className="muted">Carregando imóveis…</p>
      </div>
    );
  }

  return (
    <>
      {!isAdmin && <Nav route={route} setRoute={navigateTo} corretor={corretor} />}

      {route === 'home' && (
        <HomeScreen setRoute={navigateTo} openProperty={openProperty} properties={properties} onSearch={handleSearch} corretor={corretor} />
      )}
      {route === 'list' && (
        <ListScreen openProperty={openProperty} properties={properties} initialFilter={pendingFilter} />
      )}
      {route === 'detail' && detailId && (
        <DetailScreen
          propertyId={detailId}
          setRoute={navigateTo}
          openProperty={openProperty}
          properties={properties}
          onLeadSubmit={onLeadSubmit}
          corretor={corretor}
        />
      )}
      {route === 'about' && <AboutScreen setRoute={navigateTo} corretor={corretor} />}
      {route === 'contact' && <ContactScreen onLeadSubmit={onLeadSubmit} corretor={corretor} />}
      {route === 'privacy' && <PrivacyScreen setRoute={navigateTo} />}
      {route === 'terms' && <TermsScreen setRoute={navigateTo} />}

      {isAdmin && !isAuthenticated && <AdminLogin onLogin={handleLogin} />}

      {isAdmin && isAuthenticated && (
        <AdminShell route={route} setRoute={setRoute} onLogout={handleLogout} corretor={corretor}>
          {route === 'admin-dashboard' && (
            <AdminDashboard
              setRoute={setRoute}
              properties={properties}
              leads={leads}
              setEditingId={setEditingId}
              corretor={corretor}
            />
          )}
          {route === 'admin-list' && (
            <AdminPropertyList
              setRoute={setRoute}
              properties={properties}
              setEditingId={setEditingId}
              deleteProperty={deleteProperty}
            />
          )}
          {route === 'admin-edit' && (
            <AdminPropertyEdit
              setRoute={setRoute}
              properties={properties}
              editingId={editingId}
              saveProperty={saveProperty}
            />
          )}
          {route === 'admin-leads' && (
            <AdminLeads leads={leads} setLeadStatus={setLeadStatus} />
          )}
          {route === 'admin-perfil' && <AdminPerfil onUpdate={setCorretor} />}
        </AdminShell>
      )}

      {!isAdmin && <Footer setRoute={navigateTo} corretor={corretor} />}
      {!isAdmin && <WhatsAppFAB corretor={corretor} />}
      {!isAdmin && showLgpd && <LGPDBanner />}
    </>
  );
}
