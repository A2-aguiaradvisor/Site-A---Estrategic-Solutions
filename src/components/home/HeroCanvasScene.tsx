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

/**
 * Cenário animado do hero: linha de dados (gráfico de receita) desenhada em
 * canvas com gradiente preenchido, partículas ascendentes sutis e linhas de
 * conexão — paleta navy/prata/dourado sobre #030C1E. Respeita
 * prefers-reduced-motion (renderiza um frame estático).
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
    let t = 0
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
      const count = Math.min(46, Math.max(22, Math.floor(width / 26)))
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: height + Math.random() * height * 0.6,
          vx: (Math.random() - 0.5) * 0.12,
          vy: -(0.15 + Math.random() * 0.35),
          size: 0.8 + Math.random() * 1.8,
          opacity: 0.15 + Math.random() * 0.45,
          gold: Math.random() < 0.22,
        })
      }
    }

    // Série "financeira" suave — mistura de senos com deriva temporal
    function curveY(x: number, w: number, h: number, time: number): number {
      const px = x / w
      const base = h * 0.62
      const amp = h * 0.2
      return (
        base -
        amp * 0.55 * Math.sin(px * Math.PI * 1.6 + time * 0.35) -
        amp * 0.3 * Math.sin(px * Math.PI * 3.4 - time * 0.22) -
        amp * 0.15 * Math.sin(px * Math.PI * 6.1 + time * 0.5)
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

      // Área preenchida
      ctx!.beginPath()
      for (let i = 0; i <= points * reveal; i++) {
        const x = i * step
        const y = curveY(x, w, h, time)
        if (i === 0) ctx!.moveTo(x, y)
        else ctx!.lineTo(x, y)
      }
      const lastX = points * reveal * step
      ctx!.lineTo(lastX, h)
      ctx!.lineTo(0, h)
      ctx!.closePath()
      const fill = ctx!.createLinearGradient(0, maxY, 0, h)
      fill.addColorStop(0, `rgba(${BLUE}, 0.28)`)
      fill.addColorStop(1, 'rgba(37, 99, 235, 0)')
      ctx!.fillStyle = fill
      ctx!.fill()

      // Linha principal com brilho
      ctx!.beginPath()
      for (let i = 0; i <= points * reveal; i++) {
        const x = i * step
        const y = curveY(x, w, h, time)
        if (i === 0) ctx!.moveTo(x, y)
        else ctx!.lineTo(x, y)
      }
      ctx!.lineWidth = 2.2
      ctx!.strokeStyle = `rgba(${SILVER}, 0.9)`
      ctx!.shadowColor = `rgba(${GOLD}, 0.55)`
      ctx!.shadowBlur = 14
      ctx!.stroke()
      ctx!.shadowBlur = 0

      // Linha dourada paralela (diferença de fase = "cenario projetado")
      ctx!.beginPath()
      for (let i = 0; i <= points * reveal; i++) {
        const x = i * step
        const y = curveY(x + w * 0.06, w, h, time + 0.8) - h * 0.05
        if (i === 0) ctx!.moveTo(x, y)
        else ctx!.lineTo(x, y)
      }
      ctx!.lineWidth = 1.4
      ctx!.strokeStyle = `rgba(${GOLD}, 0.65)`
      ctx!.stroke()
    }

    function drawParticles(time: number) {
      for (const p of particles) {
        ctx!.beginPath()
        ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx!.fillStyle = `rgba(${p.gold ? GOLD : SILVER}, ${p.opacity * (0.6 + 0.4 * Math.sin(time + p.x))})`
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
      ctx!.strokeStyle = 'rgba(148, 163, 184, 0.07)'
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

    function render(time: number) {
      ctx!.clearRect(0, 0, width, height)
      drawGrid()
      drawParticles(time)
      const reveal = reducedMotion ? 1 : Math.min(1, time / 2.2)
      drawCurve(time, reveal)
      if (!reducedMotion) raf = requestAnimationFrame(render)
    }

    resize()
    seedParticles()

    if (reducedMotion) {
      render(4) // frame estático completamente revelado
    } else {
      raf = requestAnimationFrame(render)
    }

    const onResize = () => {
      resize()
      seedParticles()
      if (reducedMotion) render(4)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
    }
  }, [reducedMotion])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" aria-hidden="true" />
}
