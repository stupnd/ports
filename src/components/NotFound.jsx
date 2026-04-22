import { useEffect, useMemo, useRef } from 'react'
import { motion } from 'framer-motion'
import { HandStar, HandArrow, WavyUnderline } from './Doodles'
import MagneticButton from './MagneticButton'
import { projects } from '../data/knowledge'
import { gsap } from '../lib/scroll'
import { prefersReducedMotion } from '../hooks/useReducedMotion'

// Drawn-on-paper 404. The joke: this route is still on Stuti's TODO list —
// which is actually a literal checklist of things she *has* shipped (the
// four projects) plus one unchecked "this route".

function Checkmark({ className = '', delay = 0 }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="#E8521A"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      <motion.path
        d="M4 12 L10 18 L20 6"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut', delay }}
      />
    </svg>
  )
}

function Box({ checked, delay, children }) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut', delay }}
      className="flex items-start gap-4 py-2.5"
    >
      <span
        className={`relative mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded border-2 transition-colors ${
          checked
            ? 'border-terracotta bg-terracotta/10'
            : 'border-ink/25 bg-transparent'
        }`}
        aria-hidden
      >
        {checked ? <Checkmark className="h-4 w-4" delay={delay + 0.2} /> : null}
      </span>
      <span
        className={`f-serif text-lg leading-snug md:text-xl ${
          checked ? 'text-ink/55 line-through decoration-terracotta/70 decoration-2' : 'text-ink'
        }`}
      >
        {children}
      </span>
    </motion.li>
  )
}

export default function NotFound({ onHome }) {
  const starRef = useRef(null)
  const path = useMemo(
    () => (typeof window === 'undefined' ? '/???' : window.location.pathname || '/???'),
    []
  )

  // Let the doodle star draw itself in, same technique as on the Contact page.
  useEffect(() => {
    if (prefersReducedMotion()) return undefined
    const wrap = starRef.current
    if (!wrap) return undefined
    const paths = wrap.querySelectorAll('path')
    if (!paths.length) return undefined

    const lens = Array.from(paths).map((p) => {
      try {
        return p.getTotalLength()
      } catch {
        return 100
      }
    })
    paths.forEach((p, i) => {
      p.style.strokeDasharray = `${lens[i]}`
      p.style.strokeDashoffset = `${lens[i]}`
    })
    const tween = gsap.to(paths, {
      strokeDashoffset: 0,
      duration: 0.8,
      ease: 'power2.out',
      stagger: 0.12,
      delay: 0.3,
    })
    return () => tween.kill()
  }, [])

  return (
    <section className="flex min-h-full items-center justify-center bg-bg">
      <div className="mx-auto w-full max-w-3xl px-5 py-16 md:px-8 md:py-24">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="eyebrow text-terracotta"
        >
          Error 404
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
          className="f-serif relative mt-6 text-[clamp(48px,9vw,120px)] font-bold leading-[0.95] tracking-tight text-ink"
        >
          <span
            ref={starRef}
            className="pointer-events-none absolute -left-8 -top-6 block h-10 w-10 rotate-[-12deg] md:-left-14 md:-top-10 md:h-14 md:w-14"
            aria-hidden
          >
            <HandStar stroke="#E8521A" strokeWidth={2} className="h-full w-full" />
          </span>
          This page is still on my{' '}
          <span className="relative inline-block">
            TODO list.
            <WavyUnderline className="pointer-events-none absolute -bottom-2 left-0 w-full md:-bottom-3" />
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.15 }}
          className="mt-6 max-w-xl text-[15px] text-muted md:text-base"
        >
          There&apos;s nothing at{' '}
          <code className="rounded bg-card px-2 py-0.5 font-mono text-[13px] text-ink/80 ring-1 ring-ink/10">
            {path}
          </code>
          . Yet. The good news — here&apos;s what actually did ship:
        </motion.p>

        <div className="mt-10 rounded-2xl bg-card/60 p-6 ring-1 ring-ink/10 md:p-8">
          <div className="flex items-center justify-between">
            <p className="eyebrow text-ink/60">STUTI.TODO</p>
            <span className="text-[11px] text-muted">{projects.length}/{projects.length + 1} done</span>
          </div>
          <ul className="mt-4 divide-y divide-ink/5">
            {projects.map((p, i) => (
              <Box key={p.id} checked delay={0.25 + i * 0.08}>
                {p.title} — {p.tagline}
              </Box>
            ))}
            <Box checked={false} delay={0.25 + projects.length * 0.08}>
              Build a page at <code className="font-mono text-[14px]">{path}</code>
            </Box>
          </ul>
        </div>

        <div className="relative mt-12 flex items-center gap-5">
          <HandArrow
            className="pointer-events-none absolute -left-2 -top-10 hidden h-12 w-20 rotate-[8deg] md:block"
            aria-hidden
          />
          <MagneticButton strength={0.3} radius={160}>
            <button
              type="button"
              onClick={onHome}
              data-cursor="view"
              className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-bg transition-all hover:bg-terracotta"
            >
              Take me home
              <span aria-hidden>→</span>
            </button>
          </MagneticButton>
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent('portfolio:toggle-cmdk'))}
            data-cursor="view"
            className="text-sm text-muted underline decoration-dotted underline-offset-4 hover:text-ink"
          >
            …or open quick nav (⌘K)
          </button>
        </div>
      </div>
    </section>
  )
}
