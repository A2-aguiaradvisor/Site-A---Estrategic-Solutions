import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle2, Cpu } from 'lucide-react'
import { Reveal } from '@/components/home/Reveal'
import { usePrefersReducedMotion } from '@/hooks/use-reveal'

/**
 * Seção de vídeo financeiro: painel animado em loop ("dashboard sendo
 * construído") com KPIs que preenchem, barras que crescem e linha que se
 * desenha — seguido do vídeo institucional já existente (TechDemoVideoEmbed).
 * Respeita prefers-reduced-motion (painel renderizado estático).
 */

const DASH_BARS = [42, 58, 35, 72, 50, 88, 64, 95, 76]
const DASH_POINTS = [30, 44, 38, 58, 52, 74, 66, 86, 80, 92]

function useLoopProgress(active: boolean, durationMs = 3200) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!active) {
      setProgress(1)
      return
    }
    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      const t = ((now - start) % durationMs) / durationMs
      setProgress(t)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [active, durationMs])

  return progress
}

function AnimatedDashboardPanel() {
  const reduced = usePrefersReducedMotion()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const progress = useLoopProgress(!reduced)

  // painel canvas: linha de receita desenhando em loop + grid
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = Math.round(rect.width * dpr)
    canvas.height = Math.round(rect.height * dpr)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    const w = rect.width
    const h = rect.height
    const points = DASH_POINTS
    const stepX = w / (points.length - 1)
    const reveal = reduced ? 1 : Math.min(1, progress * 1.4)

    ctx.clearRect(0, 0, w, h)

    // grid
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.09)'
    ctx.lineWidth = 1
    for (let y = 0; y < h; y += 28) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(w, y)
      ctx.stroke()
    }
    for (let x = 0; x < w; x += 44) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, h)
      ctx.stroke()
    }

    const yFor = (i: number) => h - (points[i] / 100) * h * 0.86 - h * 0.06

    // fill
    ctx.beginPath()
    ctx.moveTo(0, h)
    for (let i = 0; i < points.length; i++) {
      const x = i * stepX
      if (i === 0) ctx.lineTo(x, yFor(i))
      else ctx.lineTo(x, yFor(i))
    }
    const lastIdx = Math.max(1, Math.floor((points.length - 1) * reveal))
    ctx.lineTo(lastIdx * stepX, h)
    ctx.closePath()
    const grad = ctx.createLinearGradient(0, 0, 0, h)
    grad.addColorStop(0, 'rgba(37, 99, 235, 0.30)')
    grad.addColorStop(1, 'rgba(37, 99, 235, 0)')
    ctx.fillStyle = grad
    ctx.fill()

    // line
    ctx.beginPath()
    for (let i = 0; i <= lastIdx; i++) {
      const x = i * stepX
      const y = yFor(i)
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.lineWidth = 2.4
    ctx.strokeStyle = '#C8D3E4'
    ctx.shadowColor = 'rgba(225, 166, 62, 0.6)'
    ctx.shadowBlur = 12
    ctx.stroke()
    ctx.shadowBlur = 0
  }, [progress, reduced])

  const shownBars = reduced ? DASH_BARS.length : Math.ceil(progress * DASH_BARS.length)

  return (
    <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#050D1C] shadow-2xl">
      {/* header bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-white/5 border-b border-white/10">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#E1A63E]/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB]/60" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#94A3B8]/40" />
        </div>
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#8DA2C0]">
          Dashboard Financeiro • A² Engine
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 p-4">
        {/* KPIs */}
        <div className="sm:col-span-2 space-y-3">
          {[
            { label: 'Receita', value: 'R$ 1.24M', color: '#2563EB', pct: 78 },
            { label: 'EBITDA', value: '18.4%', color: '#E1A63E', pct: 52 },
            { label: 'Liquidez', value: '2.1x', color: '#94A3B8', pct: 64 },
          ].map((kpi, i) => {
            const show = reduced || i < shownBars
            return (
              <div
                key={kpi.label}
                className={`rounded-xl border border-white/10 bg-white/[0.03] p-3 transition-opacity duration-500 ${
                  show ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8DA2C0]">
                    {kpi.label}
                  </span>
                  <span className="text-sm font-black tabular-nums" style={{ color: kpi.color }}>
                    {kpi.value}
                  </span>
                </div>
                <div className="mt-2 h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: show ? `${kpi.pct}%` : '0%',
                      background: kpi.color,
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>

        {/* Chart */}
        <div className="sm:col-span-3 rounded-xl border border-white/10 bg-white/[0.02] p-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8DA2C0]">
            Receita × 12 meses
          </span>
          <canvas ref={canvasRef} className="w-full h-28 sm:h-32 mt-2" aria-hidden="true" />
          {/* animated bars */}
          <div className="flex items-end gap-1.5 h-14 mt-2">
            {DASH_BARS.map((b, i) => {
              const show = reduced || i < shownBars
              return (
                <div
                  key={i}
                  className="flex-1 rounded-t-sm transition-all duration-500"
                  style={{
                    height: show ? `${b}%` : '0%',
                    background:
                      i % 3 === 0 ? 'rgba(225, 166, 62, 0.75)' : 'rgba(37, 99, 235, 0.55)',
                  }}
                />
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export function DashboardBuildShowcase() {
  return (
    <section className="py-20 bg-[#0B1527] text-white border-b border-slate-800 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(37,99,235,0.15),transparent_60%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left explanation */}
          <Reveal direction="right" className="lg:col-span-5 space-y-6">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-bold text-[#E1A63E] uppercase tracking-wider">
                <Cpu className="w-3.5 h-3.5" />
                Tecnologia & Fechamento Ágil
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
                Veja a inteligência estratégica acontecendo na prática.
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
                A <strong>A² Strategic Solutions</strong> combina rotinas de controladoria com
                modelos analíticos e visões interativas que conferem agilidade ao fechamento
                contábil e gerencial.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-white">DRE Gerencial em Minutos</h4>
                    <p className="text-xs text-slate-400">
                      Orçado vs. Realizado consolidado por centros de custo e unidades de negócio.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#E1A63E] flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      Valuation & Cenários Operacionais
                    </h4>
                    <p className="text-xs text-slate-400">
                      Simulação de cenários (Conservador, Base, Otimista) com testes de estresse de
                      liquidez.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      Governança & Políticas Internas
                    </h4>
                    <p className="text-xs text-slate-400">
                      Alçadas de aprovação, auditoria de processos e segregação estrita de funções.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/catalogo"
                  className="inline-flex items-center gap-2 text-sm font-bold text-[#E1A63E] hover:text-yellow-300 transition-colors"
                >
                  <span>Conhecer todos os pacotes e mentoria</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </Reveal>

          {/* Right: animated dashboard demo ("vídeo" em loop) + vídeo institucional */}
          <Reveal direction="left" delay={150} className="lg:col-span-7 space-y-6">
            <AnimatedDashboardPanel />
          </Reveal>
        </div>
      </div>
    </section>
  )
}
