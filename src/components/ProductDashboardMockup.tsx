import React, { useState } from 'react'
import {
  Sparkles,
  PieChart,
  BarChart,
  TrendingUp,
  Sliders,
  DollarSign,
  Maximize2,
  CheckCircle,
} from 'lucide-react'

export type ProductDashboardVariant = 'mentoria' | 'valuation' | 'governanca' | 'curso' | 'geral'

interface ProductDashboardMockupProps {
  variant?: ProductDashboardVariant
  className?: string
}

export const ProductDashboardMockup: React.FC<ProductDashboardMockupProps> = ({
  variant = 'geral',
  className = '',
}) => {
  const [activeScenario, setActiveScenario] = useState<'conservador' | 'base' | 'otimista'>('base')

  const scenarioMultiplier =
    activeScenario === 'conservador' ? 0.85 : activeScenario === 'otimista' ? 1.3 : 1.0

  return (
    <div
      className={`rounded-2xl border border-slate-700/80 bg-gradient-to-br from-[#0F1E36] via-[#0C1729] to-[#08101E] text-white p-5 sm:p-6 shadow-xl relative overflow-hidden ${className}`}
    >
      {/* Background radial glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#2563EB]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#E1A63E]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header of the Embedded Screen */}
      <div className="relative z-10 flex items-center justify-between pb-4 border-b border-slate-700/70">
        <div className="flex items-center gap-2.5">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <span className="text-xs font-mono text-slate-400">
            app.a2strategic.com.br/analytics/{variant}
          </span>
        </div>

        {/* Scenario Selector */}
        <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-lg border border-slate-700/80">
          {(['conservador', 'base', 'otimista'] as const).map((sc) => (
            <button
              key={sc}
              type="button"
              onClick={() => setActiveScenario(sc)}
              className={`px-2.5 py-1 text-[11px] font-bold rounded capitalize transition-all ${
                activeScenario === sc
                  ? 'bg-[#2563EB] text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {sc}
            </button>
          ))}
        </div>
      </div>

      {/* Dynamic Content based on Variant */}
      <div className="relative z-10 pt-5 space-y-4">
        {/* KPI Mini Grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              Valuation Base
            </span>
            <span className="text-base sm:text-lg font-black text-white">
              R$ {(28.4 * scenarioMultiplier).toFixed(1)} mi
            </span>
            <span className="text-[10px] text-emerald-400 font-semibold block mt-0.5">
              +{(32 * scenarioMultiplier).toFixed(0)}% vs ano ant.
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              Múltiplo EV/EBITDA
            </span>
            <span className="text-base sm:text-lg font-black text-[#E1A63E]">
              {(7.8 * scenarioMultiplier).toFixed(1)}x
            </span>
            <span className="text-[10px] text-blue-300 font-semibold block mt-0.5">
              Benchmark top 10%
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              Índice Governança
            </span>
            <span className="text-base sm:text-lg font-black text-emerald-400">
              {Math.min(98, Math.round(88 * scenarioMultiplier))}/100
            </span>
            <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">
              Padrão IBGC
            </span>
          </div>
        </div>

        {/* Interactive Visual Element: SVG Simulated Waterfall / Donut */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-700/60">
          <div className="flex items-center justify-between mb-3 text-xs">
            <span className="font-bold text-slate-200 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-[#E1A63E]" />
              Projeção de Tração & Geração de Caixa (5 Anos)
            </span>
            <span className="text-[11px] text-slate-400 font-mono">Taxa desc: 11.5% a.a.</span>
          </div>

          {/* Sparkline / Bar projection */}
          <div className="h-28 w-full flex items-end gap-2 pt-4 px-1 pb-1">
            {[
              { year: '2024', val: 12 * scenarioMultiplier, color: 'from-blue-600 to-blue-400' },
              { year: '2025', val: 18 * scenarioMultiplier, color: 'from-blue-600 to-blue-400' },
              { year: '2026', val: 26 * scenarioMultiplier, color: 'from-[#B47517] to-[#E1A63E]' },
              {
                year: '2027P',
                val: 38 * scenarioMultiplier,
                color: 'from-emerald-600 to-emerald-400',
              },
              {
                year: '2028P',
                val: 54 * scenarioMultiplier,
                color: 'from-purple-600 to-indigo-400',
              },
            ].map((col) => (
              <div
                key={col.year}
                className="flex-1 flex flex-col items-center justify-end h-full group"
              >
                <span className="text-[10px] text-slate-300 font-mono mb-1 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                  R$ {col.val.toFixed(0)}M
                </span>
                <div
                  style={{ height: `${(col.val / (54 * scenarioMultiplier)) * 100}%` }}
                  className={`w-full max-w-[42px] rounded-t bg-gradient-to-t ${col.color} transition-all duration-300 group-hover:brightness-125`}
                />
                <span className="text-[10px] font-semibold text-slate-400 mt-1">{col.year}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Feature Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[11px] text-slate-300">
            <CheckCircle className="w-3 h-3 text-emerald-400" /> Modelagem DRE em tempo real
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[11px] text-slate-300">
            <CheckCircle className="w-3 h-3 text-emerald-400" /> Alerta de Sensibilidade de Caixa
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[11px] text-slate-300">
            <CheckCircle className="w-3 h-3 text-emerald-400" /> Exportação executiva para PDF/Board
          </span>
        </div>
      </div>
    </div>
  )
}
