import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import MarqueeTicker from './MarqueeTicker'
import MagneticButton from './MagneticButton'
import PhysicsOrbs from './PhysicsOrbs'
import HeroDoodles from './HeroDoodles'
import { HandCircle } from './Doodles'
import useReducedMotion from '../hooks/useReducedMotion'

const words = ['STUTI', 'PANDYA']

// Second ticker — more personality-forward than the technical lane so the two
// marquees don't read as duplicates of each other.
const PERSONALITY_ITEMS = [
  'Ottawa → building',
  'coffee + code',
  'hand-drawn UI',
  'late-night builder',
  'always shipping',
  'hackathon energy',
  'design ✦ engineering',
  'systems thinker',
  'music on loop',
  'curious about everything',
  'ship then iterate',
  'loves a good whiteboard',
  'scrappy prototyper',
]

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
  const nameBubbleRef = useRef(null)
  const [hintHidden, setHintHidden] = useState(false)
  // Mobile swaps the physics orb cluster for lightweight floating doodles.
  // Listen for breakpoint flips so resize/rotation always lands on the right
  // variant without needing to refresh.
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false
    return window.matchMedia('(max-width: 767px)').matches
  })
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined
    const mql = window.matchMedia('(max-width: 767px)')
    const handler = (e) => setIsMobile(e.matches)
    mql.addEventListener?.('change', handler)
    return () => mql.removeEventListener?.('change', handler)
  }, [])
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

      {/* Desktop: full physics orb cluster with drag-throw + collision.
          Mobile: scattered hand-drawn doodles that gently float — the orbs get
          squished/overwhelming on small screens and the doodles match the
          scrappy / annotated aesthetic of the rest of the site. */}
      {isMobile ? (
        <HeroDoodles />
      ) : (
        <PhysicsOrbs
          containerRef={sectionRef}
          obstacleRef={nameBubbleRef}
          onFirstDrag={() => setHintHidden(true)}
        />
      )}
      {/* Content wrapper. On mobile we take the remaining vertical space and
          center the name block so the hero reads balanced instead of top-heavy.
          On md+ we revert to the top-anchored layout so the orb cluster has
          room to breathe. */}
      <div className="pointer-events-none relative flex flex-1 items-center md:block md:flex-none">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="relative mx-auto w-full max-w-6xl px-5 md:px-8 md:pb-8 md:pt-20"
        >
          {/* The name sits inside a soft cream "sticker" bubble — the orbs
              register its bounding box as a physics obstacle and bounce off it.
              Mobile sizing is tuned down so the card doesn't dominate the
              screen. */}
          <h1
            ref={nameBubbleRef}
            className="f-display pointer-events-none relative inline-block rounded-[28px] bg-card px-5 py-4 text-ink text-[clamp(44px,10vw,156px)] font-black leading-[0.95] tracking-[-0.02em] ring-1 ring-ink/10 shadow-[0_20px_60px_-28px_rgba(17,17,17,0.35)] md:rounded-[40px] md:px-8 md:py-6 md:leading-[0.92]"
          >
            <span className="sr-only">Stuti Pandya</span>
            {/* Stacked on mobile so "PANDYA" never clips against the viewport
                edge; inline on md+ to keep the single-line statement look. */}
            <motion.span
              variants={word}
              className="block md:mr-[0.2em] md:inline-block"
              style={{ x: tx1, y: ty1 }}
              aria-hidden
            >
              {words[0]}
            </motion.span>
            <motion.span
              variants={word}
              className="relative block md:inline-block"
              style={{ x: tx2, y: ty2 }}
              aria-hidden
            >
              {words[1]}
              <SquiggleUnderline className="pointer-events-none absolute -bottom-2 left-0 w-[110%] md:-bottom-3" />
            </motion.span>
            <StarDoodle
              aria-hidden
              className="pointer-events-none absolute -right-2 -top-3 h-7 w-7 md:-right-5 md:-top-5 md:h-10 md:w-10"
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

      {/* Two tickers stacked — top lane scrolls left (technical résumé), bottom
          lane scrolls right with personality bits, so the eye catches opposing
          motion and the section feels layered. */}
      <div className="mt-auto flex flex-col gap-1 pb-6 md:pb-10">
        <MarqueeTicker
          tone="light"
          direction="left"
          speed={28}
          className="pointer-events-none relative z-10"
        />
        <MarqueeTicker
          tone="light"
          direction="right"
          speed={34}
          items={PERSONALITY_ITEMS}
          className="pointer-events-none relative z-10 opacity-80"
        />
      </div>
    </section>
  )
}
