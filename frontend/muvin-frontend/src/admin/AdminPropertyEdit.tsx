import { useState, useRef } from 'react';
import type { Property, PropertyType, PropertyPurpose, PropertyStatus } from '../types';
import { PhotoPlaceholder } from '../components/PhotoPlaceholder';
import * as api from '../services/api';

interface AdminPropertyEditProps {
  setRoute: (r: string) => void;
  properties: Property[];
  editingId: string | null;
  saveProperty: (draft: Property) => void;
}

function Field({ label, children, full = false }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <div className={'field ' + (full ? 'field-full' : '')}>
      <label>{label}</label>
      {children}
    </div>
  );
}

const BLANK: Property = {
  id: '',
  title: '',
  type: 'Apartamento',
  purpose: 'Venda',
  price: 0,
  condo: 0,
  iptu: 0,
  bedrooms: 0,
  suites: 0,
  bathrooms: 0,
  parking: 0,
  area: 0,
  address: '',
  neighborhood: '',
  city: 'São Paulo',
  state: 'SP',
  zip: '',
  code: '',
  status: 'Disponível',
  featured: false,
  publishedAt: new Date().toISOString().slice(0, 10),
  description: '',
  photos: [],
  features: [],
};

export function AdminPropertyEdit({ setRoute, properties, editingId, saveProperty }: AdminPropertyEditProps) {
  const existing = editingId ? properties.find((p) => p.id === editingId) : null;
  const uniquePhotos = existing?.photos.filter(
    (ph, i, arr) => ph.url && arr.findIndex((p) => p.url === ph.url) === i
  ) ?? [];
  const [draft, setDraft] = useState<Property>(
    existing ? { ...existing, photos: uniquePhotos } : { ...BLANK }
  );
  const [savedFlash, setSavedFlash] = useState(false);
  const [uploadingCount, setUploadingCount] = useState(0);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  function up<K extends keyof Property>(field: K, value: Property[K]) {
    setDraft((d) => ({ ...d, [field]: value }));
  }
  function upNum(field: keyof Property, value: string) {
    up(field as 'price', value === '' ? 0 : Number(value));
  }

  async function handleFilesChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploadingCount(files.length);
    setUploadError('');

    const results = await Promise.allSettled(files.map((f) => api.uploadFoto(f)));

    const urls = results
      .filter((r): r is PromiseFulfilledResult<string> => r.status === 'fulfilled')
      .map((r) => r.value);
    const failed = results.filter((r) => r.status === 'rejected').length;

    up('photos', [
      ...draft.photos,
      ...urls.map((url) => ({ label: '', tone: 'neutral' as const, url })),
    ]);

    setUploadingCount(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (failed > 0) setUploadError(`${failed} foto(s) não foram enviadas. Tente novamente.`);
  }

  function removePhoto(i: number) {
    up('photos', draft.photos.filter((_, idx) => idx !== i));
  }
  function movePhoto(i: number, dir: number) {
    const next = draft.photos.slice();
    const j = i + dir;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    up('photos', next);
  }

  function onSave() {
    if (!draft.title || !draft.price || !draft.code) {
      alert('Preencha pelo menos código, título e preço.');
      return;
    }
    saveProperty(draft);
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1800);
  }

  return (
    <div className="admin-page">
      <div className="admin-page-head admin-edit-head">
        <div>
          <button className="back-link" onClick={() => setRoute('admin-list')}>← Voltar para imóveis</button>
          <h1 className="h1">{existing ? `Editar · ${existing.code}` : 'Novo imóvel'}</h1>
          <p className="muted">{existing ? 'Atualize os dados, fotos ou status do imóvel.' : 'Preencha as informações para publicar este imóvel no site.'}</p>
        </div>
        <div className="edit-head-actions">
          {savedFlash && <span className="flash">✓ Salvo</span>}
          <button className="btn btn-ghost" onClick={() => setRoute('admin-list')}>Cancelar</button>
          <button className="btn btn-primary" onClick={onSave}>Salvar imóvel</button>
        </div>
      </div>

      <div className="admin-edit-grid">
        <div className="admin-card">
          <h3 className="h3-serif">Informações principais</h3>
          <div className="form-grid two-col">
            <Field label="Código interno *">
              <input value={draft.code} onChange={(e) => up('code', e.target.value)} placeholder="LI-2411" />
            </Field>
            <Field label="Status">
              <select value={draft.status} onChange={(e) => up('status', e.target.value as PropertyStatus)}>
                <option>Disponível</option>
                <option>Vendido</option>
                <option>Alugado</option>
                <option>Inativo</option>
              </select>
            </Field>
            <Field label="Título *" full>
              <input value={draft.title} onChange={(e) => up('title', e.target.value)} placeholder="Ex.: Cobertura duplex em Itaim Bibi" />
            </Field>
            <Field label="Tipo">
              <select value={draft.type} onChange={(e) => up('type', e.target.value as PropertyType)}>
                <option>Apartamento</option>
                <option>Casa</option>
                <option>Comercial</option>
                <option>Terreno</option>
              </select>
            </Field>
            <Field label="Finalidade">
              <select value={draft.purpose} onChange={(e) => up('purpose', e.target.value as PropertyPurpose)}>
                <option>Venda</option>
                <option>Aluguel</option>
              </select>
            </Field>
            <Field label="Descrição" full>
              <textarea rows={4} value={draft.description} onChange={(e) => up('description', e.target.value)} placeholder="Descreva o diferencial do imóvel, localização, reforma…" />
            </Field>
            <Field label="Imóvel em destaque" full>
              <label className="toggle-row">
                <input type="checkbox" checked={draft.featured} onChange={(e) => up('featured', e.target.checked)} />
                <span>Exibir na home como destaque da semana</span>
              </label>
            </Field>
          </div>
        </div>

        <div className="admin-card">
          <h3 className="h3-serif">Valores</h3>
          <div className="form-grid two-col">
            <Field label="Preço (R$) *">
              <input type="number" value={draft.price || ''} onChange={(e) => upNum('price', e.target.value)} placeholder="1500000" />
            </Field>
            <Field label="Condomínio mensal (R$)">
              <input type="number" value={draft.condo || ''} onChange={(e) => upNum('condo', e.target.value)} placeholder="0" />
            </Field>
            <Field label="IPTU mensal (R$)">
              <input type="number" value={draft.iptu || ''} onChange={(e) => upNum('iptu', e.target.value)} placeholder="0" />
            </Field>
          </div>
        </div>

        <div className="admin-card">
          <h3 className="h3-serif">Características</h3>
          <div className="form-grid four-col">
            <Field label="Dormitórios">
              <input type="number" value={draft.bedrooms || ''} onChange={(e) => upNum('bedrooms', e.target.value)} />
            </Field>
            <Field label="Suítes">
              <input type="number" value={draft.suites || ''} onChange={(e) => upNum('suites', e.target.value)} />
            </Field>
            <Field label="Banheiros">
              <input type="number" value={draft.bathrooms || ''} onChange={(e) => upNum('bathrooms', e.target.value)} />
            </Field>
            <Field label="Vagas">
              <input type="number" value={draft.parking || ''} onChange={(e) => upNum('parking', e.target.value)} />
            </Field>
            <Field label="Área útil (m²)">
              <input type="number" value={draft.area || ''} onChange={(e) => upNum('area', e.target.value)} />
            </Field>
          </div>
        </div>

        <div className="admin-card">
          <h3 className="h3-serif">Endereço</h3>
          <div className="form-grid two-col">
            <Field label="Logradouro" full>
              <input value={draft.address} onChange={(e) => up('address', e.target.value)} placeholder="Rua, número" />
            </Field>
            <Field label="Bairro">
              <input value={draft.neighborhood} onChange={(e) => up('neighborhood', e.target.value)} />
            </Field>
            <Field label="Cidade">
              <input value={draft.city} onChange={(e) => up('city', e.target.value)} />
            </Field>
            <Field label="UF">
              <input value={draft.state} onChange={(e) => up('state', e.target.value)} maxLength={2} />
            </Field>
            <Field label="CEP">
              <input value={draft.zip} onChange={(e) => up('zip', e.target.value)} placeholder="00000-000" />
            </Field>
          </div>
        </div>

        <div className="admin-card photos-card">
          <div className="photos-head">
            <h3 className="h3-serif">Fotos do imóvel</h3>
            <span className="muted">{draft.photos.length} foto{draft.photos.length !== 1 ? 's' : ''}</span>
          </div>
          <div className="photo-grid">
            {draft.photos.map((ph, i) => (
              <div key={i} className="photo-tile">
                <div className="photo-tile-img">
                  <PhotoPlaceholder
                    label={ph.url ? '' : 'sem url'}
                    tone={ph.tone}
                    url={ph.url}
                    aspect="4/3"
                  />
                  {i === 0 && <div className="photo-tile-cover">Capa</div>}
                </div>
                <div className="photo-tile-url" title={ph.url}>
                  <span className="muted" style={{ fontSize: 11, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>
                    {ph.url || '—'}
                  </span>
                </div>
                <div className="photo-tile-actions">
                  <button onClick={() => movePhoto(i, -1)} disabled={i === 0}>↑</button>
                  <button onClick={() => movePhoto(i, 1)} disabled={i === draft.photos.length - 1}>↓</button>
                  <button onClick={() => removePhoto(i)} className="danger">✕</button>
                </div>
              </div>
            ))}
          </div>

          <div className="photo-add-row">
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              disabled={uploadingCount > 0}
              onClick={() => fileInputRef.current?.click()}
            >
              {uploadingCount > 0 ? `Enviando ${uploadingCount} foto(s)…` : '+ Adicionar fotos'}
            </button>
            <span className="muted" style={{ fontSize: 12 }}>JPEG, PNG ou WebP · máx. 5 MB por foto</span>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              style={{ display: 'none' }}
              onChange={handleFilesChange}
            />
          </div>
          {uploadError && <p className="photo-upload-error">{uploadError}</p>}
        </div>
      </div>

      <div className="admin-edit-footer">
        <button className="btn btn-ghost" onClick={() => setRoute('admin-list')}>Cancelar</button>
        <button className="btn btn-primary" onClick={onSave}>Salvar imóvel</button>
      </div>
    </div>
  );
}
