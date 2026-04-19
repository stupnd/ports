import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Beyond from './components/Beyond'
import Projects from './components/Projects'
import Experience from './components/Experience'
import Contact from './components/Contact'

const tabs = [
  { id: 'home', label: 'Home', component: Hero },
  { id: 'about', label: 'About', component: About },
  { id: 'beyond', label: 'Beyond the Code', component: Beyond },
  { id: 'projects', label: 'Projects', component: Projects },
  { id: 'experience', label: 'Experience', component: Experience },
  { id: 'contact', label: 'Contact', component: Contact },
]

function App() {
  const [activeTab, setActiveTab] = useState('home')

  useEffect(() => {
    const root = document.getElementById('tab-panel')
    if (root) root.scrollTop = 0
  }, [activeTab])

  const ActiveComponent = tabs.find((t) => t.id === activeTab)?.component ?? Hero

  return (
    <div className="flex h-svh flex-col overflow-hidden bg-bg text-ink">
      <Navbar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="relative min-h-0 flex-1 overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            id="tab-panel"
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="absolute inset-0 overflow-y-auto"
          >
            <ActiveComponent />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}

export default App
