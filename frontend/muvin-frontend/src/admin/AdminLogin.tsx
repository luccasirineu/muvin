import { useState } from 'react';
import { login } from '../services/api';
import { Logo } from '../components/Logo';
import { EsqueciSenhaModal } from '../components/EsqueciSenhaModal';

interface AdminLoginProps {
  onLogin: (token: string) => void;
}

export function AdminLogin({ onLogin }: AdminLoginProps) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showRecovery, setShowRecovery] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { token } = await login(email, senha);
      onLogin(token);
    } catch {
      setError('E-mail ou senha incorretos.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-screen">
      <div className="login-card">
        <div className="login-brand">
          <Logo size={28} />
          <span className="login-title">Modo corretor</span>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
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
            <label>Senha</label>
            <input
              type="password"
              required
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          {error && <p className="login-error">{error}</p>}
          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Entrando…' : 'Entrar'}
          </button>
          <button
            type="button"
            className="login-forgot-link"
            onClick={() => setShowRecovery(true)}
          >
            Esqueci minha senha
          </button>
        </form>
      </div>

      {showRecovery && <EsqueciSenhaModal onClose={() => setShowRecovery(false)} />}
    </div>
  );
}
