export type PhotoTone = 'warm' | 'cool' | 'neutral';
export type PropertyType = 'Apartamento' | 'Casa' | 'Comercial' | 'Terreno';
export type PropertyPurpose = 'Venda' | 'Aluguel';
export type PropertyStatus = 'Disponível' | 'Vendido' | 'Alugado' | 'Inativo';
export type LeadStatus = 'Novo' | 'Em contato' | 'Negociação' | 'Arquivado' | 'Fechado';

export interface Photo {
  label: string;
  tone: PhotoTone;
  url?: string;
  uuid?: string;
}

export interface Property {
  id: string;
  title: string;
  type: PropertyType;
  purpose: PropertyPurpose;
  price: number;
  condo: number;
  iptu: number;
  bedrooms: number;
  suites: number;
  bathrooms: number;
  parking: number;
  area: number;
  address: string;
  neighborhood: string;
  city: string;
  state: string;
  zip: string;
  code: string;
  status: PropertyStatus;
  featured: boolean;
  publishedAt: string;
  description: string;
  photos: Photo[];
  features: string[];
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  propertyId: string | null;
  message: string;
  receivedAt: string;
  status: LeadStatus;
  desejo?: string;
}

export interface Broker {
  bio: string;
  yearsActive: number;
  closedDeals: number;
  avgResponseHours: number;
}

export interface Corretor {
  id: string;
  name: string;
  email: string;
  creci: string;
  cpf: string;
  phone: string | null;
  photoUrl: string | null;
}

export interface QuickSearch {
  type: string;
  priceMax: string;
}
