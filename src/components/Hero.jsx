import { motion } from 'framer-motion'
import MarqueeTicker from './MarqueeTicker'

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
  return (
    <section className="flex min-h-full flex-col bg-bg">
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-5 py-14 md:px-8 md:py-20">
        <motion.div variants={container} initial="hidden" animate="show" className="relative">
          <h1 className="f-display relative inline-block text-[clamp(64px,10vw,140px)] font-extrabold leading-[0.92] tracking-[-0.02em] text-ink">
            <span className="sr-only">Stuti Pandya</span>
            <motion.span variants={word} className="mr-[0.2em] inline-block" aria-hidden>
              {words[0]}
            </motion.span>
            <motion.span variants={word} className="relative inline-block" aria-hidden>
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
            <span className="inline-flex items-center gap-2 rounded-full bg-terracotta/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-terracotta ring-1 ring-terracotta/20">
              <span aria-hidden>✦</span>
              Available for New Grad Roles — Jan 2027
            </span>
          </motion.div>
        </motion.div>
      </div>

      <MarqueeTicker />
    </section>
  )
}
