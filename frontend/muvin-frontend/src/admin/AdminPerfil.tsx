import { useState, useEffect, useRef } from 'react';
import type { Corretor } from '../types';
import * as api from '../services/api';

type Form = {
  name: string;
  email: string;
  creci: string;
  cpf: string;
  phone: string;
  photo: string;
  senha: string;
  senhaConfirm: string;
};

export function AdminPerfil({ onUpdate }: { onUpdate?: (c: Corretor) => void }) {
  const [corretor, setCorretor] = useState<Corretor | null>(null);
  const [form, setForm] = useState<Form>({ name: '', email: '', creci: '', cpf: '', phone: '', photo: '', senha: '', senhaConfirm: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [flash, setFlash] = useState<'ok' | 'err' | null>(null);
  const [flashMsg, setFlashMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    api.getPerfil()
      .then((c) => {
        setCorretor(c);
        setForm({ name: c.name, email: c.email, creci: c.creci, cpf: c.cpf, phone: c.phone ?? '', photo: c.photoUrl ?? '', senha: '', senhaConfirm: '' });
      })
      .catch(() => {
        setFlash('err');
        setFlashMsg('Não foi possível carregar o perfil.');
      })
      .finally(() => setLoading(false));
  }, []);

  function up(field: keyof Form, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setFlash(null);
    try {
      const url = await api.uploadFoto(file);
      up('photo', url);
    } catch {
      setFlash('err');
      setFlashMsg('Erro ao fazer upload da foto. Tente novamente.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  async function handleSave(e: { preventDefault(): void }) {
    e.preventDefault();
    if (!corretor) return;

    if (form.senha && form.senha !== form.senhaConfirm) {
      setFlash('err');
      setFlashMsg('As senhas não coincidem.');
      return;
    }
    if (form.senha && form.senha.length < 6) {
      setFlash('err');
      setFlashMsg('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setSaving(true);
    setFlash(null);
    try {
      const updated = await api.updatePerfil(corretor.id, {
        name: form.name || undefined,
        email: form.email || undefined,
        creci: form.creci || undefined,
        cpf: form.cpf || undefined,
        phone: form.phone || undefined,
        senha: form.senha || undefined,
        photoUrl: form.photo || null,
      });
      setCorretor(updated);
      onUpdate?.(updated);
      setForm((f) => ({ ...f, senha: '', senhaConfirm: '' }));
      setFlash('ok');
      setFlashMsg('Alterações salvas com sucesso.');
    } catch {
      setFlash('err');
      setFlashMsg('Erro ao salvar as alterações. Tente novamente.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="admin-page">
        <p className="muted">Carregando perfil…</p>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <header className="admin-page-header">
        <h1>Perfil</h1>
        <p className="muted">Gerencie seus dados de corretor</p>
      </header>

      <form className="admin-perfil-form" onSubmit={handleSave}>
        {flash && (
          <div className={`perfil-flash perfil-flash-${flash}`}>{flashMsg}</div>
        )}

        <div className="admin-perfil-section">
          <h2 className="admin-perfil-section-title">Foto de perfil</h2>
          <p className="muted admin-perfil-hint">JPEG, PNG ou WebP · máximo 5 MB.</p>
          <div className="admin-perfil-photo-row">
            <div className="admin-perfil-photo-preview">
              {uploading
                ? <span className="admin-perfil-photo-empty">Enviando…</span>
                : form.photo
                  ? <img src={form.photo} alt="Foto de perfil" />
                  : <span className="admin-perfil-photo-empty">Sem foto</span>
              }
            </div>
            <div className="admin-perfil-photo-actions">
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                disabled={uploading}
                onClick={() => fileInputRef.current?.click()}
              >
                {uploading ? 'Enviando…' : form.photo ? 'Alterar foto' : 'Adicionar foto'}
              </button>
              {form.photo && !uploading && (
                <button
                  type="button"
                  className="btn btn-ghost btn-sm admin-perfil-photo-remove"
                  onClick={() => up('photo', '')}
                >
                  Remover
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
            </div>
          </div>
        </div>

        <div className="admin-perfil-section">
          <h2 className="admin-perfil-section-title">Dados pessoais</h2>
          <div className="admin-perfil-grid">
            <div className="field field-full">
              <label>Nome completo</label>
              <input value={form.name} onChange={(e) => up('name', e.target.value)} />
            </div>
            <div className="field">
              <label>E-mail</label>
              <input type="email" value={form.email} onChange={(e) => up('email', e.target.value)} />
            </div>
            <div className="field">
              <label>Celular</label>
              <input type="tel" value={form.phone} onChange={(e) => up('phone', e.target.value)} placeholder="(11) 99999-9999" />
            </div>
            <div className="field">
              <label>CPF</label>
              <input value={form.cpf} onChange={(e) => up('cpf', e.target.value)} placeholder="000.000.000-00" />
            </div>
            <div className="field">
              <label>Registro CRECI</label>
              <input value={form.creci} onChange={(e) => up('creci', e.target.value)} />
            </div>
          </div>
        </div>

        <div className="admin-perfil-section">
          <h2 className="admin-perfil-section-title">Alterar senha</h2>
          <p className="muted admin-perfil-hint">Deixe em branco para manter a senha atual.</p>
          <div className="admin-perfil-grid">
            <div className="field">
              <label>Nova senha</label>
              <input type="password" value={form.senha} onChange={(e) => up('senha', e.target.value)} autoComplete="new-password" />
            </div>
            <div className="field">
              <label>Confirmar senha</label>
              <input type="password" value={form.senhaConfirm} onChange={(e) => up('senhaConfirm', e.target.value)} autoComplete="new-password" />
            </div>
          </div>
        </div>

        <div className="admin-perfil-actions">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Salvando…' : 'Salvar alterações'}
          </button>
        </div>
      </form>
    </div>
  );
}
