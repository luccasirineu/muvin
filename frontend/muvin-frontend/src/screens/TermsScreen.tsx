interface TermsScreenProps {
  setRoute: (r: string) => void;
}

export function TermsScreen({ setRoute }: TermsScreenProps) {
  return (
    <div className="screen legal-screen">
      <div className="legal-inner">
        <button className="legal-back" onClick={() => setRoute('home')}>← Voltar</button>

        <h1 className="legal-title">Termos de Uso</h1>
        <p className="legal-updated">Última atualização: maio de 2026</p>

        <section className="legal-section">
          <h2>1. Aceitação dos termos</h2>
          <p>
            Ao acessar e utilizar este site, você declara ter lido, compreendido e concordado com
            estes Termos de Uso. Caso não concorde com qualquer disposição, pedimos que não utilize
            o site.
          </p>
        </section>

        <section className="legal-section">
          <h2>2. Sobre o serviço</h2>
          <p>
            Este site é uma plataforma de apresentação de imóveis e captação de leads para fins de
            intermediação imobiliária exercida por corretor autônomo devidamente registrado no
            CRECI-SP. As informações disponibilizadas têm caráter meramente informativo e não
            constituem oferta vinculante de compra, venda ou locação de imóveis.
          </p>
        </section>

        <section className="legal-section">
          <h2>3. Cadastro de imóveis</h2>
          <p>
            Os imóveis exibidos neste site são cadastrados pelo Corretor com base em informações
            fornecidas por proprietários e outras fontes. Embora nos esforcemos para manter os dados
            atualizados e precisos, não garantimos a disponibilidade, preço ou condições dos imóveis
            listados no momento da consulta, pois podem ter sido negociados, removidos ou alterados.
          </p>
        </section>

        <section className="legal-section">
          <h2>4. Uso permitido</h2>
          <p>É permitido ao usuário:</p>
          <ul>
            <li>Navegar pelas páginas e consultar os imóveis disponíveis;</li>
            <li>Enviar mensagens de contato para o Corretor;</li>
            <li>Compartilhar links de imóveis para terceiros.</li>
          </ul>
          <p>É expressamente proibido:</p>
          <ul>
            <li>Reproduzir, redistribuir ou comercializar o conteúdo deste site sem autorização;</li>
            <li>Utilizar mecanismos automatizados (scrapers, bots) para coletar dados;</li>
            <li>Realizar qualquer ação que comprometa a integridade, segurança ou disponibilidade do site.</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>5. Propriedade intelectual</h2>
          <p>
            Todo o conteúdo deste site — incluindo textos, imagens, logotipos, layout e código-fonte
            — é de propriedade do Corretor ou de terceiros que concederam licença de uso. É vedada
            qualquer reprodução sem autorização expressa e por escrito.
          </p>
        </section>

        <section className="legal-section">
          <h2>6. Limitação de responsabilidade</h2>
          <p>
            O Corretor não se responsabiliza por decisões tomadas pelo usuário com base exclusivamente
            nas informações deste site, sem a devida assessoria presencial. A intermediação imobiliária
            envolve fatores legais, financeiros e estruturais que devem ser verificados por
            profissionais habilitados antes de qualquer compromisso.
          </p>
        </section>

        <section className="legal-section">
          <h2>7. Links externos</h2>
          <p>
            Este site pode conter links para plataformas externas (WhatsApp, e-mail). O Corretor não
            tem controle sobre o conteúdo ou políticas dessas plataformas e não se responsabiliza
            por elas.
          </p>
        </section>

        <section className="legal-section">
          <h2>8. Alterações nos termos</h2>
          <p>
            Reservamo-nos o direito de modificar estes Termos a qualquer momento. As alterações
            entram em vigor imediatamente após a publicação nesta página. O uso contínuo do site
            após as alterações implica aceitação dos novos termos.
          </p>
        </section>

        <section className="legal-section">
          <h2>9. Foro e legislação aplicável</h2>
          <p>
            Estes Termos são regidos pela legislação brasileira. Fica eleito o foro da comarca de
            São Paulo/SP para dirimir quaisquer controvérsias decorrentes deste instrumento, com
            renúncia expressa a qualquer outro, por mais privilegiado que seja.
          </p>
        </section>

        <section className="legal-section">
          <h2>10. Contato</h2>
          <p>
            Para dúvidas sobre estes Termos, acesse nossa{' '}
            <button className="legal-link" onClick={() => setRoute('contact')}>página de contato</button>.
          </p>
        </section>
      </div>
    </div>
  );
}
