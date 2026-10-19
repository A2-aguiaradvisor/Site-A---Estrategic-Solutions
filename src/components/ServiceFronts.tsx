import React from 'react'
import {
  TrendingUp,
  Sliders,
  BarChart4,
  CalendarDays,
  Leaf,
  CheckCircle2,
  Sparkles,
  Layers,
} from 'lucide-react'

export interface ServiceFront {
  id: string
  number: string
  title: string
  shortTitle: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  accentBg: string
  bullets: string[]
}

export const INSTITUTIONAL_SERVICE_FRONTS: ServiceFront[] = [
  {
    id: 'frente-1',
    number: 'Frente I',
    title: 'Frente I — Modelagem Financeira',
    shortTitle: 'Modelagem Financeira',
    icon: TrendingUp,
    color: '#2563EB',
    accentBg: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    bullets: [
      'Construção de projeções plurianuais de receitas, custos, despesas e investimentos em capital fixo (Capex).',
      'Análise de cenários operacionais (otimista, base e conservador) com testes de estresse de liquidez.',
      'Modelagem de Valuation (Fluxo de Caixa Descontado e Múltiplos de Mercado) para captação ou reestruturação.',
      'Estruturação de centros de custos, margens de contribuição e metodologias técnicas de formação de preço de venda.',
    ],
  },
  {
    id: 'frente-2',
    number: 'Frente II',
    title: 'Frente II — Controle e Processos Financeiros',
    shortTitle: 'Controle e Processos Financeiros',
    icon: Sliders,
    color: '#E1A63E',
    accentBg: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
    bullets: [
      'Redesenho completo da rotina operacional de contas a pagar, contas a receber e tesouraria.',
      'Parametrização do fluxo de caixa diário projetado versus realizado para eliminação de custos bancários desnecessários.',
      'Implantação de políticas de alçadas de aprovação, auditoria de processos e segregação estrita de funções.',
      'Instituição de rotinas estruturadas de fechamento contábil e gerencial com prazos estabelecidos.',
    ],
  },
  {
    id: 'frente-3',
    number: 'Frente III',
    title: 'Frente III — Automação e Visualização de Dados (BI)',
    shortTitle: 'Automação & BI',
    icon: BarChart4,
    color: '#38BDF8',
    accentBg: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
    bullets: [
      'Desenvolvimento de dashboards executivos e operacionais em ferramentas de ponta para acompanhamento em tempo real.',
      'Integração de múltiplos bancos de dados e sistemas legados (ERP, CRM e planilhas operacionais).',
      'Automação do envio de relatórios de fechamento, conciliação e alertas automáticos de desvio orçamentário.',
      'Painéis dinâmicos de DRE Gerencial, EBITDA, necessidade de capital de giro (NCG) e tesouraria.',
    ],
  },
  {
    id: 'frente-4',
    number: 'Frente IV',
    title: 'Frente IV — FP&A (Planejamento e Projeção Financeira)',
    shortTitle: 'FP&A & Orçamento',
    icon: CalendarDays,
    color: '#818CF8',
    accentBg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    bullets: [
      'Construção e consolidação do Orçamento Anual (Budget) integrado a todas as áreas de negócios.',
      'Revisões orçamentárias periódicas (Rolling Forecast) para resposta ágil a oscilações macroeconômicas.',
      'Apuração pormenorizada de desvios entre valores Realizados e Orçados com planos de ação corretivos.',
      'Definição, monitoramento e desdobramento de Indicadores-Chave de Desempenho (KPIs) por gerência.',
    ],
  },
]

export const ESG_CAPABILITY = {
  title: 'Capacidade Complementar — ESG e Governança Sustentável',
  shortTitle: 'ESG e Governança Sustentável',
  icon: Leaf,
  bullets: [
    'Elaboração de inventários de emissões e créditos de carbono voltados à conformidade e atração de investimentos.',
    'Elaboração de relatórios corporativos alinhados às diretrizes globais de sustentabilidade (ESG).',
    'Integração de indicadores socioambientais e de governança aos painéis decisórios da alta administração.',
  ],
}

