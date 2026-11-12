import React, { useEffect, useRef, useState } from 'react'
import { usePrefersReducedMotion } from '@/hooks/use-reveal'

interface RevealProps {
  children: React.ReactNode
  className?: string
  /** Stagger delay in ms */
  delay?: number
  /** Slide direction */
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
}

const directionClass: Record<NonNullable<RevealProps['direction']>, string> = {
  up: 'translate-y-8',
  down: '-translate-y-8',
  left: 'translate-x-8',
  right: '-translate-x-8',
  none: '',
}

const directionExit: Record<NonNullable<RevealProps['direction']>, string> = {
  up: 'translate-y-0',
  down: 'translate-y-0',
  left: 'translate-x-0',
  right: 'translate-x-0',
  none: '',
}

/**
 * Fade + slide reveal on scroll (IntersectionObserver). Respects
 * prefers-reduced-motion: content appears immediately, no transition.
 */
export const Reveal: React.FC<RevealProps> = ({
  children,
  className = '',
  delay = 0,
  direction = 'up',
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInViewState(ref)
  const reduced = usePrefersReducedMotion()

  const hidden = directionClass[direction]
  const shown = directionExit[direction]

  return (
    <div
      ref={ref}
      className={`${className} transition-all duration-700 ease-out will-change-transform ${
        inView || reduced ? `opacity-100 ${shown}` : `opacity-0 ${hidden}`
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

export function useInViewState(ref: React.RefObject<HTMLElement | null>): boolean {
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [ref])

  return inView
}
