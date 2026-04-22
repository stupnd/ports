import { useEffect, useMemo, useRef, useState } from 'react'
import { gsap } from 'gsap'
import useReducedMotion from '../hooks/useReducedMotion'

const LABELS = {
  view: 'VIEW',
  open: 'OPEN',
  play: 'PLAY',
  write: 'WRITE',
  drag: 'DRAG',
}

function isCoarsePointer() {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  return window.matchMedia('(pointer: coarse)').matches
}

export default function Cursor({ accent = 'var(--color-terracotta)' }) {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const [variant, setVariant] = useState(null)
  const reduced = useReducedMotion()
  const hidden = useMemo(() => isCoarsePointer(), [])

  useEffect(() => {
    if (reduced) return undefined
    if (isCoarsePointer()) return undefined

    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return undefined

    const xToDot = gsap.quickTo(dot, 'x', { duration: 0.12, ease: 'power3.out' })
    const yToDot = gsap.quickTo(dot, 'y', { duration: 0.12, ease: 'power3.out' })
    const xToRing = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power3.out' })
    const yToRing = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power3.out' })

    const onMove = (e) => {
      xToDot(e.clientX)
      yToDot(e.clientY)
      xToRing(e.clientX)
      yToRing(e.clientY)
    }
    const onOver = (e) => {
      const target = e.target.closest('[data-cursor]')
      if (target) {
        setVariant(target.getAttribute('data-cursor'))
      } else if (
        e.target.closest('a, button, [role="button"], label, input, textarea, select')
      ) {
        setVariant('hover')
      } else {
        setVariant(null)
      }
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mouseover', onOver, { passive: true })
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onOver)
    }
  }, [reduced])

  if (reduced || hidden) return null

  const label = LABELS[variant]
  const isHover = variant === 'hover'
  const isLabeled = Boolean(label)

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[100] h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full mix-blend-difference"
        style={{ backgroundColor: '#FAFAF8' }}
      />
      <div
        ref={ringRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[100] flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full transition-[width,height,background,color,border-color] duration-200 ease-out"
        style={{
          width: isLabeled ? 72 : isHover ? 44 : 28,
          height: isLabeled ? 72 : isHover ? 44 : 28,
          borderWidth: 1.5,
          borderStyle: 'solid',
          borderColor: accent,
          backgroundColor: isLabeled ? accent : 'transparent',
          color: '#FAFAF8',
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '0.12em',
        }}
      >
        {label}
      </div>
    </>
  )
}
