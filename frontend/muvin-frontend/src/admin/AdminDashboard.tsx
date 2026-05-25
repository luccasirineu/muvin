import type { Property, Lead, Corretor } from '../types';
import { brl, relTime } from '../utils';
import { PhotoPlaceholder } from '../components/PhotoPlaceholder';
import { StatusPill } from '../components/StatusPill';

interface AdminDashboardProps {
  setRoute: (r: string) => void;
  properties: Property[];
  leads: Lead[];
  setEditingId: (id: string | null) => void;
  corretor?: Corretor | null;
}

function Kpi({ label, value, hint, highlight = false }: { label: string; value: number | string; hint: string; highlight?: boolean }) {
  return (
    <div className={'kpi ' + (highlight ? 'is-highlight' : '')}>
      <div className="kpi-label">{label}</div>
      <div className="kpi-value">{value}</div>
      <div className="kpi-hint">{hint}</div>
    </div>
  );
}

export function AdminDashboard({ setRoute, properties, leads, setEditingId, corretor }: AdminDashboardProps) {
  const available  = properties.filter((p) => p.status === 'Disponível').length;
  const newLeads   = leads.filter((l) => l.status === 'Novo').length;
  const inProgress = leads.filter((l) => l.status === 'Em contato' || l.status === 'Negociação').length;
  const recentLeads = leads.slice(0, 4);
  const shortName = corretor?.name.split(' ')[0];

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <div>
          <span className="eyebrow">Painel</span>
          <h1 className="h1">Olá{shortName ? `, ${shortName}` : ''}</h1>
          <p className="muted">
            Você tem <strong>{newLeads} lead{newLeads !== 1 ? 's' : ''} novo{newLeads !== 1 ? 's' : ''}</strong> aguardando resposta.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => { setEditingId(null); setRoute('admin-edit'); }}>
          + Novo imóvel
        </button>
      </div>

      <section className="kpis">
        <Kpi label="Imóveis ativos" value={available} hint={`${properties.length} cadastrados no total`} />
        <Kpi label="Leads novos" value={newLeads} hint="aguardando primeiro contato" highlight />
        <Kpi label="Em andamento" value={inProgress} hint="em contato ou negociação" />
        <Kpi label="Total de leads" value={leads.length} hint="todos os status" />
      </section>

      <section className="admin-grid">
        <div className="admin-card">
          <div className="admin-card-head">
            <h3 className="h3-serif">Leads recentes</h3>
            <button className="link-arrow" onClick={() => setRoute('admin-leads')}>Ver todos →</button>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Interesse</th>
                <th>Recebido</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentLeads.length === 0 && (
                <tr><td colSpan={4} className="muted" style={{ padding: '1rem' }}>Nenhum lead ainda.</td></tr>
              )}
              {recentLeads.map((l) => (
                <tr key={l.id}>
                  <td><strong>{l.name}</strong><div className="td-sub">{l.phone}</div></td>
                  <td><div className="td-sub">{l.message ? l.message.slice(0, 40) + (l.message.length > 40 ? '…' : '') : '—'}</div></td>
                  <td>{relTime(l.receivedAt)}</td>
                  <td><StatusPill v={l.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="admin-card">
          <div className="admin-card-head">
            <h3 className="h3-serif">Imóveis em destaque</h3>
            <button className="link-arrow" onClick={() => setRoute('admin-list')}>Ver todos →</button>
          </div>
          <div className="mini-prop-list">
            {properties.filter((p) => p.featured).slice(0, 3).map((p) => (
              <button key={p.id} className="mini-prop" onClick={() => { setEditingId(p.id); setRoute('admin-edit'); }}>
                <div className="mini-prop-thumb">
                  <PhotoPlaceholder
                    label={p.photos[0]?.label || p.code}
                    tone={p.photos[0]?.tone || 'neutral'}
                    url={p.photos[0]?.url}
                    aspect="4/3"
                  />
                </div>
                <div className="mini-prop-body">
                  <div className="mini-prop-code">{p.code}</div>
                  <div className="mini-prop-title">{p.title}</div>
                  <div className="mini-prop-meta">{p.neighborhood} · {brl(p.price)}</div>
                </div>
              </button>
            ))}
            {properties.filter((p) => p.featured).length === 0 && (
              <p className="muted" style={{ padding: '0.5rem 0' }}>Nenhum imóvel em destaque.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
