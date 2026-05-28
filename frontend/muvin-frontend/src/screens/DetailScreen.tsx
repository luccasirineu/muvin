import { useState } from 'react';
import type { Property, Lead, Corretor } from '../types';
import { BROKER } from '../broker';
import { brl, phoneRaw } from '../utils';
import { PhotoPlaceholder } from '../components/PhotoPlaceholder';
import { MapEmbed } from '../components/MapEmbed';
import { PropertyCard } from '../components/PropertyCard';
import { WAIcon } from '../components/WAIcon';

type LeadPayload = Omit<Lead, 'id' | 'receivedAt' | 'status'>;

interface DetailScreenProps {
  propertyId: string;
  setRoute: (r: string) => void;
  openProperty: (id: string) => void;
  properties: Property[];
  onLeadSubmit: (payload: LeadPayload) => Promise<void> | void;
  corretor?: Corretor | null;
}

function SpecBlock({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="spec">
      <div className="spec-value">{value}</div>
      <div className="spec-label">{label}</div>
    </div>
  );
}

export function DetailScreen({ propertyId, setRoute, openProperty, properties, onLeadSubmit, corretor }: DetailScreenProps) {
  const p = properties.find((x) => x.id === propertyId) ?? properties[0];
  const [activePhoto, setActivePhoto] = useState(0);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    message: p ? `Olá, tenho interesse no imóvel ${p.code} — ${p.title}.` : '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const related = properties.filter((x) => x.id !== p?.id && x.type === p?.type).slice(0, 3);

  if (!p) return <div className="screen detail"><p className="muted">Imóvel não encontrado.</p></div>;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onLeadSubmit({ ...form, propertyId: p.id, desejo: 'Comprar' });
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  }

  const cover = p.photos[activePhoto];
  const shortName = corretor?.name.split(' ')[0];
  const waText = `Olá${shortName ? ` ${shortName}` : ''}, tenho interesse no ${p.code} — ${p.title}.`;

  return (
    <div className="screen detail">
      <div className="crumbs">
        <button onClick={() => setRoute('home')}>Início</button>
        <span>/</span>
        <button onClick={() => setRoute('list')}>Imóveis</button>
        <span>/</span>
        <span className="crumb-current">{p.code}</span>
      </div>

      <div className="detail-gallery">
        <div className="gallery-main">
          <PhotoPlaceholder
            label={cover?.label || 'foto'}
            tone={cover?.tone || 'neutral'}
            url={cover?.url}
            aspect="16/10"
            style={{ height: '100%' }}
          />
          {p.photos.length > 0 && (
            <div className="gallery-counter">{activePhoto + 1} / {p.photos.length}</div>
          )}
        </div>
        {p.photos.length > 1 && (
          <div className="gallery-thumbs">
            {p.photos.map((ph, i) => (
              <button key={i} className={'gthumb ' + (i === activePhoto ? 'is-active' : '')} onClick={() => setActivePhoto(i)}>
                <PhotoPlaceholder label={ph.label} tone={ph.tone} url={ph.url} aspect="4/3" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="detail-body">
        <div className="detail-main">
          <div className="detail-top">
            <span className="eyebrow">{p.type} · {p.purpose} · cód. {p.code}</span>
            <h1 className="h1">{p.title}</h1>
            <div className="detail-loc">{p.address} · {p.neighborhood} · {p.city}/{p.state}</div>
          </div>

          <div className="detail-specs">
            {p.bedrooms > 0 && <SpecBlock label="Dormitórios" value={p.bedrooms} />}
            {p.suites > 0 && <SpecBlock label="Suítes" value={p.suites} />}
            {p.bathrooms > 0 && <SpecBlock label="Banheiros" value={p.bathrooms} />}
            {p.parking > 0 && <SpecBlock label="Vagas" value={p.parking} />}
            <SpecBlock label="Área útil" value={`${p.area} m²`} />
          </div>

          {p.description && (
            <div className="detail-desc">
              <h3 className="h3-serif">Sobre este imóvel</h3>
              <p>{p.description}</p>
            </div>
          )}

          {p.features.length > 0 && (
            <div className="detail-features">
              <h3 className="h3-serif">Comodidades</h3>
              <div className="feature-list">
                {p.features.map((f) => <span key={f} className="chip">{f}</span>)}
              </div>
            </div>
          )}

          <div className="detail-costs">
            <h3 className="h3-serif">Custos mensais estimados</h3>
            <div className="costs-row">
              {p.condo > 0 && <div className="cost-item"><span>Condomínio</span><strong>{brl(p.condo)}</strong></div>}
              {p.iptu > 0 && <div className="cost-item"><span>IPTU mensal</span><strong>{brl(p.iptu)}</strong></div>}
            </div>
          </div>

          <div className="detail-map">
            <h3 className="h3-serif">Localização</h3>
            <div className="map-stub">
              <MapEmbed address={p.address} neighborhood={p.neighborhood} city={p.city} state={p.state} />
            </div>
          </div>
        </div>

        <aside className="detail-side">
          <div className="side-sticky">
            <div className="side-price">
              <span className="side-purpose">{p.purpose}</span>
              <div className="side-price-value">{brl(p.price)}</div>
              {p.condo > 0 && <span className="side-price-meta">+ {brl(p.condo)} condomínio</span>}
            </div>

            {corretor?.phone && (
              <a
                className="btn btn-wa btn-block"
                href={`https://wa.me/${phoneRaw(corretor.phone)}?text=${encodeURIComponent(waText)}`}
                target="_blank"
                rel="noopener"
              >
                <WAIcon size={16} /> Conversar no WhatsApp
              </a>
            )}

            <div className="side-divider"><span>ou envie uma mensagem</span></div>

            {submitted ? (
              <div className="form-success">
                <h4>Mensagem enviada</h4>
                <p>Resposta em até {BROKER.avgResponseHours}h em horário comercial.</p>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => { setSubmitted(false); setForm({ ...form, name: '', phone: '', email: '' }); }}
                >
                  Enviar outra mensagem
                </button>
              </div>
            ) : (
              <form className="lead-form" onSubmit={submit}>
                <input required type="text" placeholder="Seu nome" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                <input required type="tel" placeholder="WhatsApp (11) 9 0000-0000" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                <input required type="email" placeholder="E-mail" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                <textarea rows={3} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
                <label className="check">
                  <input type="checkbox" defaultChecked />
                  <span>Autorizo o contato e o tratamento dos dados conforme a LGPD.</span>
                </label>
                <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
                  {submitting ? 'Enviando…' : 'Tenho interesse'}
                </button>
              </form>
            )}

            {(corretor?.name || corretor?.creci) && (
              <div className="side-broker">
                <div className="side-broker-photo">
                  {corretor.photoUrl
                    ? <img src={corretor.photoUrl} alt={corretor.name ?? 'corretor'} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit' }} />
                    : <PhotoPlaceholder label="corretor · retrato" tone="warm" aspect="1/1" />
                  }
                </div>
                <div>
                  {corretor.name && <strong>{corretor.name}</strong>}
                  {corretor.creci && <span>{corretor.creci}</span>}
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="section related">
          <div className="section-head">
            <h2 className="h2">Imóveis parecidos</h2>
          </div>
          <div className="prop-grid">
            {related.map((r) => <PropertyCard key={r.id} p={r} onOpen={openProperty} />)}
          </div>
        </section>
      )}
    </div>
  );
}
