import { useState } from 'react';
import type { Lead, Corretor } from '../types';
import { BROKER } from '../broker';
import { phoneRaw } from '../utils';
import { WAIcon } from '../components/WAIcon';

type LeadPayload = Omit<Lead, 'id' | 'receivedAt' | 'status'>;

interface ContactScreenProps {
  onLeadSubmit: (payload: LeadPayload) => Promise<void> | void;
  corretor?: Corretor | null;
}

const INTERESTS = ['Comprar', 'Vender', 'Alugar', 'Investir'] as const;

export function ContactScreen({ onLeadSubmit, corretor }: ContactScreenProps) {
  const [form, setForm] = useState({ name: '', phone: '', email: '', interest: 'Comprar', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onLeadSubmit({
        name: form.name,
        phone: form.phone,
        email: form.email,
        propertyId: null,
        message: form.message || `Interesse em ${form.interest}`,
        desejo: form.interest,
      });
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="screen contact">
      <section className="contact-hero">
        <div className="contact-text">
          <span className="eyebrow">Contato</span>
          <h1 className="display">Como posso<br /><em>ajudar você?</em></h1>
          <p className="lede">
            Conta sobre o imóvel que você procura, ou que quer vender. Respondo pessoalmente em até
            {' '}{BROKER.avgResponseHours}h em horário comercial.
          </p>

          <div className="contact-channels">
            {corretor?.phone && (
              <a className="ch" href={`https://wa.me/${phoneRaw(corretor.phone)}`} target="_blank" rel="noopener">
                <span className="ch-icon"><WAIcon size={20} /></span>
                <div>
                  <div className="ch-label">WhatsApp</div>
                  <strong>{corretor.phone}</strong>
                </div>
              </a>
            )}
            {corretor?.email && (
              <a className="ch" href={`mailto:${corretor.email}`}>
                <span className="ch-icon">✉</span>
                <div>
                  <div className="ch-label">E-mail</div>
                  <strong>{corretor.email}</strong>
                </div>
              </a>
            )}
            <div className="ch">
              <span className="ch-icon">📍</span>
              <div>
                <div className="ch-label">Atendimento presencial</div>
                <strong>Rua Tabapuã, 821 · Itaim Bibi</strong>
                <span className="ch-meta">com agendamento prévio</span>
              </div>
            </div>
          </div>
        </div>

        <div className="contact-form-wrap">
          {submitted ? (
            <div className="form-success big">
              <h2 className="h3-serif">Recebi sua mensagem</h2>
              <p>Obrigado, {form.name.split(' ')[0] || 'tudo bem'}. Vou te responder em até {BROKER.avgResponseHours}h — pelo WhatsApp que você informou.</p>
              <button
                className="btn btn-ghost"
                onClick={() => { setSubmitted(false); setForm({ name: '', phone: '', email: '', interest: 'Comprar', message: '' }); }}
              >
                Enviar outra mensagem
              </button>
            </div>
          ) : (
            <form className="contact-form" onSubmit={submit}>
              <h2 className="h3-serif">Manda uma mensagem</h2>
              <div className="form-row">
                <label>Eu quero</label>
                <div className="radio-row">
                  {INTERESTS.map((op) => (
                    <label key={op} className={'radio-chip ' + (form.interest === op ? 'is-active' : '')}>
                      <input type="radio" name="interest" value={op} checked={form.interest === op} onChange={() => setForm({ ...form, interest: op })} />
                      {op}
                    </label>
                  ))}
                </div>
              </div>
              <div className="form-row">
                <label>Nome</label>
                <input required type="text" placeholder="Como você se chama?" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="form-grid">
                <div className="form-row">
                  <label>WhatsApp</label>
                  <input required type="tel" placeholder="(11) 9 0000-0000" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
                <div className="form-row">
                  <label>E-mail</label>
                  <input required type="email" placeholder="seu@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
              </div>
              <div className="form-row">
                <label>Mensagem</label>
                <textarea rows={5} placeholder="Conta um pouco do que você procura — bairros, faixa de preço, prazo, número de quartos…" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
              </div>
              <label className="check">
                <input required type="checkbox" defaultChecked />
                <span>Autorizo o contato e o tratamento dos dados conforme a <a href="#" onClick={(e) => e.preventDefault()}>LGPD</a>.</span>
              </label>
              <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
                {submitting ? 'Enviando…' : 'Enviar mensagem'}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
