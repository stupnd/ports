import { lazy, Suspense, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Beyond from './components/Beyond'
import Projects from './components/Projects'
import Experience from './components/Experience'
import WIE from './components/WIE'
import Contact from './components/Contact'
import ScrollProvider from './components/ScrollProvider'
import Cursor from './components/Cursor'
import TabTransition from './components/TabTransition'

const CommandPalette = lazy(() => import('./components/CommandPalette'))
const NotFound = lazy(() => import('./components/NotFound'))

// Paths the SPA considers "real". Everything else falls through to NotFound.
// Kept tiny so the check is cheap at render time.
const KNOWN_PATHS = new Set(['/', '/index.html'])

function isKnownPath(pathname) {
  if (!pathname) return true
  return KNOWN_PATHS.has(pathname)
}

const tabs = [
  { id: 'home', label: 'Home', component: Hero },
  { id: 'about', label: 'About', component: About },
  { id: 'beyond', label: 'Beyond the Code', component: Beyond },
  { id: 'projects', label: 'Projects', component: Projects },
  { id: 'experience', label: 'Experience', component: Experience },
  { id: 'wie', label: 'WIE', component: WIE, accent: '#9B5DE5' },
  { id: 'contact', label: 'Contact', component: Contact },
]

function App() {
  const [activeTab, setActiveTab] = useState('home')
  const [notFound, setNotFound] = useState(() =>
    typeof window === 'undefined' ? false : !isKnownPath(window.location.pathname)
  )

  useEffect(() => {
    const root = document.getElementById('tab-panel')
    if (root) root.scrollTop = 0
  }, [activeTab, notFound])

  // Global navigate bus — lets the command palette and any deep-link trigger
  // a tab switch without prop-drilling.
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

  // Keep the 404 state in sync with browser back/forward navigation.
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
      <Navbar tabs={tabs} activeTab={notFound ? null : activeTab} onTabChange={(id) => {
        setNotFound(false)
        setActiveTab(id)
        if (window.location.pathname !== '/') {
          window.history.pushState({}, '', '/')
        }
      }} />
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
              className="absolute inset-0 overflow-y-auto"
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
      <Cursor accent={notFound ? 'var(--color-terracotta)' : activeAccent} />
      <Suspense fallback={null}>
        <CommandPalette />
      </Suspense>
    </div>
  )
}

export default App
