import { useState, useEffect } from 'react';
import type { Property, QuickSearch, Corretor } from '../types';
import { BROKER } from '../broker';
import { brl, phoneRaw } from '../utils';
import * as api from '../services/api';
import type { BairroStats } from '../services/api';
import { PhotoPlaceholder } from '../components/PhotoPlaceholder';
import { PropertyCard } from '../components/PropertyCard';
import { WAIcon } from '../components/WAIcon';

const TONES = ['warm', 'neutral', 'cool'] as const;

interface HomeScreenProps {
  setRoute: (r: string) => void;
  openProperty: (id: string) => void;
  properties: Property[];
  onSearch: (filter: QuickSearch) => void;
  corretor?: Corretor | null;
}

export function HomeScreen({ setRoute, openProperty, properties, onSearch, corretor }: HomeScreenProps) {
  const featured = properties.filter((p) => p.featured).slice(0, 3);
  const [quickSearch, setQuickSearch] = useState<QuickSearch>({ type: 'Todos', priceMax: '' });
  const [bairros, setBairros] = useState<BairroStats[]>([]);

  useEffect(() => {
    api.getBairros(6).then(setBairros).catch(() => setBairros([]));
  }, []);

  function handleSearch() {
    onSearch(quickSearch);
    setRoute('list');
  }

  return (
    <div className="screen home">
      <section className="hero">
        <div className="hero-text">
          <span className="eyebrow">Imobiliária boutique · São Paulo</span>
          <h1 className="display">
            O imóvel certo,<br />
            <em>do jeito certo</em>.
          </h1>
          <p className="lede">
            Há {BROKER.yearsActive} anos ajudando famílias e investidores a encontrar e negociar
            apartamentos, casas e salas comerciais nas regiões centro e sul de São Paulo.
            Atendimento direto, sem intermediários.
          </p>
          <div className="hero-cta">
            <button className="btn btn-primary" onClick={() => setRoute('list')}>
              Ver imóveis disponíveis
            </button>
            {corretor?.phone && (
              <a className="btn btn-ghost" href={`https://wa.me/${phoneRaw(corretor.phone)}`} target="_blank" rel="noopener">
                <WAIcon size={15} /> Fale comigo
              </a>
            )}
          </div>

          <div className="quick-search">
            <div className="qs-row">
              <label>Tipo</label>
              <select value={quickSearch.type} onChange={(e) => setQuickSearch({ ...quickSearch, type: e.target.value })}>
                <option>Todos</option>
                <option>Apartamento</option>
                <option>Casa</option>
                <option>Comercial</option>
                <option>Terreno</option>
              </select>
            </div>
            <div className="qs-row">
              <label>Até</label>
              <select value={quickSearch.priceMax} onChange={(e) => setQuickSearch({ ...quickSearch, priceMax: e.target.value })}>
                <option value="">Qualquer preço</option>
                <option value="1000000">R$ 1 mi</option>
                <option value="2000000">R$ 2 mi</option>
                <option value="3000000">R$ 3 mi</option>
                <option value="5000000">R$ 5 mi</option>
              </select>
            </div>
            <button className="btn btn-primary qs-go" onClick={handleSearch}>
              Buscar →
            </button>
          </div>
        </div>
        <button
          className={'hero-photo' + (featured[0] ? ' hero-photo-clickable' : '')}
          onClick={() => featured[0] && openProperty(featured[0].id)}
          disabled={!featured[0]}
          aria-label={featured[0] ? `Ver detalhes de ${featured[0].title}` : undefined}
        >
          <PhotoPlaceholder
            label={featured[0]?.title ?? 'imóvel em destaque'}
            tone="warm"
            url={featured[0]?.photos[0]?.url}
            aspect="3/4"
            style={{ height: '100%' }}
          />
          {featured[0] && (
            <div className="hero-photo-tag">
              <div className="hpt-label">Em destaque</div>
              <div className="hpt-title">{featured[0].title}</div>
              <div className="hpt-price">{brl(featured[0].price)}</div>
            </div>
          )}
        </button>
      </section>

      <section className="stat-row">
        <div className="stat">
          <div className="stat-num">{BROKER.yearsActive}</div>
          <div className="stat-lbl">Anos de mercado</div>
        </div>
        <div className="stat">
          <div className="stat-num">{BROKER.closedDeals}+</div>
          <div className="stat-lbl">Negócios fechados</div>
        </div>
        <div className="stat">
          <div className="stat-num">{BROKER.avgResponseHours}h</div>
          <div className="stat-lbl">Tempo médio de resposta</div>
        </div>
        {corretor?.creci && (
          <div className="stat">
            <div className="stat-num">{corretor.creci.replace('CRECI-SP ', '')}</div>
            <div className="stat-lbl">CRECI-SP</div>
          </div>
        )}
      </section>

      <section className="section">
        <div className="section-head">
          <div>
            <span className="eyebrow">Selecionados pelo Luccas</span>
            <h2 className="h2">Destaques da semana</h2>
          </div>
          <button className="link-arrow" onClick={() => setRoute('list')}>
            Ver todos os imóveis →
          </button>
        </div>
        <div className="prop-grid">
          {featured.map((p) => (
            <PropertyCard key={p.id} p={p} onOpen={openProperty} />
          ))}
        </div>
      </section>

      <section className="section neighborhoods">
        <div className="section-head">
          <div>
            <span className="eyebrow">Onde atuamos</span>
            <h2 className="h2">Bairros que conheço de cor</h2>
          </div>
        </div>
        <div className="hood-grid">
          {bairros.map((b, i) => {
            const cover = properties.find(
              (p) => p.neighborhood.toLowerCase() === b.bairro.toLowerCase() && p.photos[0]?.url
            )?.photos[0]?.url;
            return (
              <button key={b.bairro} className="hood-card" onClick={() => setRoute('list')}>
                <PhotoPlaceholder label={b.bairro.toLowerCase()} tone={TONES[i % TONES.length]} url={cover} aspect="3/2" />
                <div className="hood-card-body">
                  <span className="hood-name">{b.bairro}</span>
                  <span className="hood-count">{b.quantidade} imóve{b.quantidade === 1 ? 'l' : 'is'}</span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <section className="section process">
        <div className="section-head">
          <div>
            <span className="eyebrow">Como trabalho</span>
            <h2 className="h2">Três conversas até as chaves</h2>
          </div>
        </div>
        <div className="process-steps">
          <div className="step">
            <div className="step-num">01</div>
            <h3>Conversa inicial</h3>
            <p>Entendo o que você procura, número de quartos, bairros, faixa de preço, prazo. Sem pressa, sem checklist genérico.</p>
          </div>
          <div className="step">
            <div className="step-num">02</div>
            <h3>Curadoria de visitas</h3>
            <p>Mando 3 a 6 opções selecionadas, agendamos as visitas e vou pessoalmente em cada uma com você.</p>
          </div>
          <div className="step">
            <div className="step-num">03</div>
            <h3>Negociação &amp; fechamento</h3>
            <p>Cuido da proposta, contrato, documentação e acompanho a escritura. Você só precisa decidir e assinar.</p>
          </div>
        </div>
      </section>

      <section className="cta-band">
        <div className="cta-band-inner">
          <h2 className="h2">Procurando algo específico?</h2>
          <p className="lede">Me conta o que você procura,  bairro, faixa de preço, prazo e eu busco no meu portfólio atual.</p>
          <div className="hero-cta">
            <button className="btn btn-primary" onClick={() => setRoute('contact')}>Falar com o corretor</button>
            {corretor?.phone && (
              <a className="btn btn-ghost" href={`https://wa.me/${phoneRaw(corretor.phone)}`} target="_blank" rel="noopener">
                <WAIcon size={15} /> WhatsApp direto
              </a>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
