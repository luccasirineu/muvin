import { useState } from 'react';

export function LGPDBanner() {
  const [shown, setShown] = useState(true);
  if (!shown) return null;
  return (
    <div className="lgpd">
      <p>
        Este site usa cookies para entender o que ajuda você a encontrar o imóvel certo. Seus dados são tratados
        conforme a <a href="#" onClick={(e) => e.preventDefault()}>Lei Geral de Proteção de Dados (LGPD)</a>.
      </p>
      <div className="lgpd-actions">
        <button className="btn btn-ghost btn-sm" onClick={() => setShown(false)}>Recusar</button>
        <button className="btn btn-primary btn-sm" onClick={() => setShown(false)}>Aceitar</button>
      </div>
    </div>
  );
}
