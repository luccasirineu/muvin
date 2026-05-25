import { useState } from 'react';
import { esqueciSenha } from '../services/api';

interface EsqueciSenhaModalProps {
  onClose: () => void;
}

export function EsqueciSenhaModal({ onClose }: EsqueciSenhaModalProps) {
  const [email, setEmail] = useState('');
  const [cpfDigits, setCpfDigits] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^\d{3}$/.test(cpfDigits)) {
      setError('Informe exatamente 3 dígitos numéricos do CPF.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await esqueciSenha(email, cpfDigits);
      setSent(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : '';
      if (msg.includes('503')) {
        setError('Serviço de e-mail indisponível no momento. Tente novamente em alguns minutos.');
      } else {
        setError('Erro ao processar a solicitação. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        {sent ? (
          <>
            <div className="modal-icon modal-icon--success">✉</div>
            <h2 className="modal-title">Verifique seu e-mail</h2>
            <p className="modal-desc">
              Se os dados informados forem válidos, você receberá uma nova senha em instantes.
              Lembre-se de verificar a pasta de spam.
            </p>
            <div className="modal-actions" style={{ justifyContent: 'center' }}>
              <button className="btn btn-primary" onClick={onClose}>Fechar</button>
            </div>
          </>
        ) : (
          <>
            <h2 className="modal-title">Recuperar acesso</h2>
            <p className="modal-desc">
              Informe seu e-mail e os 3 últimos dígitos do seu CPF.
              Enviaremos uma nova senha para seu e-mail cadastrado.
            </p>
            <form className="modal-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <label>E-mail</label>
                <input
                  type="email"
                  required
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com.br"
                />
              </div>
              <div className="form-row">
                <label>Últimos 3 dígitos do CPF</label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={3}
                  required
                  value={cpfDigits}
                  onChange={(e) => setCpfDigits(e.target.value.replace(/\D/g, ''))}
                  placeholder="000"
                  className="input-cpf-digits"
                />
              </div>
              {error && <p className="login-error">{error}</p>}
              <div className="modal-actions">
                <button type="button" className="btn btn-ghost" onClick={onClose}>Cancelar</button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Enviando…' : 'Enviar nova senha'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
