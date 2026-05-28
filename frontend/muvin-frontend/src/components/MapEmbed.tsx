import { useState, useEffect } from 'react';

interface MapEmbedProps {
  address: string;
  neighborhood: string;
  city: string;
  state: string;
}

export function MapEmbed({ address, neighborhood, city, state }: MapEmbedProps) {
  const [src, setSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    const q = `${address}, ${neighborhood}, ${city}, ${state}, Brasil`;

    fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=1`,
      { signal: controller.signal, headers: { 'Accept-Language': 'pt-BR' } }
    )
      .then((r) => r.json())
      .then((data) => {
        if (data[0]) {
          const lat = parseFloat(data[0].lat);
          const lon = parseFloat(data[0].lon);
          const d = 0.005;
          setSrc(
            `https://www.openstreetmap.org/export/embed.html?bbox=${lon - d},${lat - d},${lon + d},${lat + d}&layer=mapnik&marker=${lat},${lon}`
          );
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [address, neighborhood, city, state]);

  if (loading) {
    return (
      <div className="map-state">
        <span className="muted">Carregando mapa…</span>
      </div>
    );
  }

  if (!src) {
    const q = `${address}, ${neighborhood}, ${city}, ${state}, Brasil`;
    const gmUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
    return (
      <div className="map-state">
        <span className="muted">📍 {address}, {neighborhood}</span>
        <a href={gmUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm">
          Ver no Google Maps
        </a>
      </div>
    );
  }

  return (
    <iframe
      src={src}
      title="Localização do imóvel"
      width="100%"
      height="100%"
      style={{ border: 'none', display: 'block' }}
      loading="lazy"
      referrerPolicy="no-referrer"
    />
  );
}
