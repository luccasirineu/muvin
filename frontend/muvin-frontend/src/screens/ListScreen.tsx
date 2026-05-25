import { useState, useMemo } from 'react';
import type { Property, QuickSearch } from '../types';
import { brlCompact } from '../utils';
import { PropertyCard } from '../components/PropertyCard';

interface ListScreenProps {
  openProperty: (id: string) => void;
  properties: Property[];
  initialFilter?: QuickSearch | null;
}

interface Filters {
  type: string;
  priceMin: number;
  priceMax: number;
  purpose: string;
  sort: string;
  q: string;
}

export function ListScreen({ openProperty, properties, initialFilter }: ListScreenProps) {
  const [filters, setFilters] = useState<Filters>({
    type: initialFilter?.type || 'Todos',
    priceMin: 0,
    priceMax: initialFilter?.priceMax ? parseInt(initialFilter.priceMax) : 5000000,
    purpose: 'Todos',
    sort: 'recent',
    q: '',
  });
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');

  const filtered = useMemo(() => {
    let r = properties.slice();
    if (filters.type !== 'Todos') r = r.filter((p) => p.type === filters.type);
    if (filters.purpose !== 'Todos') r = r.filter((p) => p.purpose === filters.purpose);
    r = r.filter((p) => p.price >= filters.priceMin && p.price <= filters.priceMax);
    if (filters.q.trim()) {
      const q = filters.q.toLowerCase();
      r = r.filter((p) => (p.title + ' ' + p.neighborhood + ' ' + p.code).toLowerCase().includes(q));
    }
    if (filters.sort === 'price-asc') r.sort((a, b) => a.price - b.price);
    else if (filters.sort === 'price-desc') r.sort((a, b) => b.price - a.price);
    else if (filters.sort === 'area-desc') r.sort((a, b) => b.area - a.area);
    else r.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    return r;
  }, [properties, filters]);

  return (
    <div className="screen list">
      <div className="list-head">
        <span className="eyebrow">Portfólio</span>
        <h1 className="h1">Imóveis disponíveis</h1>
        <p className="lede">
          {filtered.length} imóve{filtered.length === 1 ? 'l' : 'is'} encontrado{filtered.length === 1 ? '' : 's'} —
          curadoria pessoal do Luccas em São Paulo.
        </p>
      </div>

      <div className="list-controls">
        <div className="filters">
          <div className="filter">
            <label>Tipo</label>
            <select value={filters.type} onChange={(e) => setFilters({ ...filters, type: e.target.value })}>
              <option>Todos</option>
              <option>Apartamento</option>
              <option>Casa</option>
              <option>Comercial</option>
              <option>Terreno</option>
            </select>
          </div>
          <div className="filter">
            <label>Finalidade</label>
            <select value={filters.purpose} onChange={(e) => setFilters({ ...filters, purpose: e.target.value })}>
              <option>Todos</option>
              <option>Venda</option>
              <option>Aluguel</option>
            </select>
          </div>
          <div className="filter filter-price">
            <label>Faixa de preço — até {brlCompact(filters.priceMax)}</label>
            <input
              type="range" min="500000" max="5000000" step="50000"
              value={filters.priceMax}
              onChange={(e) => setFilters({ ...filters, priceMax: parseInt(e.target.value) })}
            />
            <div className="price-ticks">
              <span>R$ 500 mil</span><span>R$ 5 mi</span>
            </div>
          </div>
          <div className="filter">
            <label>Buscar</label>
            <input
              type="text" placeholder="Bairro, código, palavra-chave"
              value={filters.q}
              onChange={(e) => setFilters({ ...filters, q: e.target.value })}
            />
          </div>
        </div>
        <div className="list-toolbar">
          <select className="sort" value={filters.sort} onChange={(e) => setFilters({ ...filters, sort: e.target.value })}>
            <option value="recent">Mais recentes</option>
            <option value="price-asc">Menor preço</option>
            <option value="price-desc">Maior preço</option>
            <option value="area-desc">Maior área</option>
          </select>
          <div className="layout-toggle">
            <button className={layout === 'grid' ? 'is-active' : ''} onClick={() => setLayout('grid')} aria-label="Grade">▦</button>
            <button className={layout === 'list' ? 'is-active' : ''} onClick={() => setLayout('list')} aria-label="Lista">≣</button>
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty">
          <p>Nenhum imóvel bate com seus filtros.</p>
          <button className="btn btn-ghost btn-sm" onClick={() => setFilters({ ...filters, type: 'Todos', priceMax: 5000000, q: '' })}>
            Limpar filtros
          </button>
        </div>
      ) : layout === 'grid' ? (
        <div className="prop-grid prop-grid--lg">
          {filtered.map((p) => <PropertyCard key={p.id} p={p} onOpen={openProperty} />)}
        </div>
      ) : (
        <div className="prop-list">
          {filtered.map((p) => <PropertyCard key={p.id} p={p} onOpen={openProperty} variant="horizontal" />)}
        </div>
      )}
    </div>
  );
}
