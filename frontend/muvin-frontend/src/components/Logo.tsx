interface LogoProps {
  size?: number;
  variant?: 'full' | 'icon';
}

export function Logo({ size = 28, variant = 'full' }: LogoProps) {
  const fg = 'var(--fg)';
  return (
    <div className="logo" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
        <rect x="0.5" y="0.5" width="39" height="39" rx="3" fill="none" stroke={fg} strokeWidth="1" />
        <text x="20" y="27" fontFamily="'Instrument Serif', serif" fontSize="22" fill={fg} textAnchor="middle" fontStyle="italic">Mu</text>
      </svg>
      {variant === 'full' && (
        <span style={{ fontFamily: "'Instrument Serif', serif", fontSize: size * 0.78, lineHeight: 1, letterSpacing: '-0.01em' }}>
          Muvin Imóveis
        </span>
      )}
    </div>
  );
}
