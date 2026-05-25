type PillValue =
  | 'Novo' | 'Em contato' | 'Negociação' | 'Arquivado' | 'Fechado'
  | 'Disponível' | 'Vendido' | 'Alugado' | 'Inativo';

const PILL_STYLES: Record<PillValue, { bg: string; fg: string }> = {
  'Novo':        { bg: 'var(--pill-new-bg)',    fg: 'var(--pill-new-fg)' },
  'Em contato':  { bg: 'var(--pill-active-bg)', fg: 'var(--pill-active-fg)' },
  'Negociação':  { bg: 'var(--pill-warm-bg)',   fg: 'var(--pill-warm-fg)' },
  'Arquivado':   { bg: 'var(--pill-mute-bg)',   fg: 'var(--pill-mute-fg)' },
  'Fechado':     { bg: 'var(--pill-mute-bg)',   fg: 'var(--pill-mute-fg)' },
  'Disponível':  { bg: 'var(--pill-active-bg)', fg: 'var(--pill-active-fg)' },
  'Vendido':     { bg: 'var(--pill-mute-bg)',   fg: 'var(--pill-mute-fg)' },
  'Alugado':     { bg: 'var(--pill-warm-bg)',   fg: 'var(--pill-warm-fg)' },
  'Inativo':     { bg: 'var(--pill-mute-bg)',   fg: 'var(--pill-mute-fg)' },
};

export function StatusPill({ v }: { v: string }) {
  const s = PILL_STYLES[v as PillValue] ?? PILL_STYLES['Arquivado'];
  return <span className="pill" style={{ background: s.bg, color: s.fg }}>{v}</span>;
}
