import React, { useMemo, useState } from 'react'
import { useInView, usePrefersReducedMotion } from '@/hooks/use-reveal'

/**
 * Animated financial line chart for the hero.
 * Pure SVG: three series (Receita, Custos, EBITDA) draw themselves with
 * stroke-dashoffset when the component enters the viewport, with an
 * interactive tooltip on hover. Data mirrors the dashboard simulation
 * already on the home page (R$ milhões).
 */

const REVENUE = [4.2, 4.8, 5.4, 5.9, 6.3, 7.1, 7.4, 7.9, 8.5, 8.9, 9.4, 10.2]
const COSTS = [2.1, 2.3, 2.5, 2.7, 2.8, 3.1, 3.2, 3.3, 3.5, 3.6, 3.8, 4.0]
const EBITDA = [2.1, 2.5, 2.9, 3.2, 3.5, 4.0, 4.2, 4.6, 5.0, 5.3, 5.6, 6.2]
const MONTHS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

const W = 720
const H = 280
const PAD = { top: 24, right: 16, bottom: 34, left: 44 }

export const HeroChart: React.FC = () => {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.25 })
  const reduced = usePrefersReducedMotion()
  const [hover, setHover] = useState<number | null>(null)

  const play = inView || reduced

  const { x, y, paths, areaPath, points } = useMemo(() => {
    const maxVal = 12
    const innerW = W - PAD.left - PAD.right
    const innerH = H - PAD.top - PAD.bottom

    const x = (i: number) => PAD.left + (i / (REVENUE.length - 1)) * innerW
    const y = (v: number) => PAD.top + innerH - (v / maxVal) * innerH

    const build = (data: number[]) =>
      data.map((v, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ')

    const revenuePath = build(REVENUE)
    const areaPath = `${revenuePath} L${x(REVENUE.length - 1)},${y(0)} L${x(0)},${y(0)} Z`

    const points = REVENUE.map((v, i) => ({ cx: x(i), cy: y(v), v, i }))

    return {
      x,
      y,
      paths: { revenue: revenuePath, costs: build(COSTS), ebitda: build(EBITDA) },
      areaPath,
      points,
    }
  }, [])

  return (
    <div ref={ref} className="w-full">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto select-none"
        role="img"
        aria-label="Evolução simulada de receita, custos e EBITDA em 12 meses"
        onMouseLeave={() => setHover(null)}
      >
        <defs>
          <linearGradient id="heroAreaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2563EB" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="heroLineGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="100%" stopColor="#2563EB" />
          </linearGradient>
        </defs>

        {/* grid lines */}
        {[0, 4, 8, 12].map((v) => (
          <g key={v}>
            <line
              x1={PAD.left}
              x2={W - PAD.right}
              y1={y(v)}
              y2={y(v)}
              stroke="#1E293B"
              strokeWidth="1"
              strokeDasharray="3 5"
            />
            <text x={PAD.left - 8} y={y(v) + 4} textAnchor="end" fontSize="10" fill="#64748B">
              {v}
            </text>
          </g>
        ))}

        {/* month labels */}
        {MONTHS.map((m, i) => (
          <text key={m} x={x(i)} y={H - 10} textAnchor="middle" fontSize="10" fill="#64748B">
            {i % 2 === 0 || hover === i ? m : ''}
          </text>
        ))}

        {/* area under revenue */}
        <path
          d={areaPath}
          fill="url(#heroAreaGrad)"
          className={play || reduced ? 'opacity-100' : 'opacity-0'}
          style={{ transition: 'opacity 1.2s ease 0.6s' }}
        />

        {/* lines drawing themselves */}
        {(
          [
            { d: paths.costs, color: '#475569', width: 2, dash: 1400, delay: 0.2 },
            { d: paths.ebitda, color: '#E1A63E', width: 2.5, dash: 1400, delay: 0.1 },
            { d: paths.revenue, color: 'url(#heroLineGrad)', width: 3, dash: 1600, delay: 0 },
          ] as const
        ).map((s, idx) => (
          <path
            key={idx}
            d={s.d}
            fill="none"
            stroke={s.color}
            strokeWidth={s.width}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              strokeDasharray: s.dash,
              strokeDashoffset: play ? 0 : s.dash,
              transition: `stroke-dashoffset 1.8s cubic-bezier(0.22,1,0.36,1) ${s.delay}s`,
              opacity: play ? 1 : 0,
            }}
          />
        ))}

        {/* end-of-line pulse dot */}
        <circle
          cx={points[points.length - 1].cx}
          cy={points[points.length - 1].cy}
          r="4"
          fill="#60A5FA"
          className={play ? 'hero-pulse-dot' : 'opacity-0'}
        />

        {/* hover columns + markers */}
        {points.map((p) => (
          <g key={p.i}>
            <rect
              x={p.cx - (W - PAD.left - PAD.right) / (REVENUE.length - 1) / 2}
              y={PAD.top}
              width={(W - PAD.left - PAD.right) / (REVENUE.length - 1)}
              height={H - PAD.top - PAD.bottom}
              fill="transparent"
              onMouseEnter={() => setHover(p.i)}
            />
            {hover === p.i && (
              <>
                <line
                  x1={p.cx}
                  x2={p.cx}
                  y1={PAD.top}
                  y2={H - PAD.bottom}
                  stroke="#94A3B8"
                  strokeWidth="1"
                  strokeDasharray="2 4"
                />
                <circle cx={p.cx} cy={p.cy} r="5" fill="#2563EB" stroke="#0F1E36" strokeWidth="2" />
              </>
            )}
          </g>
        ))}
      </svg>

      {/* Floating tooltip (HTML for crisp text) */}
      {hover !== null && (
        <div
          className="pointer-events-none absolute z-20 rounded-xl border border-slate-600 bg-[#0A1526]/95 px-3 py-2 shadow-2xl backdrop-blur-md"
          style={{
            left: `${(x(hover) / W) * 100}%`,
            top: 0,
            transform: `translateX(${hover > 9 ? '-100%' : hover < 2 ? '0%' : '-50%'})`,
          }}
        >
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {MONTHS[hover]} / 2026
          </p>
          <p className="text-xs font-bold text-blue-400">Rec: R$ {REVENUE[hover].toFixed(1)} mi</p>
          <p className="text-xs font-bold text-[#E1A63E]">
            EBITDA: R$ {EBITDA[hover].toFixed(1)} mi
          </p>
          <p className="text-[10px] text-slate-400">Custos: R$ {COSTS[hover].toFixed(1)} mi</p>
        </div>
      )}

      {/* Legend */}
      <div className="mt-2 flex items-center justify-center gap-5 text-[11px] text-slate-400">
        <span className="flex items-center gap-1.5">
          <span className="h-0.5 w-4 rounded-full bg-[#2563EB]" /> Receita
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-0.5 w-4 rounded-full bg-[#E1A63E]" /> EBITDA
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-0.5 w-4 rounded-full bg-slate-500" /> Custos
        </span>
      </div>
    </div>
  )
}
