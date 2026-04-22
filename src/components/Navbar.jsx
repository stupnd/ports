import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

function openCmdK() {
  window.dispatchEvent(new CustomEvent('portfolio:toggle-cmdk'))
}

export default function Navbar({ tabs, activeTab, onTabChange }) {
  const [open, setOpen] = useState(false)
  const metaGlyph = useMemo(
    () => (typeof navigator !== 'undefined' && /mac/i.test(navigator.platform) ? '\u2318' : 'Ctrl'),
    []
  )

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const pick = (id) => {
    onTabChange(id)
    setOpen(false)
  }

  const activeAccent =
    tabs.find((t) => t.id === activeTab)?.accent || 'var(--color-terracotta)'

  return (
    <header className="relative z-50 border-b border-ink/10 bg-bg">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 md:px-8">
        <button
          type="button"
          onClick={() => pick('home')}
          className="f-display text-lg font-bold tracking-tight text-ink"
        >
          stuti<span className="text-terracotta">.</span>tech
        </button>

        <div className="hidden items-center gap-6 md:flex">
          <button
            type="button"
            onClick={openCmdK}
            data-cursor="view"
            aria-label="Open command palette"
            className="group inline-flex items-center gap-2 rounded-full bg-card px-3 py-1.5 text-[11px] font-medium text-muted ring-1 ring-ink/10 transition-all hover:-translate-y-0.5 hover:text-ink hover:ring-ink/25"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <span className="text-[11px]">Quick nav</span>
            <span className="inline-flex items-center gap-0.5">
              <kbd className="rounded bg-ink/8 px-1 py-0.5 text-[10px] font-semibold text-ink/70 ring-1 ring-ink/10">
                {metaGlyph}
              </kbd>
              <kbd className="rounded bg-ink/8 px-1 py-0.5 text-[10px] font-semibold text-ink/70 ring-1 ring-ink/10">
                K
              </kbd>
            </span>
          </button>

        <ul className="flex items-center gap-7">
          {tabs.map((t) => {
            const isActive = activeTab === t.id
            return (
              <li key={t.id} className="relative">
                <button
                  type="button"
                  onClick={() => pick(t.id)}
                  className={`f-body relative inline-flex items-center gap-1.5 pb-1 text-sm font-medium transition-colors ${
                    isActive ? 'text-ink' : 'text-muted hover:text-ink'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {t.accent && !isActive ? (
                    <span
                      aria-hidden
                      className="inline-block h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: t.accent }}
                    />
                  ) : null}
                  {t.label}
                </button>
                {isActive ? (
                  <motion.span
                    layoutId="nav-indicator"
                    className="absolute -bottom-1 left-0 right-0 h-[2px]"
                    style={{ backgroundColor: activeAccent }}
                    transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                  />
                ) : null}
              </li>
            )
          })}
        </ul>
        </div>

        <button
          type="button"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
        >
          <span
            className={`h-[2px] w-6 bg-ink transition-transform ${open ? 'translate-y-[7px] rotate-45' : ''}`}
          />
          <span
            className={`h-[2px] w-6 bg-ink transition-opacity ${open ? 'opacity-0' : 'opacity-100'}`}
          />
          <span
            className={`h-[2px] w-6 bg-ink transition-transform ${open ? '-translate-y-[7px] -rotate-45' : ''}`}
          />
        </button>
      </nav>

      <AnimatePresence>
        {open ? (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="absolute inset-x-0 top-full md:hidden"
          >
            <ul className="flex flex-col border-t border-ink/10 bg-bg px-5 py-4 shadow-lg">
              {tabs.map((t) => {
                const isActive = activeTab === t.id
                const activeColor = t.accent || 'var(--color-terracotta)'
                return (
                  <li key={t.id}>
                    <button
                      type="button"
                      onClick={() => pick(t.id)}
                      className="f-display flex w-full items-center gap-3 py-3 text-left text-2xl font-bold tracking-tight"
                      style={{
                        color: isActive ? activeColor : 'var(--color-ink)',
                      }}
                    >
                      {t.accent ? (
                        <span
                          aria-hidden
                          className="inline-block h-2 w-2 rounded-full"
                          style={{ backgroundColor: t.accent }}
                        />
                      ) : null}
                      {t.label}
                    </button>
                  </li>
                )
              })}
            </ul>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  )
}
