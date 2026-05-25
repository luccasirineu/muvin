import type { Corretor } from '../types';
import { phoneRaw } from '../utils';
import { WAIcon } from './WAIcon';

export function WhatsAppFAB({ message = '', corretor }: { message?: string; corretor?: Corretor | null }) {
  if (!corretor?.phone) return null;
  const shortName = corretor.name.split(' ')[0];
  const text = message || `Olá ${shortName}! Vi seu site e gostaria de conversar.`;
  const url = `https://wa.me/${phoneRaw(corretor.phone)}?text=${encodeURIComponent(text)}`;
  return (
    <a className="wa-fab" href={url} target="_blank" rel="noopener" aria-label="Conversar no WhatsApp">
      <WAIcon size={26} />
      <span className="wa-fab-label">Fale comigo</span>
    </a>
  );
}
