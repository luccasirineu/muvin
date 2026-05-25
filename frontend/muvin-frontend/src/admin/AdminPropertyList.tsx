import { useState } from 'react';
import type { Property } from '../types';
import { brl, fmtDate } from '../utils';
import { PhotoPlaceholder } from '../components/PhotoPlaceholder';
import { StatusPill } from '../components/StatusPill';
import { ConfirmModal } from '../components/ConfirmModal';

interface AdminPropertyListProps {
  setRoute: (r: string) => void;
  properties: Property[];
  setEditingId: (id: string | null) => void;
  deleteProperty: (id: string) => void;
}

export function AdminPropertyList({ setRoute, properties, setEditingId, deleteProperty }: AdminPropertyListProps) {
  const [q, setQ] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [pendingDelete, setPendingDelete] = useState<Property | null>(null);

  const filtered = properties.filter((p) => {
    if (statusFilter !== 'Todos' && p.status !== statusFilter) return false;
    if (q.trim()) {
      const s = q.toLowerCase();
      if (!(p.title + ' ' + p.neighborhood + ' ' + p.code).toLowerCase().includes(s)) return false;
    }
    return true;
  });

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <div>
          <span className="eyebrow">Portfólio</span>
          <h1 className="h1">Imóveis</h1>
          <p className="muted">{filtered.length} de {properties.length} imóveis</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setEditingId(null); setRoute('admin-edit'); }}>
          + Novo imóvel
        </button>
      </div>

      <div className="admin-toolbar">
        <input
          type="text"
          placeholder="Buscar por código, bairro, título…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option>Todos</option>
          <option>Disponível</option>
          <option>Vendido</option>
          <option>Alugado</option>
          <option>Inativo</option>
        </select>
      </div>

      <div className="admin-card no-pad">
        <table className="data-table data-table--admin">
          <thead>
            <tr>
              <th></th>
              <th>Código</th>
              <th>Imóvel</th>
              <th>Tipo</th>
              <th>Preço</th>
              <th>Status</th>
              <th>Publicado</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id}>
                <td className="tcell-thumb">
                  <div className="tt-thumb">
                    <PhotoPlaceholder
                      label={p.photos[0]?.label || 'foto'}
                      tone={p.photos[0]?.tone || 'neutral'}
                      url={p.photos[0]?.url}
                      aspect="4/3"
                    />
                  </div>
                </td>
                <td className="tcell-code">{p.code}</td>
                <td>
                  <strong>{p.title}</strong>
                  <div className="td-sub">{p.neighborhood} · {p.bedrooms > 0 ? `${p.bedrooms} dorm · ` : ''}{p.area} m²</div>
                </td>
                <td>{p.type}</td>
                <td className="td-price">{brl(p.price)}</td>
                <td><StatusPill v={p.status} /></td>
                <td className="td-sub">{fmtDate(p.publishedAt)}</td>
                <td className="tcell-actions">
                  <button className="row-btn" onClick={() => { setEditingId(p.id); setRoute('admin-edit'); }}>Editar</button>
                  <button
                    className="row-btn row-btn-danger"
                    onClick={() => setPendingDelete(p)}
                  >
                    Remover
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="empty"><p>Nenhum imóvel encontrado.</p></div>
        )}
      </div>

      {pendingDelete && (
        <ConfirmModal
          title="Remover imóvel"
          description={`Tem certeza que deseja remover "${pendingDelete.code} — ${pendingDelete.title}"? Esta ação não pode ser desfeita.`}
          confirmLabel="Sim, remover"
          onConfirm={() => { deleteProperty(pendingDelete.id); setPendingDelete(null); }}
          onCancel={() => setPendingDelete(null)}
        />
      )}
    </div>
  );
}
