import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { HeroCanvasScene } from './HeroCanvasScene'
import { useCountUp, usePrefersReducedMotion } from '@/hooks/use-reveal'
import { cn } from '@/lib/utils'

/** KPI com contagem animada quando entra em view (ou direto se reduced-motion). */
function HeroKpi({
  value,
  prefix,
  suffix,
  label,
  accent,
}: {
  value: number
  prefix?: string
  suffix?: string
  label: string
  accent?: 'gold' | 'silver'
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = usePrefersReducedMotion()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          obs.disconnect()
        }
      },
      { threshold: 0.4 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const animated = visible || reduced
  const count = useCountUp(value, animated ? 1400 : 0, reduced)
  const display = animated ? count : 0

  return (
    <div ref={ref} className="text-left">
      <span
        className={cn(
          'block text-3xl sm:text-4xl font-black tracking-tight tabular-nums',
          accent === 'gold' ? 'text-[#E1A63E]' : 'text-[#C8D3E4]',
        )}
      >
        {prefix}
        {display.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
        {suffix}
      </span>
      <span className="block text-[11px] sm:text-xs text-[#8DA2C0] mt-1 font-medium">{label}</span>
    </div>
  )
}

export function HeroSection() {
  const reduced = usePrefersReducedMotion()

  return (
    <section
      className="relative overflow-hidden"
      style={{ background: '#030C1E' }}
      aria-label="Apresentação institucional"
    >
      {/* Cenário canvas animado (gráfico vivo + partículas + grade) */}
      <HeroCanvasScene />

      {/* Halos radiais de profundidade */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 55% at 70% 30%, rgba(37, 99, 235, 0.16), transparent 65%), radial-gradient(ellipse 45% 40% at 20% 80%, rgba(225, 166, 62, 0.08), transparent 60%)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="min-h-[520px] sm:min-h-[600px] flex flex-col justify-center py-16 sm:py-20">
          <div className="max-w-2xl">
            <p
              className={cn(
                'text-xs font-bold uppercase tracking-[0.3em] text-[#E1A63E] mb-5',
                !reduced && 'animate-[fade-slide-up_0.9s_ease-out_both]',
              )}
            >
              Controladoria · Dados · Auditoria
            </p>

            <h1
              className={cn(
                'text-4xl sm:text-5xl lg:text-[3.6rem] font-black text-white leading-[1.05] tracking-tight',
                !reduced && 'animate-[fade-slide-up_1.1s_ease-out_0.15s_both]',
              )}
            >
              Inteligência que move o seu negócio
            </h1>

            <p
              className={cn(
                'mt-6 text-base sm:text-lg text-[#9FB2CF] leading-relaxed max-w-xl',
                !reduced && 'animate-[fade-slide-up_1.1s_ease-out_0.3s_both]',
              )}
            >
              Da planilha ao dashboard executivo: estruture a controladoria, domine os dados e
              transforme números em decisões.
            </p>

            <div
              className={cn(
                'mt-9 flex flex-wrap items-center gap-4',
                !reduced && 'animate-[fade-slide-up_1.1s_ease-out_0.45s_both]',
              )}
            >
              <Link
                to="/catalogo"
                className="inline-flex items-center px-7 py-3.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-sm shadow-lg shadow-blue-900/40 transition-all hover:-translate-y-0.5"
              >
                Explorar soluções
              </Link>
              <Link
                to="/dashboard"
                className="inline-flex items-center px-7 py-3.5 rounded-xl border border-[#2A3B5A] text-[#C8D3E4] hover:border-[#E1A63E] hover:text-[#E1A63E] font-bold text-sm transition-all"
              >
                Ver dashboard ABC
              </Link>
            </div>

            {/* Barra de KPIs com contagem */}
            <div
              className={cn(
                'mt-14 grid grid-cols-3 gap-6 border-t border-[#1B2A45] pt-8',
                !reduced && 'animate-[fade-slide-up_1.1s_ease-out_0.6s_both]',
              )}
            >
              <HeroKpi value={4} label="Frentes de atuação" accent="gold" />
              <HeroKpi value={6} label="Programas no portfólio" accent="silver" />
              <HeroKpi value={12} suffix=" meses" label="Visão consolidada" accent="silver" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
