import type { ReactNode } from 'react';
import type { Corretor } from '../types';
import { Logo } from '../components/Logo';

interface AdminShellProps {
  route: string;
  setRoute: (r: string) => void;
  onLogout: () => void;
  corretor?: Corretor | null;
  children: ReactNode;
}

const NAV_ITEMS = [
  { id: 'admin-dashboard', label: 'Painel', icon: '◇' },
  { id: 'admin-list', label: 'Imóveis', icon: '▦' },
  { id: 'admin-leads', label: 'Leads', icon: '✉' },
  { id: 'admin-perfil', label: 'Perfil', icon: '◯' },
];

export function AdminShell({ route, setRoute, onLogout, corretor, children }: AdminShellProps) {
  const initials = corretor?.name
    ? corretor.name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase()
    : '—';

  return (
    <div className="admin-shell">
      <aside className="admin-side">
        <div className="admin-side-brand">
          <Logo size={24} />
          <span className="admin-mode">Modo corretor</span>
        </div>
        <nav className="admin-nav">
          {NAV_ITEMS.map((it) => (
            <button
              key={it.id}
              className={'admin-nav-link ' + (route === it.id || (it.id === 'admin-list' && route === 'admin-edit') ? 'is-active' : '')}
              onClick={() => setRoute(it.id)}
            >
              <span className="ani">{it.icon}</span> {it.label}
            </button>
          ))}
        </nav>
        <div className="admin-side-foot">
          <button className="admin-public-link" onClick={() => setRoute('home')}>
            ↗ Ver site público
          </button>
          <div className="admin-user">
            <div className="admin-user-avatar">
              {corretor?.photoUrl
                ? <img src={corretor.photoUrl} alt={initials} />
                : initials
              }
            </div>
            <div>
              <strong>{corretor?.name ?? '—'}</strong>
              {corretor?.creci && <span>{corretor.creci}</span>}
            </div>
          </div>
          <button className="admin-logout-btn" onClick={onLogout}>
            Sair
          </button>
        </div>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
}
