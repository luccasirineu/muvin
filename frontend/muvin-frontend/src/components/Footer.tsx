import type { Corretor } from '../types';
import { phoneRaw } from '../utils';
import { Logo } from './Logo';

interface FooterProps {
  setRoute: (r: string) => void;
  corretor?: Corretor | null;
}

export function Footer({ setRoute, corretor }: FooterProps) {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-col footer-brand">
          <Logo size={30} />
          <p className="footer-bio">
            Corretor de imóveis em São Paulo.<br />
            Atendimento sob medida, da primeira visita à escritura.
          </p>
        </div>
        <div className="footer-col">
          <h4>Navegar</h4>
          <button onClick={() => setRoute('home')}>Início</button>
          <button onClick={() => setRoute('list')}>Imóveis</button>
          <button onClick={() => setRoute('about')}>Sobre</button>
          <button onClick={() => setRoute('contact')}>Contato</button>
        </div>
        <div className="footer-col">
          <h4>Contato</h4>
          {corretor?.phone && (
            <a href={`https://wa.me/${phoneRaw(corretor.phone)}`} target="_blank" rel="noopener">{corretor.phone}</a>
          )}
          {corretor?.email && (
            <a href={`mailto:${corretor.email}`}>{corretor.email}</a>
          )}
        </div>
        <div className="footer-col">
          <h4>Conformidade</h4>
          {corretor?.creci && <span>{corretor.creci}</span>}
          <button onClick={() => setRoute('privacy')}>Política de privacidade (LGPD)</button>
          <button onClick={() => setRoute('terms')}>Termos de uso</button>
        </div>
      </div>
      <div className="footer-foot">
        <span>© 2026 Muvin Imóveis</span>
        <button className="footer-admin-link" onClick={() => setRoute('admin-dashboard')}>
          Acesso do corretor →
        </button>
      </div>
    </footer>
  );
}
