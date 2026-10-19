migrate(
  (app) => {
    const products = app.findCollectionByNameOrId('products')

    const sampleProducts = [
      {
        title: 'Mentoria Executiva Individual',
        slug: 'mentoria-executiva-individual',
        description:
          'Acompanhamento estratégico quinzenal personalizado para diretores, sócios e executivos em expansão.',
        long_description:
          'A Mentoria Executiva Individual da Aguiar Advisory foi desenhada para líderes que precisam de clareza estratégica, otimização de processos de tomada de decisão e aceleração do valor de mercado do seu negócio. As sessões combinam análise financeira, governança corporativa e planejamento de escala sustentável.',
        price: 4900,
        category: 'Mentoria',
        whats_included:
          '6 sessões individuais de 90 minutos via videoconferência\nDiagnóstico estratégico e financeiro aprofundado do seu negócio\nAcesso direto por canal exclusivo para alinhamentos rápidos durante o ciclo\nPlano de ação executivo com metas trimestrais e KPIs prioritários\nRevisão de governança, precificação e estrutura societária',
        for_whom:
          'CEOs, diretores, sócios-fundadores e executivos que lideram empresas em fase de tração, consolidação ou reestruturação estratégica.',
        requirements:
          'Disponibilidade para encontros quinzenais e compromisso com o compartilhamento de métricas e dados de gestão.',
      },
      {
        title: 'Mentoria em Estruturação Financeira & Valuation',
        slug: 'mentoria-estruturacao-financeira-valuation',
        description:
          'Planejamento avançado de fluxo de caixa, precificação estratégica e preparação para captação de investimentos.',
        long_description:
          'Desenvolva uma arquitetura financeira de padrão institucional. Neste programa focado, trabalhamos fluxo de caixa projetado, margens por unidade de negócio, orçamento base zero e métricas de valuation para preparar sua empresa para captação, fusão ou distribuição saudável de lucros.',
        price: 3200,
        category: 'Mentoria',
        whats_included:
          '4 encontros estratégicos temáticos de 2 horas\nModelagem financeira customizada em planilha executiva\nAnálise de sensibilidade, ponto de equilíbrio e margens reais\nRelatório de diagnóstico de valuation preliminar\nGuia de apresentação institucional para investidores e bancos',
        for_whom:
          'Fundadores, gestores financeiros (CFOs) e empresários que precisam profissionalizar sua gestão econômico-financeira.',
        requirements:
          'DRE histórica ou relatórios básicos de faturamento e despesas dos últimos 12 meses.',
      },
      {
        title: 'Mentoria de Governança & Gestão de Sócios',
        slug: 'mentoria-governanca-gestao-socios',
        description:
          'Alinhamento de expectativas, acordos societários, papéis executivos e comitê consultivo.',
        long_description:
          'Conflitos societários e falta de clareza nos papéis operacionais e estratégicos são as maiores causas de estagnação corporativa. Esta mentoria estabelece as bases de governança, ritos de decisão e diretrizes para comitês consultivos eficientes.',
        price: 2800,
        category: 'Mentoria',
        whats_included:
          '4 sessões conjuntas com os sócios-chave\nMatriz de responsabilidades e papéis executivos (RACI)\nDiretrizes e minuta de Acordo de Sócios e Políticas Internas\nEstruturação do Comitê de Gestão com pautas e calendário anual\nAvaliação de riscos de sucessão e contingências',
        for_whom:
          'Empresas com dois ou mais sócios que buscam amadurecer a governança e alinhar objetivos de longo prazo.',
        requirements: 'Participação dos principais sócios tomadores de decisão nas sessões.',
      },
      {
        title: 'Curso: Gestão Financeira para Empresas e Serviços',
        slug: 'curso-gestao-financeira-empresas',
        description:
          'Programa digital completo com videoaulas práticas, planilhas automatizadas e suporte para dúvidas.',
        long_description:
          'Um treinamento passo a passo que desmistifica as finanças empresariais. Aprenda a ler e projetar DRE, Balanço Gerencial, fluxo de caixa diário e indicadores de liquidez sem termos complicados, com aplicação imediata na sua rotina corporativa.',
        price: 997,
        category: 'Curso',
        whats_included:
          'Mais de 25 aulas em vídeo em alta definição com acesso vitalício\nPacote completo de planilhas financeiras automatizadas (DRE, Fluxo de Caixa, Precificação)\nCertificado de conclusão emitido pela Aguiar Advisory\nÁrea de membros para tirar dúvidas diretamente com os instrutores\nAtualizações constantes de conteúdo e estudos de caso reais',
        for_whom:
          'Empreendedores, administradores, gestores de operações e consultores que querem dominar finanças práticas.',
        requirements: 'Conhecimento básico de planilhas eletrônicas (Excel ou Google Sheets).',
      },
      {
        title: 'E-book: Planejamento Tributário na Prática',
        slug: 'ebook-planejamento-tributario-pratica',
        description:
          'Manual definitivo para redução lícita de carga tributária, escolha de regimes e compliance fiscal.',
        long_description:
          'Guia analítico de alta densidade técnica escrito por especialistas tributários. Abrange a comparação aprofundada entre Simples Nacional, Lucro Presumido e Lucro Real, deduções legais, planejamento de pró-labore e distribuição de dividendos e as principais tendências da Reforma Tributária.',
        price: 189,
        category: 'E-book',
        whats_included:
          'Livro digital em formato PDF otimizado (mais de 140 páginas)\nChecklists de conformidade tributária e auditoria preventiva\nCalculadora comparativa em planilha entre regimes tributários\nAcesso a canal de comunicados com notas de atualização fiscal\nResumo executivo dos impactos da Reforma Tributária',
        for_whom:
          'Contadores, advogados, diretores financeiros e empresários que buscam elisão fiscal responsável e economia legal.',
        requirements:
          'Nenhum pré-requisito técnico; material acessível tanto para especialistas quanto para gestores.',
      },
      {
        title: 'Assessoria Consultiva Mensal: Advisory On-Demand',
        slug: 'assessoria-consultiva-advisory-on-demand',
        description:
          'Canal permanente de suporte estratégico para tomadas de decisão críticas e revisão contínua de negócios.',
        long_description:
          'Tenha a inteligência e a experiência da Aguiar Advisory integrada à sua rotina de negócios. O pacote Advisory On-Demand oferece suporte analítico prioritário para novos projetos, M&A preliminar, renegociação com fornecedores e posicionamento de mercado.',
        price: 3600,
        category: 'Serviço',
        whats_included:
          'Duas reuniões mensais de alinhamento com conselheiro sênior\nCanal prioritário de WhatsApp e e-mail para validação de decisões estratégicas\nRevisão mensal de indicadores-chave de desempenho (OKRs e KPIs)\nParecer técnico e recomendações sobre novos contratos e oportunidades de expansão\nAcesso irrestrito a toda a biblioteca de relatórios econômicos e cursos da Aguiar Advisory',
        for_whom:
          'Empresas consolidadas que desejam o suporte de um advisory board experiente sem os custos de um conselho fixo.',
        requirements:
          'Envio de relatório mensal de atividades e disponibilidade para reuniões de alinhamento.',
      },
    ]

    for (const item of sampleProducts) {
      try {
        app.findFirstRecordByData('products', 'slug', item.slug)
        // Already exists, skip
        continue
      } catch (_) {}

      const record = new Record(products)
      record.set('title', item.title)
      record.set('slug', item.slug)
      record.set('description', item.description)
      record.set('long_description', item.long_description)
      record.set('price', item.price)
      record.set('category', item.category)
      record.set('whats_included', item.whats_included)
      record.set('for_whom', item.for_whom)
      record.set('requirements', item.requirements)
      // cover_image is null (no external URLs)
      app.save(record)
    }
  },
  (app) => {
    const slugs = [
      'mentoria-executiva-individual',
      'mentoria-estruturacao-financeira-valuation',
      'mentoria-governanca-gestao-socios',
      'curso-gestao-financeira-empresas',
      'ebook-planejamento-tributario-pratica',
      'assessoria-consultiva-advisory-on-demand',
    ]
    for (const slug of slugs) {
      try {
        const record = app.findFirstRecordByData('products', 'slug', slug)
        app.delete(record)
      } catch (_) {}
    }
  },
)
