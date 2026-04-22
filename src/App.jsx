import { lazy, Suspense, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import ScrollProvider from './components/ScrollProvider'
import Cursor from './components/Cursor'
import TabTransition from './components/TabTransition'
import PageNav from './components/PageNav'
import { tabs } from './config/tabs'

const CommandPalette = lazy(() => import('./components/CommandPalette'))
const NotFound = lazy(() => import('./components/NotFound'))

const KNOWN_PATHS = new Set(['/', '/index.html'])

function isKnownPath(pathname) {
  if (!pathname) return true
  return KNOWN_PATHS.has(pathname)
}

function App() {
  const [activeTab, setActiveTab] = useState('home')
  const [notFound, setNotFound] = useState(() =>
    typeof window === 'undefined' ? false : !isKnownPath(window.location.pathname)
  )

  useEffect(() => {
    const root = document.getElementById('tab-panel')
    if (root) root.scrollTop = 0
  }, [activeTab, notFound])

  useEffect(() => {
    const onNavigate = (e) => {
      const next = e?.detail
      if (!next) return
      if (tabs.some((t) => t.id === next)) {
        setNotFound(false)
        setActiveTab(next)
      }
    }
    window.addEventListener('portfolio:navigate', onNavigate)
    return () => window.removeEventListener('portfolio:navigate', onNavigate)
  }, [])

  useEffect(() => {
    const onPop = () => setNotFound(!isKnownPath(window.location.pathname))
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const goHome = () => {
    if (window.location.pathname !== '/') {
      window.history.pushState({}, '', '/')
    }
    setNotFound(false)
    setActiveTab('home')
  }

  const activeTabMeta = tabs.find((t) => t.id === activeTab)
  const ActiveComponent = activeTabMeta?.component ?? Hero
  const activeAccent = activeTabMeta?.accent || 'var(--color-terracotta)'
  const panelKey = notFound ? '__404' : activeTab

  return (
    <div className="flex h-svh flex-col overflow-hidden bg-bg text-ink">
      <Navbar
        tabs={tabs}
        activeTab={notFound ? null : activeTab}
        onTabChange={(id) => {
          setNotFound(false)
          setActiveTab(id)
          if (window.location.pathname !== '/') {
            window.history.pushState({}, '', '/')
          }
        }}
      />
      <main className="relative min-h-0 flex-1 overflow-hidden">
        <ScrollProvider activeTab={panelKey}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              id="tab-panel"
              key={panelKey}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut', delay: 0.4 }}
              className="absolute inset-0 overflow-y-auto pb-28 md:pb-24"
            >
              {notFound ? (
                <Suspense fallback={null}>
                  <NotFound onHome={goHome} />
                </Suspense>
              ) : (
                <ActiveComponent />
              )}
            </motion.div>
          </AnimatePresence>
        </ScrollProvider>
      </main>
      <TabTransition activeTab={panelKey} accent={notFound ? 'var(--color-terracotta)' : activeAccent} />
      {!notFound ? (
        <PageNav
          tabs={tabs}
          activeTab={activeTab}
          onChange={(id) => {
            setActiveTab(id)
            if (window.location.pathname !== '/') {
              window.history.pushState({}, '', '/')
            }
          }}
        />
      ) : null}
      <Cursor accent={notFound ? 'var(--color-terracotta)' : activeAccent} />
      <Suspense fallback={null}>
        <CommandPalette />
      </Suspense>
    </div>
  )
}

export default App
