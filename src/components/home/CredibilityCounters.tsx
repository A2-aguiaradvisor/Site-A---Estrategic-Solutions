import React from 'react'
import { ShieldCheck, Layers, Leaf, Cpu } from 'lucide-react'
import { useCountUp, useInView, usePrefersReducedMotion } from '@/hooks/use-reveal'
import { Reveal } from '@/components/home/Reveal'

/**
 * Animated credibility counters. ONLY facts already present in the site:
 * 4 frentes estruturais + 1 capacidade complementar (ESG) + 6 programas na
 * escada de soluções + 12 meses de visão nos painéis (Rolling Forecast).
 */

interface Stat {
  value: number
  suffix: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  accent: string
}

const STATS: Stat[] = [
  {
    value: 4,
    suffix: '',
    label: 'Frentes estruturais de atuação',
    icon: Layers,
    accent: 'text-[#2563EB]',
  },
  {
    value: 6,
    suffix: '',
    label: 'Programas na escada de soluções',
    icon: Cpu,
    accent: 'text-[#E1A63E]',
  },
  {
    value: 12,
    suffix: ' meses',
    label: 'Horizonte de projeção e forecast',
    icon: ShieldCheck,
    accent: 'text-emerald-400',
  },
  {
    value: 1,
    suffix: '',
    label: 'Capacidade complementar: ESG',
    icon: Leaf,
    accent: 'text-sky-400',
  },
]

const StatItem: React.FC<{ stat: Stat; index: number; start: boolean }> = ({
  stat,
  index,
  start,
}) => {
  const reduced = usePrefersReducedMotion()
  const value = useCountUp(stat.value, start)
  const Icon = stat.icon

  return (
    <Reveal delay={index * 120} direction="up">
      <div className="flex flex-col items-center text-center px-4 py-6 rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] transition-colors duration-300">
        <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 mb-4">
          <Icon className={`w-5 h-5 ${stat.accent}`} />
        </div>
        <span className="text-4xl sm:text-5xl font-black tracking-tight text-white tabular-nums leading-none">
          {Math.round(value)}
          <span className="text-lg font-bold text-[#E1A63E] ml-0.5">{stat.suffix}</span>
        </span>
        <p className="mt-2.5 text-xs sm:text-sm text-slate-400 leading-snug max-w-[200px]">
          {stat.label}
        </p>
      </div>
    </Reveal>
  )
}

export const CredibilityCounters: React.FC = () => {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.3 })

  return (
    <section className="relative py-16 sm:py-20 bg-[#070D18] border-y border-slate-800/80 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(37,99,235,0.12),transparent_65%)] pointer-events-none" />
      <div
        ref={ref}
        className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
      >
        {STATS.map((stat, i) => (
          <StatItem key={stat.label} stat={stat} index={i} start={inView} />
        ))}
      </div>
    </section>
  )
}
