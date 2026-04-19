import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

export default function Navbar({ tabs, activeTab, onTabChange }) {
  const [open, setOpen] = useState(false)

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

        <ul className="hidden items-center gap-7 md:flex">
          {tabs.map((t) => {
            const isActive = activeTab === t.id
            return (
              <li key={t.id} className="relative">
                <button
                  type="button"
                  onClick={() => pick(t.id)}
                  className={`f-body relative pb-1 text-sm font-medium transition-colors ${
                    isActive ? 'text-ink' : 'text-muted hover:text-ink'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {t.label}
                </button>
                {isActive ? (
                  <motion.span
                    layoutId="nav-indicator"
                    className="absolute -bottom-1 left-0 right-0 h-[2px] bg-terracotta"
                    transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                  />
                ) : null}
              </li>
            )
          })}
        </ul>

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
                return (
                  <li key={t.id}>
                    <button
                      type="button"
                      onClick={() => pick(t.id)}
                      className={`f-display block w-full py-3 text-left text-2xl font-bold tracking-tight ${
                        isActive ? 'text-terracotta' : 'text-ink'
                      }`}
                    >
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
