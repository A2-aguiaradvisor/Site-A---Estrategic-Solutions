import { useEffect, useRef } from 'react'
import { usePrefersReducedMotion } from '@/hooks/use-reveal'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  gold: boolean
}

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

/**
 * Cenário animado do hero: linha de dados (gráfico de receita) desenhada em
 * canvas com gradiente preenchido, partículas ascendentes sutis e grade —
 * paleta navy/prata/dourado sobre #030C1E.
 *
 * Ritmo "premium e calmo": a curva deriva quase imperceptivelmente (fatores de
 * tempo ~8× mais lentos), a linha se revela em ~4s com easing suave e as
 * partículas sobem devagar, sem tremores nem pulsos rápidos.
 * Respeita prefers-reduced-motion (renderiza um frame estático).
 */
export function HeroCanvasScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    let width = 0
    let height = 0
    let dpr = 1
    const particles: Particle[] = []

    const GOLD = '225, 166, 62'
    const BLUE = '37, 99, 235'
    const SILVER = '148, 163, 184'

    function resize() {
      const rect = canvas!.getBoundingClientRect()
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = rect.width
      height = rect.height
      canvas!.width = Math.round(width * dpr)
      canvas!.height = Math.round(height * dpr)
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    function seedParticles() {
      particles.length = 0
      const count = Math.min(40, Math.max(18, Math.floor(width / 32)))
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: height + Math.random() * height * 0.6,
          // deriva muito lenta: px por frame ~0.03–0.08
          vx: (Math.random() - 0.5) * 0.035,
          vy: -(0.02 + Math.random() * 0.055),
          size: 0.8 + Math.random() * 1.6,
          opacity: 0.12 + Math.random() * 0.4,
          gold: Math.random() < 0.22,
        })
      }
    }

    // Série "financeira" suave — mistura de senos com deriva temporal lenta
    function curveY(x: number, w: number, h: number, time: number): number {
      const px = x / w
      const base = h * 0.62
      const amp = h * 0.2
      return (
        base -
        amp * 0.55 * Math.sin(px * Math.PI * 1.6 + time * 0.045) -
        amp * 0.3 * Math.sin(px * Math.PI * 3.4 - time * 0.03) -
        amp * 0.15 * Math.sin(px * Math.PI * 6.1 + time * 0.06)
      )
    }

    function drawCurve(time: number, reveal: number) {
      const w = width
      const h = height
      const points = 90
      const step = w / points
      const maxY = Math.min(
        ...Array.from({ length: points + 1 }, (_, i) => curveY(i * step, w, h, time)),
      )
      const visible = points * reveal

      ctx!.lineJoin = 'round'
      ctx!.lineCap = 'round'

      // Área preenchida
      ctx!.beginPath()
      for (let i = 0; i <= visible; i++) {
        const x = i * step
        const y = curveY(x, w, h, time)
        if (i === 0) ctx!.moveTo(x, y)
        else ctx!.lineTo(x, y)
      }
      const lastX = visible * step
      ctx!.lineTo(lastX, h)
      ctx!.lineTo(0, h)
      ctx!.closePath()
      const fill = ctx!.createLinearGradient(0, maxY, 0, h)
      fill.addColorStop(0, `rgba(${BLUE}, 0.26)`)
      fill.addColorStop(1, 'rgba(37, 99, 235, 0)')
      ctx!.fillStyle = fill
      ctx!.fill()

      // Linha principal com brilho contido (sem pulsação)
      ctx!.beginPath()
      for (let i = 0; i <= visible; i++) {
        const x = i * step
        const y = curveY(x, w, h, time)
        if (i === 0) ctx!.moveTo(x, y)
        else ctx!.lineTo(x, y)
      }
      ctx!.lineWidth = 2
      ctx!.strokeStyle = `rgba(${SILVER}, 0.85)`
      ctx!.shadowColor = `rgba(${GOLD}, 0.4)`
      ctx!.shadowBlur = 10
      ctx!.stroke()
      ctx!.shadowBlur = 0

      // Linha dourada paralela (diferença de fase = "cenário projetado")
      ctx!.beginPath()
      for (let i = 0; i <= visible; i++) {
        const x = i * step
        const y = curveY(x + w * 0.06, w, h, time + 8) - h * 0.05
        if (i === 0) ctx!.moveTo(x, y)
        else ctx!.lineTo(x, y)
      }
      ctx!.lineWidth = 1.3
      ctx!.strokeStyle = `rgba(${GOLD}, 0.6)`
      ctx!.stroke()
    }

    function drawParticles(time: number) {
      for (const p of particles) {
        // cintilar lento e suave (período de vários segundos, amplitude baixa)
        const twinkle = 0.8 + 0.2 * Math.sin(time * 0.45 + p.x * 0.012)
        ctx!.beginPath()
        ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx!.fillStyle = `rgba(${p.gold ? GOLD : SILVER}, ${(p.opacity * twinkle).toFixed(3)})`
        ctx!.fill()

        if (!reducedMotion) {
          p.x += p.vx
          p.y += p.vy
          if (p.y < -4) {
            p.y = height + 4
            p.x = Math.random() * width
          }
          if (p.x < -4) p.x = width + 4
          if (p.x > width + 4) p.x = -4
        }
      }
    }

    function drawGrid() {
      ctx!.strokeStyle = 'rgba(148, 163, 184, 0.06)'
      ctx!.lineWidth = 1
      const gap = 44
      for (let x = gap; x < width; x += gap) {
        ctx!.beginPath()
        ctx!.moveTo(x, 0)
        ctx!.lineTo(x, height)
        ctx!.stroke()
      }
      for (let y = gap; y < height; y += gap) {
        ctx!.beginPath()
        ctx!.moveTo(0, y)
        ctx!.lineTo(width, y)
        ctx!.stroke()
      }
    }

    const startedAt = performance.now()

    function render(nowMs: number) {
      // `time` = segundos desde a montagem (não desde a abertura do navegador),
      // para que a revelação da linha realmente anime do zero.
      const elapsed = (nowMs - startedAt) / 1000
      ctx!.clearRect(0, 0, width, height)
      drawGrid()
      drawParticles(elapsed)
      // revelação calma da linha: ~4s com easing suave
      const reveal = reducedMotion ? 1 : easeOutCubic(Math.min(1, elapsed / 4))
      drawCurve(elapsed, reveal)
      if (!reducedMotion) raf = requestAnimationFrame(render)
    }

    resize()
    seedParticles()

    if (reducedMotion) {
      render(startedAt + 4000) // frame estático completamente revelado
    } else {
      raf = requestAnimationFrame(render)
    }

    const onResize = () => {
      resize()
      seedParticles()
      if (reducedMotion) render(startedAt + 4000)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
    }
  }, [reducedMotion])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" aria-hidden="true" />
}
