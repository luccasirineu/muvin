import { useState, Fragment } from 'react';
import type { Lead, LeadStatus } from '../types';
import { relTime, fmtDate } from '../utils';
import { StatusPill } from '../components/StatusPill';
import { WAIcon } from '../components/WAIcon';

interface AdminLeadsProps {
  leads: Lead[];
  setLeadStatus: (id: string, status: LeadStatus) => void;
}

const FILTERS = ['Todos', 'Novo', 'Em contato', 'Negociação', 'Arquivado', 'Fechado'] as const;
const STATUS_OPTIONS: LeadStatus[] = ['Novo', 'Em contato', 'Negociação', 'Arquivado', 'Fechado'];

export function AdminLeads({ leads, setLeadStatus }: AdminLeadsProps) {
  const [filter, setFilter] = useState('Todos');
  const [openLead, setOpenLead] = useState<string | null>(null);
  const filtered = filter === 'Todos' ? leads : leads.filter((l) => l.status === filter);
  const newCount = leads.filter((l) => l.status === 'Novo').length;

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <div>
          <span className="eyebrow">Inbox</span>
          <h1 className="h1">Leads recebidos</h1>
          <p className="muted">{newCount} novo{newCount !== 1 ? 's' : ''} · {leads.length} no total</p>
        </div>
      </div>

      <div className="admin-toolbar">
        {FILTERS.map((f) => (
          <button
            key={f}
            className={'chip-btn ' + (filter === f ? 'is-active' : '')}
            onClick={() => setFilter(f)}
          >
            {f}
            <span className="chip-count">
              {f === 'Todos' ? leads.length : leads.filter((l) => l.status === f).length}
            </span>
          </button>
        ))}
      </div>

      <div className="leads-layout">
        <div className="admin-card no-pad">
          <table className="data-table data-table--admin">
            <thead>
              <tr>
                <th>Lead</th>
                <th>Mensagem</th>
                <th>Recebido</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((l) => {
                const isOpen = openLead === l.id;
                return (
                  <Fragment key={l.id}>
                    <tr className={isOpen ? 'is-open' : ''} onClick={() => setOpenLead(isOpen ? null : l.id)}>
                      <td>
                        <strong>{l.name}</strong>
                        <div className="td-sub">{l.phone} · {l.email}</div>
                      </td>
                      <td>
                        <div className="td-sub">
                          {l.message ? l.message.slice(0, 50) + (l.message.length > 50 ? '…' : '') : <em>sem mensagem</em>}
                        </div>
                      </td>
                      <td className="td-sub">{relTime(l.receivedAt)}</td>
                      <td><StatusPill v={l.status} /></td>
                      <td className="tcell-actions">
                        <a
                          className="row-btn"
                          href={`https://wa.me/${l.phone.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <WAIcon size={12} /> WhatsApp
                        </a>
                      </td>
                    </tr>
                    {isOpen && (
                      <tr className="lead-detail-row">
                        <td colSpan={5}>
                          <div className="lead-detail">
                            <div className="lead-msg">
                              <span className="muted">Mensagem · {fmtDate(l.receivedAt)}</span>
                              <p>"{l.message || 'Sem mensagem.'}"</p>
                            </div>
                            <div className="lead-actions">
                              <span className="muted">Mudar status</span>
                              <div className="seg">
                                {STATUS_OPTIONS.map((s) => (
                                  <button
                                    key={s}
                                    className={l.status === s ? 'is-active' : ''}
                                    onClick={(e) => { e.stopPropagation(); setLeadStatus(l.id, s); }}
                                  >
                                    {s}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="empty"><p>Nenhum lead nesse status.</p></div>
          )}
        </div>
      </div>
    </div>
  );
}
