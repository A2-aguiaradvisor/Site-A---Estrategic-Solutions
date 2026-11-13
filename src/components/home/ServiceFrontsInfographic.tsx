import React, { useState } from 'react'
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
import { useInView, usePrefersReducedMotion } from '@/hooks/use-reveal'

/**
 * Interactive infographic for the four structural service fronts + ESG.
 * The exact copy comes from INSTITUTIONAL_SERVICE_FRONTS / ESG_CAPABILITY
 * (imported from ServiceFronts.tsx) — text is never reworded here.
 * Visual: SVG connection diagram with hover/click nodes + bullet panels.
 */

import {
  INSTITUTIONAL_SERVICE_FRONTS,
  ESG_CAPABILITY,
  PORTFOLIO_STATEMENT,
  type ServiceFront,
} from '@/components/ServiceFronts'

const FRONT_COLORS: Record<string, { base: string; soft: string }> = {
  'frente-1': { base: '#2563EB', soft: 'rgba(37,99,235,0.14)' },
  'frente-2': { base: '#E1A63E', soft: 'rgba(225,166,62,0.14)' },
  'frente-3': { base: '#38BDF8', soft: 'rgba(56,189,248,0.14)' },
  'frente-4': { base: '#818CF8', soft: 'rgba(129,140,248,0.14)' },
}

const FRONT_ICONS: Record<
  string,
  React.ComponentType<{ className?: string; style?: React.CSSProperties }>
> = {
  'frente-1': TrendingUp,
  'frente-2': Sliders,
  'frente-3': BarChart4,
  'frente-4': CalendarDays,
}

const diagramNodes = [
  { id: 'frente-1', x: 140, y: 70 },
  { id: 'frente-2', x: 580, y: 70 },
  { id: 'frente-3', x: 140, y: 210 },
  { id: 'frente-4', x: 580, y: 210 },
]
const HUB = { x: 360, y: 140 }

