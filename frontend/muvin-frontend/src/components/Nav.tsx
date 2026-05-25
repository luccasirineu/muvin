import { useState } from 'react';
import type { Corretor } from '../types';
import { phoneRaw } from '../utils';
import { Logo } from './Logo';
import { WAIcon } from './WAIcon';

interface NavProps {
  route: string;
  setRoute: (r: string) => void;
  corretor?: Corretor | null;
}

const NAV_ITEMS = [
  { id: 'home', label: 'Início' },
  { id: 'list', label: 'Imóveis' },
  { id: 'about', label: 'Sobre' },
  { id: 'contact', label: 'Contato' },
];

export function Nav({ route, setRoute, corretor }: NavProps) {
  const isAdmin = route.startsWith('admin');
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="nav-wrap">
      <div className="nav">
        <button className="nav-logo" onClick={() => setRoute('home')} aria-label="Início">
          <Logo size={26} />
        </button>
        <nav className="nav-links">
          {NAV_ITEMS.map((it) => (
            <button
              key={it.id}
              className={'nav-link ' + (route === it.id || (it.id === 'list' && route === 'detail') ? 'is-active' : '')}
              onClick={() => setRoute(it.id)}
            >
              {it.label}
            </button>
          ))}
        </nav>
        <div className="nav-right">
          {!isAdmin ? (
            corretor?.phone ? (
              <a className="btn btn-ghost btn-sm wa-mini" href={`https://wa.me/${phoneRaw(corretor.phone)}`} target="_blank" rel="noopener">
                <WAIcon size={14} /> {corretor.phone}
              </a>
            ) : null
          ) : (
            <button className="btn btn-ghost btn-sm" onClick={() => setRoute('home')}>
              ↗ Ver site público
            </button>
          )}
          <button className="nav-burger" onClick={() => setMobileOpen((o) => !o)} aria-label="Menu">
            <span /><span /><span />
          </button>
        </div>
      </div>
      {mobileOpen && (
        <div className="nav-mobile">
          {NAV_ITEMS.map((it) => (
            <button key={it.id} className="nav-mobile-link" onClick={() => { setRoute(it.id); setMobileOpen(false); }}>
              {it.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
