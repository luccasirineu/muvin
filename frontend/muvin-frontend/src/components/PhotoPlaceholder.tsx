import { useMemo } from 'react';
import type { PhotoTone } from '../types';

interface PhotoPlaceholderProps {
  label?: string;
  tone?: PhotoTone;
  aspect?: string;
  className?: string;
  style?: React.CSSProperties;
  url?: string;
}

const TONES = {
  warm:    { bg: 'var(--ph-warm-bg)',    stripe: 'var(--ph-warm-stripe)',    fg: 'var(--ph-warm-fg)' },
  cool:    { bg: 'var(--ph-cool-bg)',    stripe: 'var(--ph-cool-stripe)',    fg: 'var(--ph-cool-fg)' },
  neutral: { bg: 'var(--ph-neutral-bg)', stripe: 'var(--ph-neutral-stripe)', fg: 'var(--ph-neutral-fg)' },
};

export function PhotoPlaceholder({
  label = 'foto',
  tone = 'neutral',
  aspect = '4/3',
  className = '',
  style = {},
  url,
}: PhotoPlaceholderProps) {
  const id = useMemo(() => 'ph-' + Math.random().toString(36).slice(2, 8), []);

  if (url) {
    return (
      <div
        className={'photo-ph ' + className}
        style={{ position: 'relative', aspectRatio: aspect, overflow: 'hidden', ...style }}
      >
        <img
          src={url}
          alt=""
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      </div>
    );
  }

  const t = TONES[tone];

  return (
    <div
      className={'photo-ph ' + className}
      style={{ position: 'relative', aspectRatio: aspect, background: t.bg, overflow: 'hidden', ...style }}
    >
      <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 400 300" style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <pattern id={id} x="0" y="0" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
            <line x1="0" y1="0" x2="0" y2="14" stroke={t.stripe} strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="400" height="300" fill={`url(#${id})`} opacity="0.55" />
      </svg>
      <span style={{
        position: 'absolute', left: 10, bottom: 10,
        fontFamily: "ui-monospace, 'JetBrains Mono', 'SF Mono', monospace",
        fontSize: 10.5, letterSpacing: '0.04em', color: t.fg,
        background: 'var(--ph-label-bg)', padding: '3px 7px', borderRadius: 2, textTransform: 'lowercase',
      }}>
        {label}
      </span>
    </div>
  );
}