export const PORTFOLIO_STATEMENT =
  'O portfólio da A2 Strategic Solutions é dividido em quatro frentes estruturais de atuação, integradas de forma modular, complementadas por capacidades em sustentabilidade e governança climática.'

interface ServiceFrontsProps {
  variant?: 'dark' | 'light'
  className?: string
  showStatement?: boolean
}

export const ServiceFronts: React.FC<ServiceFrontsProps> = ({
  variant = 'dark',
  className = '',
  showStatement = true,
}) => {
  const isDark = variant === 'dark'

  return (
    <div className={`space-y-8 ${className}`}>
      {showStatement && (
        <div
          className={`p-5 sm:p-6 rounded-2xl border ${
            isDark
              ? 'bg-gradient-to-r from-[#0F1E36] to-[#1F3A5F] border-slate-700/80 text-white'
              : 'bg-gradient-to-r from-slate-50 to-blue-50/50 border-slate-200 text-[#0F1E36]'
          }`}
        >
          <div className="flex items-start gap-3.5">
            <div className="p-2 rounded-xl bg-[#E1A63E]/15 text-[#E1A63E] flex-shrink-0 mt-0.5">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#E1A63E] block mb-1">
                Apresentação Institucional • Arquitetura Modular
              </span>
              <p
                className={`text-sm sm:text-base font-semibold leading-relaxed ${
                  isDark ? 'text-slate-100' : 'text-[#0F1E36]'
                }`}
              >
                {PORTFOLIO_STATEMENT}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Grid of the 4 Fronts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {INSTITUTIONAL_SERVICE_FRONTS.map((front) => {
          const Icon = front.icon
          return (
            <div
              key={front.id}
              className={`rounded-2xl p-6 border transition-all duration-300 flex flex-col justify-between ${
                isDark
                  ? 'bg-[#0B1527]/90 border-slate-800 hover:border-slate-700 shadow-md'
                  : 'bg-white border-slate-200 hover:border-blue-300 shadow-card-rest hover:shadow-card-hover'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-4">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${front.accentBg}`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{front.number}</span>
                  </span>
                  <span
                    className={`text-xs font-bold uppercase tracking-wider ${
                      isDark ? 'text-slate-400' : 'text-slate-500'
                    }`}
                  >
                    Modular
                  </span>
                </div>

                <h3
                  className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-[#0F1E36]'}`}
                >
                  {front.shortTitle}
                </h3>

                <ul className="space-y-3">
                  {front.bullets.map((bullet, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2.5 text-xs sm:text-sm leading-relaxed"
                    >
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#2563EB]" />
                      <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )
        })}
      </div>

      {/* ESG Complementary Capability */}
      <div
        className={`rounded-2xl p-6 sm:p-7 border ${
          isDark
            ? 'bg-gradient-to-br from-emerald-950/40 via-[#0B1527] to-[#0F1E36] border-emerald-800/40'
            : 'bg-gradient-to-br from-emerald-50 via-white to-slate-50 border-emerald-200'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-emerald-500/20">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Leaf className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 block">
                Capacidade Complementar
              </span>
              <h4
                className={`text-base sm:text-lg font-bold ${
                  isDark ? 'text-white' : 'text-[#0F1E36]'
                }`}
              >
                {ESG_CAPABILITY.shortTitle}
              </h4>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 self-start sm:self-auto">
            <Sparkles className="w-3 h-3" />
            Conformidade & Investimento
          </span>
        </div>

        <ul className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          {ESG_CAPABILITY.bullets.map((bullet, idx) => (
            <li
              key={idx}
              className={`flex items-start gap-2.5 text-xs sm:text-sm leading-relaxed p-3 rounded-xl ${
                isDark
                  ? 'bg-white/5 text-slate-300'
                  : 'bg-white text-slate-700 border border-slate-100'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
