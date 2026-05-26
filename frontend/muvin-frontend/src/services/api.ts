import type { Property, Lead, LeadStatus, Corretor } from '../types';

const BASE_URL = import.meta.env.VITE_API_URL || '';

// ─── Auth state ────────────────────────────────────────────────────────────

let _authenticated = false;

export function setAuthState(v: boolean): void {
  _authenticated = v;
}

// ─── HTTP helper ───────────────────────────────────────────────────────────

async function apiFetch(path: string, options: RequestInit = {}): Promise<unknown> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    credentials: 'include',
    headers: { ...headers, ...(options.headers as Record<string, string> ?? {}) },
  });

  if (res.status === 204) return null;

  if (res.status === 401) {
    if (_authenticated) {
      window.dispatchEvent(new CustomEvent('auth:expired'));
    }
    throw new Error('Sessão expirada. Faça login novamente.');
  }

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`HTTP ${res.status}: ${text}`);
  }
  return res.json();
}

// ─── Enum lookup tables ────────────────────────────────────────────────────
// Backend serializes enums as integers. Index = enum value.

const TIPO_IMOVEL    = ['Casa', 'Apartamento', 'Terreno', 'Comercial'] as const;
const FINALIDADE     = ['Venda', 'Aluguel'] as const;
const STATUS_IMOVEL  = ['Disponível', 'Vendido', 'Alugado', 'Inativo'] as const;
const STATUS_LEAD    = ['Novo', 'Em contato', 'Negociação', 'Arquivado', 'Fechado'] as const;

const TIPO_REV: Record<string, number>          = { Casa: 0, Apartamento: 1, Terreno: 2, Comercial: 3 };
const FINALIDADE_REV: Record<string, number>    = { Venda: 0, Aluguel: 1 };
const STATUS_IMOVEL_REV: Record<string, number> = { 'Disponível': 0, Vendido: 1, Alugado: 2, Inativo: 3 };
const STATUS_LEAD_REV: Record<string, number>   = { Novo: 0, 'Em contato': 1, 'Negociação': 2, Arquivado: 3, Fechado: 4 };
const DESEJO_REV: Record<string, number>        = { Comprar: 0, Vender: 1, Alugar: 2, Investir: 3 };

// ─── Mappers ───────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapImovel(d: any): Property {
  return {
    id: d.uuid as string,
    title: d.titulo as string,
    type: TIPO_IMOVEL[d.tipoImovel as number] as Property['type'],
    purpose: FINALIDADE[d.finalidadeImovel as number] as Property['purpose'],
    price: Number(d.precoImovel),
    condo: Number(d.condominioMensal),
    iptu: Number(d.iptuMensal),
    bedrooms: d.caracteristica.dormitorios as number,
    suites: d.caracteristica.suites as number,
    bathrooms: d.caracteristica.banheiros as number,
    parking: d.caracteristica.vagas as number,
    area: d.caracteristica.areaUtil as number,
    address: d.endereco.logradouro as string,
    neighborhood: d.endereco.bairro as string,
    city: d.endereco.cidade as string,
    state: d.endereco.uf as string,
    zip: d.endereco.cep as string,
    code: d.codInterno as string,
    status: STATUS_IMOVEL[d.statusImovel as number] as Property['status'],
    featured: d.destaque as boolean,
    publishedAt: d.publicacaoTimestamp as string,
    description: (d.descricao as string) || '',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    photos: ((d.fotosImovel as any[]) || []).map((f: any) => ({
      label: '',
      tone: 'neutral' as const,
      url: f.urlFoto as string,
      uuid: f.uuid as string,
    })),
    features: [],
  };
}