export const ServiceFrontsInfographic: React.FC = () => {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.2 })
  const reduced = usePrefersReducedMotion()
  const [activeId, setActiveId] = useState<string>('frente-1')

  const active: ServiceFront =
    INSTITUTIONAL_SERVICE_FRONTS.find((f) => f.id === activeId) ?? INSTITUTIONAL_SERVICE_FRONTS[0]
  const ActiveIcon = FRONT_ICONS[active.id]

  return (
    <div ref={ref}>
      {/* Institutional statement card (exact text preserved) */}
      <div className="p-5 sm:p-6 rounded-2xl border border-slate-700/80 bg-gradient-to-r from-[#0F1E36] to-[#1F3A5F] text-white mb-10">
        <div className="flex items-start gap-3.5">
          <div className="p-2 rounded-xl bg-[#E1A63E]/15 text-[#E1A63E] flex-shrink-0 mt-0.5">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#E1A63E] block mb-1">
              Apresentação Institucional • Arquitetura Modular
            </span>
            <p className="text-sm sm:text-base font-semibold leading-relaxed text-slate-100">
              {PORTFOLIO_STATEMENT}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* SVG connection diagram */}
        <div className="lg:col-span-5">
          <div className="rounded-2xl border border-slate-800 bg-[#0A1526]/70 p-4 sm:p-6">
            <svg viewBox="0 0 720 280" className="w-full h-auto">
              {/* connection lines: central hub -> each front node */}
              {diagramNodes.map((n, i) => {
                const activeLine = activeId === n.id
                const dx = n.x - HUB.x
                const dy = n.y - HUB.y
                const len = Math.hypot(dx, dy)
                const ux = dx / len
                const uy = dy / len
                return (
                  <line
                    key={n.id}
                    x1={HUB.x + ux * 34}
                    y1={HUB.y + uy * 34}
                    x2={n.x - ux * 46}
                    y2={n.y - uy * 46}
                    stroke={FRONT_COLORS[n.id].base}
                    strokeWidth={activeLine ? 2.5 : 1.2}
                    strokeOpacity={activeLine ? 0.9 : 0.3}
                    strokeDasharray="4 6"
                    className={reduced ? '' : 'hero-dash-flow'}
                    style={{ animationDelay: `${i * 0.4}s` }}
                  />
                )
              })}

              {/* central hub */}
              <circle
                cx={HUB.x}
                cy={HUB.y}
                r="34"
                fill="#0F1E36"
                stroke="#E1A63E"
                strokeWidth="2"
              />
              <circle
                cx={HUB.x}
                cy={HUB.y}
                r="42"
                fill="none"
                stroke="#E1A63E"
                strokeOpacity="0.3"
                strokeWidth="1"
                className={reduced ? '' : 'hub-rings'}
              />
              <text
                x={HUB.x}
                y={HUB.y - 2}
                textAnchor="middle"
                fontSize="18"
                fontWeight="800"
                fill="#E2E8F0"
              >
                A²
              </text>
              <text
                x={HUB.x}
                y={HUB.y + 14}
                textAnchor="middle"
                fontSize="7"
                fill="#94A3B8"
                letterSpacing="1"
              >
                STRATEGIC
              </text>

              {diagramNodes.map((n, i) => {
                const front = INSTITUTIONAL_SERVICE_FRONTS.find((f) => f.id === n.id)
                if (!front) return null
                const Icon = FRONT_ICONS[n.id]
                const isActive = activeId === n.id
                const color = FRONT_COLORS[n.id]

                return (
                  <g
                    key={n.id}
                    onClick={() => setActiveId(n.id)}
                    onMouseEnter={() => setActiveId(n.id)}
                    className="cursor-pointer"
                    role="button"
                    aria-label={front.shortTitle}
                  >
                    <circle
                      cx={n.x}
                      cy={n.y}
                      r="44"
                      fill={color.soft}
                      stroke={color.base}
                      strokeWidth={isActive ? 3 : 1.5}
                      style={{
                        opacity: inView || reduced ? 1 : 0,
                        transition: `opacity 0.5s ease ${0.15 * i}s`,
                      }}
                    />
                    <foreignObject x={n.x - 20} y={n.y - 20} width="40" height="40">
                      <div className="flex items-center justify-center w-10 h-10">
                        <Icon className="w-6 h-6" style={{ color: color.base }} />
                      </div>
                    </foreignObject>
                    <text
                      x={n.x}
                      y={n.y + 66}
                      textAnchor="middle"
                      fontSize="11"
                      fontWeight="700"
                      fill={isActive ? color.base : '#94A3B8'}
                    >
                      {front.number}
                    </text>
                  </g>
                )
              })}
            </svg>
            <p className="text-center text-[11px] text-slate-500 mt-2">
              Toque ou passe o mouse sobre um nó para detalhar a frente
            </p>
          </div>
        </div>

        {/* Active front detail panel (exact bullets from the institutional data) */}
        <div className="lg:col-span-7">
          <div className="rounded-2xl border border-slate-800 bg-[#0B1527]/90 p-6 sm:p-7 min-h-[320px]">
            <div className="flex items-center justify-between gap-3 mb-5">
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border"
                style={{
                  color: FRONT_COLORS[active.id].base,
                  borderColor: FRONT_COLORS[active.id].base,
                  background: FRONT_COLORS[active.id].soft,
                }}
              >
                <ActiveIcon className="w-3.5 h-3.5" />
                <span>{active.number}</span>
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Modular
              </span>
            </div>

            <h3 className="text-lg font-bold text-white mb-5">{active.shortTitle}</h3>

            <ul className="space-y-3.5">
              {active.bullets.map((bullet, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 text-xs sm:text-sm leading-relaxed text-slate-300"
                  style={
                    reduced
                      ? undefined
                      : { animation: `hero-fade-slide 0.9s ease-out ${idx * 0.18}s both` }
                  }
                >
                  <CheckCircle2
                    className="w-4 h-4 flex-shrink-0 mt-0.5"
                    style={{ color: FRONT_COLORS[active.id].base }}
                  />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ESG complementary capability (exact text preserved) */}
      <div className="mt-10 rounded-2xl p-6 sm:p-7 border border-emerald-800/40 bg-gradient-to-br from-emerald-950/40 via-[#0B1527] to-[#0F1E36]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-emerald-500/20">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Leaf className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 block">
                Capacidade Complementar
              </span>
              <h4 className="text-base sm:text-lg font-bold text-white">
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
              className="flex items-start gap-2.5 text-xs sm:text-sm leading-relaxed p-3 rounded-xl bg-white/5 text-slate-300"
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
