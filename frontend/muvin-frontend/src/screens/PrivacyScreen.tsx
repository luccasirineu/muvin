interface PrivacyScreenProps {
  setRoute: (r: string) => void;
}

export function PrivacyScreen({ setRoute }: PrivacyScreenProps) {
  return (
    <div className="screen legal-screen">
      <div className="legal-inner">
        <button className="legal-back" onClick={() => setRoute('home')}>← Voltar</button>

        <h1 className="legal-title">Política de Privacidade</h1>
        <p className="legal-updated">Última atualização: maio de 2026</p>

        <section className="legal-section">
          <h2>1. Quem somos</h2>
          <p>
            Esta plataforma é operada por um corretor de imóveis autônomo registrado no CRECI-SP,
            doravante denominado <strong>"Corretor"</strong>. O site tem finalidade exclusivamente
            informativa e de captação de contatos para intermediação imobiliária.
          </p>
        </section>

        <section className="legal-section">
          <h2>2. Dados que coletamos</h2>
          <p>Coletamos apenas os dados que você nos fornece voluntariamente por meio dos formulários de contato:</p>
          <ul>
            <li><strong>Nome completo</strong> — para identificação;</li>
            <li><strong>Número de WhatsApp</strong> — para retorno de contato;</li>
            <li><strong>Endereço de e-mail</strong> — para comunicações adicionais;</li>
            <li><strong>Mensagem</strong> — para entender sua necessidade.</li>
          </ul>
          <p>
            Não coletamos dados sensíveis (art. 11 da LGPD), não realizamos rastreamento automatizado
            além do necessário para o funcionamento do site, e não utilizamos cookies de terceiros para
            publicidade.
          </p>
        </section>

        <section className="legal-section">
          <h2>3. Finalidade do tratamento</h2>
          <p>Seus dados são utilizados exclusivamente para:</p>
          <ul>
            <li>Retornar seu contato e apresentar imóveis de interesse;</li>
            <li>Agendar visitas e negociações;</li>
            <li>Cumprir obrigações legais relacionadas à intermediação imobiliária.</li>
          </ul>
          <p>
            Seus dados <strong>não são vendidos, alugados ou compartilhados</strong> com terceiros
            para fins comerciais.
          </p>
        </section>

        <section className="legal-section">
          <h2>4. Base legal (LGPD — Lei nº 13.709/2018)</h2>
          <p>O tratamento dos seus dados se baseia em:</p>
          <ul>
            <li><strong>Consentimento</strong> (art. 7º, I) — fornecido ao preencher o formulário de contato;</li>
            <li><strong>Legítimo interesse</strong> (art. 7º, IX) — para execução da atividade de corretagem.</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>5. Tempo de retenção</h2>
          <p>
            Seus dados são mantidos pelo prazo necessário à prestação do serviço de intermediação ou
            pelo período mínimo exigido por lei. Após o encerramento do relacionamento, os dados são
            excluídos ou anonimizados, salvo obrigação legal em contrário.
          </p>
        </section>

        <section className="legal-section">
          <h2>6. Seus direitos</h2>
          <p>Nos termos da LGPD, você tem direito a:</p>
          <ul>
            <li>Confirmar a existência de tratamento dos seus dados;</li>
            <li>Acessar os dados que mantemos sobre você;</li>
            <li>Corrigir dados incompletos, inexatos ou desatualizados;</li>
            <li>Solicitar a anonimização, bloqueio ou eliminação dos dados;</li>
            <li>Revogar o consentimento a qualquer momento.</li>
          </ul>
          <p>
            Para exercer qualquer desses direitos, entre em contato pelo formulário disponível na
            página <button className="legal-link" onClick={() => setRoute('contact')}>Contato</button>.
          </p>
        </section>

        <section className="legal-section">
          <h2>7. Segurança</h2>
          <p>
            Adotamos medidas técnicas e organizacionais adequadas para proteger seus dados contra
            acesso não autorizado, perda ou divulgação indevida, incluindo comunicação via HTTPS e
            acesso restrito ao banco de dados.
          </p>
        </section>

        <section className="legal-section">
          <h2>8. Alterações nesta política</h2>
          <p>
            Podemos atualizar esta política periodicamente. Em caso de alterações relevantes,
            publicaremos a nova versão nesta página com a data de atualização. Recomendamos
            consultar esta página regularmente.
          </p>
        </section>

        <section className="legal-section">
          <h2>9. Contato</h2>
          <p>
            Dúvidas sobre esta política ou sobre o tratamento dos seus dados podem ser enviadas
            por meio da nossa{' '}
            <button className="legal-link" onClick={() => setRoute('contact')}>página de contato</button>.
          </p>
        </section>
      </div>
    </div>
  );
}
