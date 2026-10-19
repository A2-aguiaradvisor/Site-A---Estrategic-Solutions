import React, { useState } from 'react'
import {
  TrendingUp,
  TrendingDown,
  Activity,
  ArrowUpRight,
  ShieldCheck,
  Calendar,
  Layers,
  ChevronRight,
  Sparkles,
  RefreshCw,
} from 'lucide-react'

type Period = '3M' | '6M' | '12M' | 'YTD'

interface FinancialInteractiveDashboardProps {
  className?: string
  defaultPeriod?: Period
  title?: string
}

export const FinancialInteractiveDashboard: React.FC<FinancialInteractiveDashboardProps> = ({
  className = '',
  defaultPeriod = '12M',
  title = 'A² Executive Intelligence Suite',
}) => {
  const [period, setPeriod] = useState<Period>(defaultPeriod)
  const [activeTab, setActiveTab] = useState<'dre' | 'ebitda' | 'caixa'>('dre')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [hoveredMonthIndex, setHoveredMonthIndex] = useState<number | null>(null)

  const handlePeriodChange = (p: Period) => {
    setIsRefreshing(true)
    setPeriod(p)
    setTimeout(() => setIsRefreshing(false), 300)
  }

  // Multi-scenario data based on active period
  const dataByPeriod = {
    '3M': {
      months: ['Jan', 'Fev', 'Mar'],
      revenue: [4.2, 4.8, 5.4],
      costs: [2.1, 2.3, 2.5],
      ebitda: [2.1, 2.5, 2.9],
      ebitdaMargin: '38.4%',
      runRate: 'R$ 64.8 mi',
      grossMargin: '53.7%',
      freeCashFlow: 'R$ 7.5 mi',
      kpis: [
        { label: 'Receita Bruta', value: 'R$ 14.4 mi', delta: '+18.4%', positive: true },
        { label: 'EBITDA Ajustado', value: 'R$ 7.5 mi', delta: '+22.1%', positive: true },
        { label: 'Margem Líquida', value: '28.6%', delta: '+3.4 p.p.', positive: true },
        { label: 'Giro de Ativo', value: '1.42x', delta: '+0.15x', positive: true },
      ],
    },
    '6M': {
      months: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
      revenue: [4.2, 4.8, 5.4, 5.9, 6.3, 7.1],
      costs: [2.1, 2.3, 2.5, 2.7, 2.8, 3.1],
      ebitda: [2.1, 2.5, 2.9, 3.2, 3.5, 4.0],
      ebitdaMargin: '40.2%',
      runRate: 'R$ 78.2 mi',
      grossMargin: '55.2%',
      freeCashFlow: 'R$ 16.8 mi',
      kpis: [
        { label: 'Receita Bruta', value: 'R$ 33.7 mi', delta: '+24.6%', positive: true },
        { label: 'EBITDA Ajustado', value: 'R$ 17.8 mi', delta: '+29.3%', positive: true },
        { label: 'Margem Líquida', value: '31.2%', delta: '+4.8 p.p.', positive: true },
        { label: 'Giro de Ativo', value: '1.58x', delta: '+0.22x', positive: true },
      ],
    },
    '12M': {
      months: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
      revenue: [4.2, 4.8, 5.4, 5.9, 6.3, 7.1, 7.4, 7.9, 8.5, 8.9, 9.4, 10.2],
      costs: [2.1, 2.3, 2.5, 2.7, 2.8, 3.1, 3.2, 3.3, 3.5, 3.6, 3.8, 4.0],
      ebitda: [2.1, 2.5, 2.9, 3.2, 3.5, 4.0, 4.2, 4.6, 5.0, 5.3, 5.6, 6.2],
      ebitdaMargin: '43.1%',
      runRate: 'R$ 122.4 mi',
      grossMargin: '58.4%',
      freeCashFlow: 'R$ 38.6 mi',
      kpis: [
        { label: 'Receita Consolidada', value: 'R$ 86.0 mi', delta: '+34.2%', positive: true },
        { label: 'EBITDA Gerencial', value: 'R$ 44.9 mi', delta: '+39.8%', positive: true },
        { label: 'Margem Líquida', value: '34.5%', delta: '+6.1 p.p.', positive: true },
        { label: 'Valuation Estimado', value: 'R$ 290 mi', delta: '+41.0%', positive: true },
      ],
    },
    YTD: {
      months: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set'],
      revenue: [4.2, 4.8, 5.4, 5.9, 6.3, 7.1, 7.4, 7.9, 8.5],
      costs: [2.1, 2.3, 2.5, 2.7, 2.8, 3.1, 3.2, 3.3, 3.5],
      ebitda: [2.1, 2.5, 2.9, 3.2, 3.5, 4.0, 4.2, 4.6, 5.0],
      ebitdaMargin: '42.0%',
      runRate: 'R$ 102.0 mi',
      grossMargin: '56.9%',
      freeCashFlow: 'R$ 29.4 mi',
      kpis: [
        { label: 'Receita YTD', value: 'R$ 57.5 mi', delta: '+28.9%', positive: true },
        { label: 'EBITDA YTD', value: 'R$ 30.0 mi', delta: '+33.4%', positive: true },
        { label: 'Margem Líquida', value: '32.8%', delta: '+5.2 p.p.', positive: true },
        { label: 'Valuation Estimado', value: 'R$ 265 mi', delta: '+36.5%', positive: true },
      ],
    },
  }

  const currentData = dataByPeriod[period]
  const maxVal = Math.max(...currentData.revenue)

  return (
    <div
      className={`rounded-2xl border border-slate-700/80 bg-gradient-to-b from-[#0F1E36] to-[#0A1526] text-white shadow-2xl p-5 sm:p-7 relative overflow-hidden backdrop-blur-xl ${className}`}
    >
      {/* Background glow effects */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#2563EB]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#E1A63E]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar with Live Indicator, Title and Period Selectors */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-700/70">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
            </span>
            <span className="text-[11px] font-bold tracking-widest uppercase text-emerald-400">
              Live Engine
            </span>
          </div>
          <span className="text-slate-600">•</span>
          <h3 className="text-sm font-extrabold text-slate-100 tracking-wide flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#E1A63E]" />
            {title}
          </h3>
        </div>

        {/* Period Switcher */}
        <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-700/80 self-start sm:self-auto">
          {(['3M', '6M', '12M', 'YTD'] as Period[]).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => handlePeriodChange(p)}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                period === p
                  ? 'bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards Row */}
      <div
        className={`grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 my-6 transition-opacity duration-200 ${
          isRefreshing ? 'opacity-50' : 'opacity-100'
        }`}
      >
        {currentData.kpis.map((kpi, idx) => (
          <div
            key={idx}
            className="p-3.5 sm:p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 hover:border-slate-500/60 transition-all hover:-translate-y-0.5"
          >
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block mb-1">
              {kpi.label}
            </span>
            <div className="flex items-baseline justify-between gap-1">
              <span className="text-base sm:text-xl font-black text-white tracking-tight">
                {kpi.value}
              </span>
              <span
                className={`text-[11px] font-bold inline-flex items-center ${
                  kpi.positive ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {kpi.positive ? (
                  <TrendingUp className="w-3 h-3 mr-0.5" />
                ) : (
                  <TrendingDown className="w-3 h-3 mr-0.5" />
                )}
                {kpi.delta}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Interactive Chart Section */}
      <div className="relative z-10 bg-slate-900/60 rounded-xl p-4 sm:p-5 border border-slate-700/60">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('dre')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'dre'
                  ? 'bg-blue-600/30 border border-blue-500 text-blue-300'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              DRE Gerencial (Receita × Custos)
            </button>
            <button
              onClick={() => setActiveTab('ebitda')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'ebitda'
                  ? 'bg-[#E1A63E]/20 border border-[#E1A63E] text-[#E1A63E]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              EBITDA & Margens
            </button>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#2563EB]" />
              <span>Receita</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#E1A63E]" />
              <span>EBITDA</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-slate-600" />
              <span>Custos</span>
            </div>
          </div>
        </div>

        {/* Dynamic Bar/Trend Chart with CSS & SVG */}
        <div className="h-44 sm:h-52 w-full flex items-end gap-2 sm:gap-3 pt-6 pb-2 px-1 relative">
          {/* Horizontal grid lines */}
          <div className="absolute inset-x-0 top-6 border-b border-slate-800/80 pointer-events-none" />
          <div className="absolute inset-x-0 top-1/2 border-b border-slate-800/80 pointer-events-none" />
          <div className="absolute inset-x-0 bottom-8 border-b border-slate-800/80 pointer-events-none" />

          {currentData.months.map((month, idx) => {
            const rev = currentData.revenue[idx]
            const ebitda = currentData.ebitda[idx]
            const cost = currentData.costs[idx]
            const revHeight = (rev / maxVal) * 100
            const ebitdaHeight = (ebitda / maxVal) * 100
            const costHeight = (cost / maxVal) * 100
            const isHovered = hoveredMonthIndex === idx

            return (
              <div
                key={month}
                onMouseEnter={() => setHoveredMonthIndex(idx)}
                onMouseLeave={() => setHoveredMonthIndex(null)}
                className="flex-1 flex flex-col items-center justify-end h-full group relative cursor-pointer"
              >
                {/* Floating Tooltip */}
                {isHovered && (
                  <div className="absolute -top-16 z-30 bg-slate-900 border border-slate-600 px-3 py-2 rounded-lg shadow-xl text-left min-w-[130px] pointer-events-none animate-fade-in">
                    <p className="text-[10px] font-bold text-slate-300 uppercase">{month} / 2026</p>
                    <p className="text-xs font-bold text-blue-400">Rec: R$ {rev.toFixed(1)} mi</p>
                    <p className="text-xs font-bold text-[#E1A63E]">
                      EBITDA: R$ {ebitda.toFixed(1)} mi
                    </p>
                    <p className="text-[10px] text-slate-400">Custos: R$ {cost.toFixed(1)} mi</p>
                  </div>
                )}

                {/* Bars group */}
                <div className="w-full flex items-end justify-center gap-1 sm:gap-1.5 h-full pb-6">
                  {/* Revenue Bar */}
                  <div
                    style={{ height: `${revHeight}%` }}
                    className={`w-2.5 sm:w-4 rounded-t bg-gradient-to-t from-blue-700 to-blue-400 transition-all duration-300 ${
                      isHovered ? 'brightness-125 scale-y-105' : 'group-hover:brightness-110'
                    }`}
                  />
                  {/* EBITDA Bar */}
                  <div
                    style={{ height: `${ebitdaHeight}%` }}
                    className={`w-2.5 sm:w-4 rounded-t bg-gradient-to-t from-[#B47517] to-[#E1A63E] transition-all duration-300 ${
                      isHovered ? 'brightness-125 scale-y-105' : 'group-hover:brightness-110'
                    }`}
                  />
                  {/* Cost Bar */}
                  <div
                    style={{ height: `${costHeight}%` }}
                    className={`hidden sm:block w-2.5 sm:w-3 rounded-t bg-slate-700 transition-all duration-300 ${
                      isHovered ? 'brightness-125' : ''
                    }`}
                  />
                </div>

                {/* Month label */}
                <span
                  className={`text-[10px] sm:text-xs font-semibold absolute bottom-0 transition-colors ${
                    isHovered ? 'text-[#E1A63E] font-bold' : 'text-slate-400'
                  }`}
                >
                  {month}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Bottom Insights Footer */}
      <div className="mt-5 pt-4 border-t border-slate-700/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Modelagem financeira auditada em tempo real com metodologia A² Strategic</span>
        </div>
        <div className="flex items-center gap-4 text-slate-300 font-semibold">
          <span>
            Margem Bruta: <strong className="text-white">{currentData.grossMargin}</strong>
          </span>
          <span>
            FCF: <strong className="text-emerald-400">{currentData.freeCashFlow}</strong>
          </span>
        </div>
      </div>
    </div>
  )
}