function propertyToDto(p: Property) {
  return {
    codInterno: p.code,
    statusImovel: STATUS_IMOVEL_REV[p.status] ?? 0,
    titulo: p.title,
    descricao: p.description || null,
    tipoImovel: TIPO_REV[p.type] ?? 0,
    finalidadeImovel: FINALIDADE_REV[p.purpose] ?? 0,
    precoImovel: p.price,
    condominioMensal: p.condo,
    iptuMensal: p.iptu,
    destaque: p.featured,
    caracteristica: {
      dormitorios: p.bedrooms,
      suites: p.suites,
      banheiros: p.bathrooms,
      vagas: p.parking,
      areaUtil: p.area,
    },
    endereco: {
      logradouro: p.address,
      bairro: p.neighborhood,
      cidade: p.city,
      uf: p.state,
      cep: p.zip,
    },
    urlFotos: p.photos.filter((ph) => ph.url).map((ph) => ph.url!),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapLead(d: any): Lead {
  return {
    id: d.uuid as string,
    name: d.nomeCompleto as string,
    phone: d.numCelular as string,
    email: d.email as string,
    propertyId: null,
    message: (d.mensagem as string) || '',
    receivedAt: d.envioTimestamp as string,
    status: STATUS_LEAD[d.statusLead as number] as LeadStatus,
    desejo: d.desejo !== undefined ? String(d.desejo) : undefined,
  };
}

// ─── Bairros ──────────────────────────────────────────────────────────────

export interface BairroStats {
  bairro: string;
  cidade: string;
  quantidade: number;
}

export async function getBairros(top = 6): Promise<BairroStats[]> {
  const d = await apiFetch(`/api/imoveis/bairros?top=${top}`);
  return d as BairroStats[];
}

// ─── Properties ───────────────────────────────────────────────────────────

export async function getProperties(pageSize = 100): Promise<Property[]> {
  const d = await apiFetch(`/api/imoveis?page=1&pageSize=${pageSize}`) as { data: unknown[] };
  return d.data.map(mapImovel);
}

export async function getPropertyById(uuid: string): Promise<Property> {
  const d = await apiFetch(`/api/imoveis/${uuid}`);
  return mapImovel(d);
}

export async function createProperty(p: Property): Promise<Property> {
  const d = await apiFetch('/api/imoveis', {
    method: 'POST',
    body: JSON.stringify(propertyToDto(p)),
  });
  return mapImovel(d);
}

export async function updateProperty(uuid: string, p: Property): Promise<Property> {
  const d = await apiFetch(`/api/imoveis/${uuid}`, {
    method: 'PUT',
    body: JSON.stringify(propertyToDto(p)),
  });
  return mapImovel(d);
}

export async function deleteProperty(uuid: string): Promise<void> {
  await apiFetch(`/api/imoveis/${uuid}`, { method: 'DELETE' });
}

// ─── Leads ─────────────────────────────────────────────────────────────────

export async function getLeads(pageSize = 100): Promise<Lead[]> {
  const d = await apiFetch(`/api/leads?page=1&pageSize=${pageSize}`) as { data: unknown[] };
  return d.data.map(mapLead);
}

export async function createLead(payload: {
  name: string;
  phone: string;
  email: string;
  message: string;
  interest: string;
}): Promise<Lead> {
  const d = await apiFetch('/api/leads', {
    method: 'POST',
    body: JSON.stringify({
      nomeCompleto: payload.name,
      numCelular: payload.phone,
      email: payload.email,
      mensagem: payload.message,
      desejo: DESEJO_REV[payload.interest] ?? 0,
    }),
  });
  return mapLead(d);
}

export async function updateLeadStatus(uuid: string, status: LeadStatus): Promise<Lead> {
  const d = await apiFetch(`/api/leads/${uuid}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ statusLead: STATUS_LEAD_REV[status] ?? 0 }),
  });
  return mapLead(d);
}

// ─── Dashboard ────────────────────────────────────────────────────────────

export async function getDashboardStats(): Promise<{
  imoveisDisponiveis: number;
  leadsNovos: number;
  emNegociacao: number;
}> {
  const [disponiveis, novos, negociacao] = await Promise.all([
    apiFetch('/api/dashboard/imoveis/disponiveis') as Promise<{ quantidade: number }>,
    apiFetch('/api/dashboard/leads/novos') as Promise<{ quantidade: number }>,
    apiFetch('/api/dashboard/leads/em-negociacao') as Promise<{ quantidade: number }>,
  ]);
  return {
    imoveisDisponiveis: disponiveis.quantidade,
    leadsNovos: novos.quantidade,
    emNegociacao: negociacao.quantidade,
  };
}

// ─── Corretor / Perfil ────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapCorretor(d: any): Corretor {
  return {
    id: d.uuid as string,
    name: d.nomeCompleto as string,
    email: d.email as string,
    creci: d.registroCreci as string,
    cpf: d.cpf as string,
    phone: (d.numCelular as string | null) ?? null,
    photoUrl: (d.fotoPerfil as string | null) ?? null,
  };
}

export async function getPerfil(): Promise<Corretor> {
  const d = await apiFetch('/api/corretor/perfil');
  return mapCorretor(d);
}

export async function updatePerfil(
  uuid: string,
  data: { name?: string; email?: string; senha?: string; creci?: string; cpf?: string; phone?: string; photoUrl?: string | null }
): Promise<Corretor> {
  const body: Record<string, string | null> = {};
  if (data.name)  body.nomeCompleto   = data.name;
  if (data.email) body.email          = data.email;
  if (data.senha && data.senha.length >= 6) body.senha = data.senha;
  if (data.creci) body.registroCreci  = data.creci;
  if (data.cpf)   body.cpf            = data.cpf;
  if (data.phone !== undefined) body.numCelular = data.phone;
  if (data.photoUrl !== undefined) body.fotoPerfil = data.photoUrl ?? '';

  const d = await apiFetch(`/api/corretor/${uuid}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
  return mapCorretor(d);
}

// ─── Upload ───────────────────────────────────────────────────────────────

export async function uploadFoto(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${BASE_URL}/api/upload/foto`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`HTTP ${res.status}: ${text}`);
  }
  const data = await res.json() as { url: string };
  return data.url;
}

// ─── Auth ──────────────────────────────────────────────────────────────────

export async function esqueciSenha(email: string, ultimosDigitosCpf: string): Promise<void> {
  await apiFetch('/api/corretor/esqueci-senha', {
    method: 'POST',
    body: JSON.stringify({ email, ultimosDigitosCpf }),
  });
}

export async function login(email: string, senha: string): Promise<{ nomeCompleto: string }> {
  const d = await apiFetch('/api/corretor/login', {
    method: 'POST',
    body: JSON.stringify({ email, senha }),
  }) as { corretor: { nomeCompleto: string } };
  return { nomeCompleto: d.corretor.nomeCompleto };
}

export async function logout(): Promise<void> {
  await apiFetch('/api/corretor/logout', { method: 'POST' });
}

export async function checkAuth(): Promise<void> {
  await apiFetch('/api/corretor/check');
}
