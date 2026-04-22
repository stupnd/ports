import { useLayoutEffect, useMemo, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

/** 1 = forward in tab order (next / wrap last→home); -1 = backward (prev / wrap home→last). */
function navDirection(prevIdx, nextIdx, len) {
  if (prevIdx === nextIdx) return 1
  if (prevIdx === len - 1 && nextIdx === 0) return 1
  if (prevIdx === 0 && nextIdx === len - 1) return -1
  return nextIdx > prevIdx ? 1 : -1
}

/** Left rail: forward → new label sweeps in from the page center, exits toward the left edge. */
const leftPillVariants = {
  enter: (d) => ({ x: d === 1 ? 24 : -24, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (d) => ({ x: d === 1 ? -24 : 24, opacity: 0 }),
}

/** Right rail: forward → new label from center, exits toward the right edge. */
const rightPillVariants = {
  enter: (d) => ({ x: d === 1 ? -24 : 24, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (d) => ({ x: d === 1 ? 24 : -24, opacity: 0 }),
}

const pillTransition = { duration: 0.36, ease: [0.22, 1, 0.36, 1] }

const pillShell =
  'rounded-2xl shadow-[0_12px_40px_-12px_rgba(17,17,17,0.45)] ring-1 ring-bg/20 backdrop-blur-md'

// Prev fixed on the left edge, next on the right — both animate on tab change.
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
    <>
      <div className="pointer-events-none fixed left-0 top-1/2 z-30 -translate-y-1/2 pl-[max(0.75rem,env(safe-area-inset-left))] pr-2 md:pl-[max(1rem,env(safe-area-inset-left))]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            custom={direction}
            variants={leftPillVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={pillTransition}
            className="pointer-events-auto"
          >
            <button
              type="button"
              onClick={goPrev}
              disabled={!prev}
              aria-label={prev ? `Previous: ${prev.label}` : 'No previous page'}
              className={`group flex max-w-[min(calc(100vw-4.5rem),10rem)] items-center gap-1.5 rounded-2xl px-2.5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.12em] transition-colors md:max-w-[11rem] md:px-3 ${pillShell} ${
                prev
                  ? 'bg-ink/92 text-bg/85 hover:bg-bg/10 hover:text-bg'
                  : 'cursor-not-allowed bg-ink/50 text-bg/35'
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
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="pointer-events-none fixed right-0 top-1/2 z-30 -translate-y-1/2 pr-[max(0.75rem,env(safe-area-inset-right))] pl-2 md:pr-[max(1rem,env(safe-area-inset-right))]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            custom={direction}
            variants={rightPillVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={pillTransition}
            className="pointer-events-auto"
          >
            <button
              type="button"
              onClick={goNext}
              aria-label={isLast ? 'Back to home' : `Next: ${next.label}`}
              className={`group flex max-w-[min(calc(100vw-4.5rem),10rem)] items-center gap-1.5 rounded-2xl px-2.5 py-2.5 text-[10px] font-bold uppercase tracking-[0.14em] text-white antialiased transition-transform [text-shadow:0_1px_2px_rgba(0,0,0,0.35)] hover:scale-[1.02] md:max-w-[11rem] md:px-3 ${pillShell}`}
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
    </>
  )
}
