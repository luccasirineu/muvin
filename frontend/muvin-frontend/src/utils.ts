export function brl(n: number | null | undefined): string {
  if (n == null || isNaN(n)) return '—';
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
}

export function brlCompact(n: number | null | undefined): string {
  if (n == null || isNaN(n)) return '—';
  if (n >= 1_000_000) return 'R$ ' + (n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1).replace('.', ',') + ' mi';
  if (n >= 1_000) return 'R$ ' + Math.round(n / 1_000) + ' mil';
  return brl(n);
}

export function relTime(iso: string): string {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return 'agora';
  if (diff < 3600) return Math.round(diff / 60) + ' min';
  if (diff < 86400) return Math.round(diff / 3600) + ' h';
  return Math.round(diff / 86400) + ' d';
}

export function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function phoneRaw(phone: string): string {
  return phone.replace(/\D/g, '');
}
