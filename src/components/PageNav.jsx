import { AnimatePresence, motion } from 'framer-motion'

// Floating next/prev pill that lives at the App level so every tab inherits
// it automatically. Talks back to App via the same `portfolio:navigate` event
// bus used by the command palette.
export default function PageNav({ tabs, activeTab, onChange }) {
  const idx = tabs.findIndex((t) => t.id === activeTab)
  if (idx < 0) return null

  const prev = idx > 0 ? tabs[idx - 1] : null
  const isLast = idx === tabs.length - 1
  const next = isLast ? tabs[0] : tabs[idx + 1]
  const nextAccent = isLast ? 'var(--color-terracotta)' : next.accent || 'var(--color-terracotta)'

  const goPrev = () => prev && onChange(prev.id)
  const goNext = () => onChange(next.id)

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-20 z-30 flex justify-center px-5 md:bottom-6">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-auto flex items-center gap-1 rounded-full bg-ink/90 p-1 text-bg shadow-[0_14px_40px_-12px_rgba(17,17,17,0.5)] ring-1 ring-bg/10 backdrop-blur-md"
        >
          <button
            type="button"
            onClick={goPrev}
            disabled={!prev}
            aria-label={prev ? `Previous page: ${prev.label}` : 'No previous page'}
            className="group inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-bg/70 transition-all hover:bg-bg/10 hover:text-bg disabled:cursor-not-allowed disabled:opacity-25 disabled:hover:bg-transparent"
          >
            <svg
              className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M19 12H5" />
              <path d="M12 19l-7-7 7-7" />
            </svg>
            <span className="hidden max-w-[140px] truncate sm:inline">
              {prev ? prev.label : 'Start'}
            </span>
          </button>

          <div className="h-5 w-px bg-bg/20" aria-hidden />

          <button
            type="button"
            onClick={goNext}
            aria-label={isLast ? 'Back to home' : `Next page: ${next.label}`}
            className="group relative inline-flex items-center gap-1.5 overflow-hidden rounded-full px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink transition-all hover:-translate-y-0.5"
            style={{ backgroundColor: nextAccent }}
          >
            <span className="relative">
              {isLast ? 'Back to top' : <>Next · {next.label}</>}
            </span>
            <svg
              className="relative h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              {isLast ? (
                <>
                  <path d="M12 19V5" />
                  <path d="M5 12l7-7 7 7" />
                </>
              ) : (
                <>
                  <path d="M5 12h14" />
                  <path d="M12 5l7 7-7 7" />
                </>
              )}
            </svg>
          </button>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
