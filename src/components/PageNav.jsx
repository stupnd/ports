import { useLayoutEffect, useMemo, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

/** 1 = forward in tab order (next / wrap last→home); -1 = backward (prev / wrap home→last). */
function navDirection(prevIdx, nextIdx, len) {
  if (prevIdx === nextIdx) return 1
  if (prevIdx === len - 1 && nextIdx === 0) return 1
  if (prevIdx === 0 && nextIdx === len - 1) return -1
  return nextIdx > prevIdx ? 1 : -1
}

const barVariants = {
  enter: (d) => ({ y: d === 1 ? 14 : -14, opacity: 0 }),
  center: { y: 0, opacity: 1 },
  exit: (d) => ({ y: d === 1 ? -14 : 14, opacity: 0 }),
}

const barTransition = { duration: 0.34, ease: [0.22, 1, 0.36, 1] }

const pillShell =
  'shadow-[0_12px_40px_-12px_rgba(17,17,17,0.45)] ring-1 ring-ink/15 backdrop-blur-md'

/** Centered bottom bar — better on small screens than edge-fixed pills. */
export default function PageNav({ tabs, activeTab, onChange }) {
  const idx = tabs.findIndex((t) => t.id === activeTab)
  if (idx < 0) return null

  const prevIdxRef = useRef(idx)
  const direction = useMemo(
    () => navDirection(prevIdxRef.current, idx, tabs.length),
    [idx, tabs.length]
  )

  useLayoutEffect(() => {
    prevIdxRef.current = idx
  }, [idx])

  const prev = idx > 0 ? tabs[idx - 1] : null
  const isLast = idx === tabs.length - 1
  const next = isLast ? tabs[0] : tabs[idx + 1]
  const nextAccent = isLast ? 'var(--color-terracotta)' : next.accent || 'var(--color-terracotta)'

  const goPrev = () => prev && onChange(prev.id)
  const goNext = () => onChange(next.id)

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 flex justify-center px-4 pb-[max(0.65rem,env(safe-area-inset-bottom))] pt-2">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          custom={direction}
          variants={barVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={barTransition}
          className={`pointer-events-auto flex w-full max-w-md overflow-hidden rounded-2xl bg-ink/95 ${pillShell}`}
        >
          <button
            type="button"
            onClick={goPrev}
            disabled={!prev}
            aria-label={prev ? `Previous: ${prev.label}` : 'No previous page'}
            className={`group flex min-w-0 flex-1 items-center justify-center gap-1.5 px-3 py-3.5 text-[10px] font-semibold uppercase tracking-[0.12em] transition-colors md:py-3 ${
              prev
                ? 'text-bg/90 hover:bg-bg/10 hover:text-bg'
                : 'cursor-not-allowed text-bg/30'
            }`}
          >
            <svg
              className="h-4 w-4 shrink-0 transition-transform group-hover:-translate-x-0.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
            <span className="min-w-0 truncate">{prev ? prev.label : '—'}</span>
          </button>

          <span className="w-px shrink-0 self-stretch bg-bg/18 my-2.5" aria-hidden />

          <button
            type="button"
            onClick={goNext}
            aria-label={isLast ? 'Back to home' : `Next: ${next.label}`}
            className="group flex min-w-0 flex-1 items-center justify-center gap-1.5 px-3 py-3.5 text-[10px] font-bold uppercase tracking-[0.14em] text-white antialiased transition-transform hover:scale-[1.01] active:scale-[0.99] md:py-3 [text-shadow:0_1px_2px_rgba(0,0,0,0.35)]"
            style={{ backgroundColor: nextAccent }}
          >
            <span className="min-w-0 truncate">{isLast ? 'Home' : next.label}</span>
            <svg
              className="h-4 w-4 shrink-0 text-white transition-transform group-hover:translate-x-0.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
