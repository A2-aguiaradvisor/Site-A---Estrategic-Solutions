migrate(
  (app) => {
    // 1. Update collection schema to allow the new product categories
    const products = app.findCollectionByNameOrId('products')
    const categoryField = products.fields.getByName('category')
    if (categoryField) {
      categoryField.values = [
        'Produto de Entrada',
        'Box',
        'Curso',
        'Mentoria',
        'Serviços',
        // keep legacy for safety during migration
        'E-book',
        'Serviço',
      ]
      categoryField.maxSelect = 1
      app.save(products)
    }

    // 2. Clear old demo seed products to replace with the user's exact compact product ladder
    try {
      const existing = app.findRecordsByFilter('products', 'id != ""', '', 50, 0)
      for (const rec of existing) {
        app.delete(rec)
      }
    } catch (_) {}

    // 3. Compact product ladder requested by user:
    // (a) Planilha modelo faturamento + Prompt Financeiro (Produto de entrada)
    // (b) Impacto na precificação devido a reforma tributária + Planilha (Produto de entrada)
    // (c) Box Analista Financeiro - Modelagem (Box)
    // (d) Curso - Controladoria Estratégica (Curso)
    // (e) Mentoria (Mentoria)
    // (f) Serviços - Conforme apresentação institucional (Serviços)
    const compactCatalog = [
      {
        title: 'Planilha Modelo Faturamento + Prompt Financeiro',
        slug: 'planilha-modelo-faturamento-prompt-financeiro',
        description:
          'Produto de entrada com planilha estruturada para controle de faturamento e prompt financeiro calibrado para inteligência artificial.',
        long_description:
          'Solução prática de entrada da A² Strategic Solutions. Combina modelo analítico em planilha para projeção e acompanhamento diário de faturamento com prompt financeiro calibrado para inteligência artificial executiva, acelerando a extração de métricas de receita, ticket médio e sazonalidade.',
        price: 147,
        category: 'Produto de Entrada',
        whats_included:
          'Planilha modelo de faturamento em Excel/Google Sheets pronta para uso\nPrompt financeiro calibrado para análise de faturamento via IA\nGuia rápido de parametrização e preenchimento de receitas e impostos incidentes\nPainel sintético com KPIs de receita bruta, deduções e faturamento líquido\nAcesso imediato para download após confirmação (dados de demonstração)',
        for_whom:
          'Analistas, controllers, gestores comerciais e fundadores que precisam de um modelo ágil de faturamento com apoio de IA.',
        requirements:
          'Conhecimento básico de planilhas eletrônicas (Microsoft Excel ou Google Sheets).',
      },
      {
        title: 'Impacto na Precificação Devido à Reforma Tributária + Planilha',
        slug: 'impacto-precificacao-reforma-tributaria-planilha',
        description:
          'Simulador e planilha de recálculo de preço de venda e margens líquidas diante das novas alíquotas da Reforma Tributária.',
        long_description:
          'Ferramenta analítica dedicada ao impacto das mudanças tributárias no markup e na margem de contribuição. Inclui planilha interativa de simulação de cenários pré e pós-reforma para precificação técnica de produtos e serviços corporativos.',
        price: 297,
        category: 'Produto de Entrada',
        whats_included:
          'Planilha de precificação técnica com cenários comparativos da Reforma Tributária\nSimulador de markup divisor/multiplicador e cálculo de margem de contribuição líquida\nResumo executivo com os principais vetores de impacto no preço de venda\nModelagem de repasse de custos fiscais para contratos e tabelas de preço\nAtualização e notas técnicas do modelo',
        for_whom:
          'Controllers, diretores financeiros, gestores de precificação e contadores consultivos.',
        requirements: 'Estrutura atual de custos, alíquotas vigentes e preços de venda da empresa.',
      },
      {
        title: 'Box Analista Financeiro — Modelagem',
        slug: 'box-analista-financeiro-modelagem',
        description:
          'Conjunto executivo com planilhas de projeção plurianual, testes de estresse de liquidez, múltiplos e centro de custos.',
        long_description:
          'O Box Analista Financeiro - Modelagem reúne a base analítica da Frente I da A² Strategic Solutions. Contém modelos completos de projeções plurianuais (Capex, Opex e Receitas), modelagem de valuation por múltiplos e DCF, além de testes de estresse para decisões de liquidez.',
        price: 690,
        category: 'Box',
        whats_included:
          'Modelos de projeção plurianual de receitas, custos, despesas e Capex\nPlanilhas de testes de estresse de liquidez e cenários (conservador, base e otimista)\nCalculadoras de Valuation preliminar (Fluxo de Caixa Descontado e Múltiplos)\nEstrutura modular de centros de custos e formação técnica de preço\nDocumentação técnica com manual de parametrização dos modelos',
        for_whom:
          'Analistas seniores, coordenadores de FP&A, consultores independentes e sócios que necessitam de modelagem financeira de padrão conselho.',
        requirements: 'Domínio intermediário de Excel/planilhas financeiras.',
      },
      {
        title: 'Curso: Controladoria Estratégica',
        slug: 'curso-controladoria-estrategica',
        description:
          'Formação técnica sobre desenho de rotinas contábeis/gerenciais, orçamento (Budget & Rolling Forecast) e KPIs de diretoria.',
        long_description:
          'Treinamento estruturado pela A² Strategic Solutions integrando as melhores práticas das frentes de Controle, Processos e FP&A. Aborda desde a parametrização de fluxo de caixa projetado versus realizado até a construção do Orçamento Anual (Budget) e acompanhamento por KPIs.',
        price: 997,
        category: 'Curso',
        whats_included:
          'Trilha completa de aulas com foco em controladoria moderna e governança\nModelos de fechamento contábil e gerencial com cronograma e matriz RACI\nMetodologia de Budget Anual integrado e Rolling Forecast periódico\nFramework de apuração de desvios Realizado vs. Orçado com planos de ação\nCertificado de conclusão da A² Strategic Solutions',
        for_whom:
          'Controllers, gerentes financeiros, coordenadores contábeis e empresários em processo de profissionalização da governança.',
        requirements: 'Noções de contabilidade gerencial e finanças corporativas.',
      },
      {
        title: 'Mentoria Executiva',
        slug: 'mentoria-executiva',
        description:
          'Acompanhamento estratégico individual e personalizado com foco em controladoria, valuation e arquitetura de governança.',
        long_description:
          'Programa de mentoria sênior da A² Strategic Solutions para líderes e executivos que demandam orientação direta em tomadas de decisão críticas, consolidação de processos de conselho, preparação para captação ou reestruturação de governança corporativa.',
        price: 4900,
        category: 'Mentoria',
        whats_included:
          'Sessões executivas individuais via videoconferência com conselheiro sênior\nDiagnóstico de maturidade financeira, processos internos e governança\nCanal direto para alinhamento e validação de decisões estratégicas de alto impacto\nPlano de metas trimestrais com acompanhamento de indicadores prioritários\nRevisão dos modelos de valuation, orçamento e ritos decisórios',
        for_whom:
          'C-levels, diretores, sócios-fundadores e executivos de grupos econômicos em consolidação ou expansão.',
        requirements:
          'Disponibilidade para encontros periódicos e compartilhamento de metas de gestão.',
      },
      {
        title: 'Serviços — Consultoria Conforme Apresentação Institucional',
        slug: 'servicos-consultoria-apresentacao-institucional',
        description:
          'Atuação modular nas quatro frentes: Modelagem Financeira, Controle e Processos, Automação/BI e FP&A, além de ESG.',
        long_description:
          'O portfólio da A2 Strategic Solutions é dividido em quatro frentes estruturais de atuação, integradas de forma modular, complementadas por capacidades em sustentabilidade e governança climática:\n\n• Frente I — Modelagem Financeira: Projeções plurianuais (Capex/Opex), cenários com testes de estresse de liquidez, valuation e centros de custos.\n• Frente II — Controle e Processos Financeiros: Redesenho de rotinas (contas a pagar/receber/tesouraria), fluxo diário projetado vs. realizado, alçadas e fechamento estruturado.\n• Frente III — Automação e Visualização de Dados (BI): Dashboards executivos em tempo real, integração de ERPs e planilhas, relatórios automáticos de fechamento e painéis de DRE Gerencial/NCG.\n• Frente IV — FP&A (Planejamento e Projeção Financeira): Orçamento Anual (Budget), Rolling Forecast, apuração pormenorizada de desvios Realizado vs. Orçado e KPIs por gerência.\n• Capacidade Complementar — ESG e Governança Sustentável: Inventários de emissões e créditos de carbono, relatórios corporativos alinhados a diretrizes ESG globais e indicadores socioambientais integrados aos painéis da alta administração.',
        price: 3600,
        category: 'Serviços',
        whats_included:
          'Diagnóstico preliminar e alinhamento do escopo modular com o grupo econômico\nAtuação direta nas Frentes I, II, III e IV conforme a necessidade da organização\nDesenvolvimento e homologação de rotinas, relatórios e dashboards executivos\nTreinamento e transição de conhecimento para as equipes internas da empresa\nSuporte e reuniões periódicas de acompanhamento com especialistas seniores',
        for_whom:
          'Grupos econômicos, médias e grandes empresas que buscam elevar a maturidade de controladoria, inteligência de dados e planejamento financeiro.',
        requirements:
          'Alinhamento prévio de escopo e acesso aos interlocutores e dados de gestão da organização.',
      },
    ]

    for (const item of compactCatalog) {
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
      app.save(record)
    }
  },
  (app) => {
    // Revert: remove newly seeded products
    const slugs = [
      'planilha-modelo-faturamento-prompt-financeiro',
      'impacto-precificacao-reforma-tributaria-planilha',
      'box-analista-financeiro-modelagem',
      'curso-controladoria-estrategica',
      'mentoria-executiva',
      'servicos-consultoria-apresentacao-institucional',
    ]
    for (const slug of slugs) {
      try {
        const record = app.findFirstRecordByData('products', 'slug', slug)
        app.delete(record)
      } catch (_) {}
    }
  },
)
