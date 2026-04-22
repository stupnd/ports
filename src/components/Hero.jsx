import { lazy, Suspense, useEffect } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import MarqueeTicker from './MarqueeTicker'
import MagneticButton from './MagneticButton'
import { HandCircle } from './Doodles'
import useReducedMotion from '../hooks/useReducedMotion'

const AskMeChat = lazy(() => import('./AskMeChat'))
const GradientMesh = lazy(() => import('./GradientMesh'))

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
    <section className="relative flex min-h-full flex-col bg-bg">
      <Suspense fallback={null}>
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute inset-x-0 top-0 h-[70vh] max-h-[720px]"
            style={{
              maskImage:
                'linear-gradient(to bottom, black 40%, rgba(0,0,0,0.5) 70%, transparent 100%)',
              WebkitMaskImage:
                'linear-gradient(to bottom, black 40%, rgba(0,0,0,0.5) 70%, transparent 100%)',
            }}
          >
            <GradientMesh />
          </div>
        </div>
      </Suspense>
      <div className="relative mx-auto w-full max-w-6xl px-5 py-14 md:px-8 md:py-20">
        <motion.div variants={container} initial="hidden" animate="show" className="relative">
          <h1 className="f-display relative inline-block text-[clamp(64px,10vw,140px)] font-extrabold leading-[0.92] tracking-[-0.02em] text-ink">
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
            className="mt-10 max-w-2xl text-base text-muted md:text-lg"
          >
            Computer Engineer. Builder. Creative Technologist.
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.72 }}
            className="mt-6"
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
        </motion.div>

        <Suspense fallback={null}>
          <AskMeChat />
        </Suspense>
      </div>

      <MarqueeTicker />
    </section>
  )
}
