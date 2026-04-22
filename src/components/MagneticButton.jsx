import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import useReducedMotion from '../hooks/useReducedMotion'

// Wraps a child element and pulls it toward the cursor when hovered.
// `strength` scales the pull (0.3 is a subtle, widely-used default).
export default function MagneticButton({
  children,
  strength = 0.3,
  radius = 140,
  className = '',
  ...rest
}) {
  const ref = useRef(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return undefined
    const el = ref.current
    if (!el) return undefined
    if (window.matchMedia('(pointer: coarse)').matches) return undefined

    const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' })

    const onMove = (e) => {
      const rect = el.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = e.clientX - cx
      const dy = e.clientY - cy
      const dist = Math.hypot(dx, dy)
      if (dist > radius) {
        xTo(0)
        yTo(0)
        return
      }
      xTo(dx * strength)
      yTo(dy * strength)
    }
    const onLeave = () => {
      xTo(0)
      yTo(0)
    }

    window.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    return () => {
      window.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
    }
  }, [reduced, strength, radius])

  return (
    <div ref={ref} className={`inline-block will-change-transform ${className}`} {...rest}>
      {children}
    </div>
  )
}
