import type { Property } from '../types';
import { brl } from '../utils';
import { PhotoPlaceholder } from './PhotoPlaceholder';

interface PropertyCardProps {
  p: Property;
  onOpen: (id: string) => void;
  variant?: 'vertical' | 'horizontal';
}

export function PropertyCard({ p, onOpen, variant = 'vertical' }: PropertyCardProps) {
  const cover = p.photos[0];
  return (
    <article className={'prop-card prop-card--' + variant} onClick={() => onOpen(p.id)}>
      <div className="prop-card-photo">
        <PhotoPlaceholder
          label={cover?.label || 'foto'}
          tone={cover?.tone || 'neutral'}
          url={cover?.url}
          aspect={variant === 'horizontal' ? '4/3' : '5/4'}
        />
        <div className="prop-card-badge">{p.type}</div>
        {p.status !== 'Disponível' && <div className="prop-card-status">{p.status}</div>}
      </div>
      <div className="prop-card-body">
        <div className="prop-card-loc">{p.neighborhood} · {p.city}</div>
        <h3 className="prop-card-title">{p.title}</h3>
        <div className="prop-card-specs">
          {p.bedrooms > 0 && <span>{p.bedrooms} dorm{p.bedrooms > 1 ? 's' : ''}</span>}
          {p.parking > 0 && <span>{p.parking} vaga{p.parking > 1 ? 's' : ''}</span>}
          <span>{p.area} m²</span>
        </div>
        <div className="prop-card-price">{brl(p.price)}</div>
      </div>
    </article>
  );
}
