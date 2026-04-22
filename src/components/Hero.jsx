import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import MarqueeTicker from './MarqueeTicker'
import MagneticButton from './MagneticButton'
import PhysicsOrbs from './PhysicsOrbs'
import { HandCircle } from './Doodles'
import useReducedMotion from '../hooks/useReducedMotion'

const AskMeChat = lazy(() => import('./AskMeChat'))

const words = ['STUTI', 'PANDYA']

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.12,
    },
  },
}

const word = {
  hidden: { y: 40, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
}

const fadeUp = {
  hidden: { y: 20, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
}

function SquiggleUnderline({ className = '' }) {
  return (
    <svg
      viewBox="0 0 360 24"
      fill="none"
      stroke="#E8521A"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      <path d="M4 16 C 50 4, 100 22, 150 12 S 260 2, 320 16 S 352 10, 356 14" />
    </svg>
  )
}

function StarDoodle({ className = '' }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="#E8521A"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      <path d="M24 6 V42 M6 24 H42 M11 11 L37 37 M37 11 L11 37" />
    </svg>
  )
}


export default function Hero() {
  const reduced = useReducedMotion()
  const sectionRef = useRef(null)
  const [hintHidden, setHintHidden] = useState(false)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 60, damping: 18, mass: 0.4 })
  const sy = useSpring(my, { stiffness: 60, damping: 18, mass: 0.4 })
  const tx1 = useTransform(sx, (v) => v * -12)
  const ty1 = useTransform(sy, (v) => v * -8)
  const tx2 = useTransform(sx, (v) => v * 12)
  const ty2 = useTransform(sy, (v) => v * 8)

  useEffect(() => {
    if (reduced) return undefined
    if (window.matchMedia('(pointer: coarse)').matches) return undefined
    const onMove = (e) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1
      const ny = (e.clientY / window.innerHeight) * 2 - 1
      mx.set(nx)
      my.set(ny)
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [reduced, mx, my])

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-full flex-col overflow-hidden bg-bg"
    >
      {/* Ambient warm backdrop behind the orb cluster */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-[12%] -top-[18%] h-[780px] w-[780px] rounded-full"
        style={{
          background:
            'radial-gradient(circle at center, rgba(232,82,26,0.10), transparent 65%)',
          filter: 'blur(12px)',
        }}
      />

      {/* Physics-simulated orb cluster — draggable, throws with momentum,
          bounces off walls and off each other. */}
      <PhysicsOrbs
        containerRef={sectionRef}
        onFirstDrag={() => setHintHidden(true)}
      />
      <div className="pointer-events-none relative mx-auto w-full max-w-6xl px-5 pb-6 pt-14 md:px-8 md:pb-8 md:pt-20">
        <motion.div variants={container} initial="hidden" animate="show" className="relative">
          <h1 className="f-display pointer-events-none relative inline-block text-[clamp(64px,10vw,140px)] font-extrabold leading-[0.92] tracking-[-0.02em] text-ink">
            <span className="sr-only">Stuti Pandya</span>
            <motion.span
              variants={word}
              className="mr-[0.2em] inline-block"
              style={{ x: tx1, y: ty1 }}
              aria-hidden
            >
              {words[0]}
            </motion.span>
            <motion.span
              variants={word}
              className="relative inline-block"
              style={{ x: tx2, y: ty2 }}
              aria-hidden
            >
              {words[1]}
              <SquiggleUnderline className="pointer-events-none absolute -bottom-3 left-0 w-[110%] md:-bottom-4" />
            </motion.span>
            <StarDoodle
              aria-hidden
              className="pointer-events-none absolute -right-1 -top-3 h-7 w-7 md:-right-4 md:-top-4 md:h-10 md:w-10"
            />
          </h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.55 }}
            className="pointer-events-none mt-10 max-w-2xl text-base text-muted md:text-lg"
          >
            Computer Engineer. Builder. Creative Technologist.
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.72 }}
            className="pointer-events-auto mt-6 inline-block"
          >
            <MagneticButton strength={0.25} radius={160}>
              <span className="relative inline-flex items-center gap-2 rounded-full bg-terracotta/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-terracotta ring-1 ring-terracotta/20">
                <span aria-hidden>✦</span>
                Available for New Grad Roles — Jan 2027
                <HandCircle
                  className="pointer-events-none absolute -inset-x-4 -inset-y-3 h-[calc(100%+24px)] w-[calc(100%+32px)]"
                  aria-hidden
                />
              </span>
            </MagneticButton>
          </motion.div>

          {/* Discoverable hint — fades in briefly, disappears on first drag */}
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: hintHidden || reduced ? 0 : 0.7, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 1.8 }}
            className="pointer-events-none mt-8 hidden items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted md:flex"
            aria-hidden
          >
            <span className="inline-block h-px w-6 bg-muted/50" />
            drag the spheres · they bounce
          </motion.p>
        </motion.div>
      </div>

      <MarqueeTicker tone="light" className="pointer-events-none relative z-10" />

      <div className="pointer-events-auto relative mx-auto w-full max-w-6xl px-5 pb-14 pt-6 md:px-8 md:pb-20 md:pt-8">
        <Suspense fallback={null}>
          <AskMeChat />
        </Suspense>
      </div>
    </section>
  )
}
