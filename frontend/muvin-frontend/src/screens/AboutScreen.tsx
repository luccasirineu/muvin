import type { Corretor } from '../types';
import { BROKER } from '../broker';
import { phoneRaw } from '../utils';
import { PhotoPlaceholder } from '../components/PhotoPlaceholder';
import { WAIcon } from '../components/WAIcon';

const TESTIMONIALS = [
  { quote: 'Procurei o Luccas porque queria alguém que conhecesse de verdade os Jardins. Em três semanas a gente fechou negócio num apartamento que nem estava anunciado.', who: 'Marina V., compradora · Jardim Paulista' },
  { quote: 'Vendi minha casa em 22 dias, com proposta acima do que eu esperava. O acompanhamento na escritura foi impecável.', who: 'Roberto T., vendedor · Vila Madalena' },
  { quote: 'Como investidor, preciso de agilidade e dados. Luccas entrega os dois — análise de m², histórico do bairro, projeção de valorização. Já fechei três operações com ele.', who: 'Henrique S., investidor · Pinheiros' },
];

interface AboutScreenProps {
  setRoute: (r: string) => void;
  corretor?: Corretor | null;
}

export function AboutScreen({ setRoute, corretor }: AboutScreenProps) {
  return (
    <div className="screen about">
      <section className="about-hero">
        <div className="about-hero-text">
          {corretor?.name && <span className="eyebrow">Sobre · {corretor.name}</span>}
          <h1 className="display">Corretor independente,<br /><em>atendimento pessoal</em>.</h1>
          <p className="lede">
            Comecei no mercado em 2015, depois de 6 anos em planejamento financeiro. A virada veio quando percebi
            que comprar um imóvel é, antes de tudo, uma decisão de vida — e que a maioria das pessoas estava sendo
            mal acompanhada nessa hora.
          </p>
          <p className="lede">
            Desde então atendo um número limitado de clientes por vez, sempre pessoalmente. Sem call center, sem
            estagiário, sem mensagem automática. Quando você manda um WhatsApp, sou eu que respondo.
          </p>
          <div className="hero-cta">
            <button className="btn btn-primary" onClick={() => setRoute('contact')}>Falar comigo</button>
            <button className="btn btn-ghost" onClick={() => setRoute('list')}>Ver imóveis</button>
          </div>
        </div>
        <div className="about-photo">
          {corretor?.photoUrl
            ? <img src={corretor.photoUrl} alt={corretor.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit' }} />
            : <PhotoPlaceholder label="luccas · retrato editorial" tone="warm" aspect="3/4" style={{ height: '100%' }} />
          }
        </div>
      </section>

      <section className="section credentials">
        <div className="section-head">
          <div>
            <span className="eyebrow">Credenciais</span>
            <h2 className="h2">Conformidade e registro profissional</h2>
          </div>
        </div>
        <div className="cred-grid">
          {corretor?.creci && (
            <div className="cred">
              <span className="cred-label">Registro CRECI</span>
              <strong className="cred-value">{corretor.creci}</strong>
              <span className="cred-meta">Conselho Regional dos Corretores de Imóveis · 2º Região (SP)</span>
            </div>
          )}
          <div className="cred">
            <span className="cred-label">Atendimento</span>
            <strong className="cred-value">Seg–Sáb · 9h–20h</strong>
            <span className="cred-meta">Resposta em até {BROKER.avgResponseHours}h em horário comercial</span>
          </div>
        </div>
      </section>

      <section className="section testimonials">
        <div className="section-head">
          <div>
            <span className="eyebrow">O que dizem</span>
            <h2 className="h2">Quem comprou comigo</h2>
          </div>
        </div>
        <div className="testi-grid">
          {TESTIMONIALS.map((t, i) => (
            <figure key={i} className="testi">
              <blockquote>"{t.quote}"</blockquote>
              <figcaption>— {t.who}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="cta-band">
        <div className="cta-band-inner">
          <h2 className="h2">Vamos conversar?</h2>
          <p className="lede">Conta o que você procura.</p>
          <div className="hero-cta">
            <button className="btn btn-primary" onClick={() => setRoute('contact')}>Mandar mensagem</button>
            {corretor?.phone && (
              <a className="btn btn-ghost" href={`https://wa.me/${phoneRaw(corretor.phone)}`} target="_blank" rel="noopener">
                <WAIcon size={15} /> WhatsApp
              </a>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
