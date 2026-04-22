import { motion } from 'framer-motion'

// Single curtain slab that performs a cover→reveal sweep on tab change.
// Keyed on activeTab so it re-runs every switch. Color tracks the incoming accent.
// Phase 1 (0→0.45): scale 0→1 from the left (covers)
// Phase 2 (0.5→1):  scale 1→0 from the right (reveals the new tab)
// The first render plays too — acts as a subtle page-entry flourish.
export default function TabTransition({ activeTab, accent }) {
  const color = accent || 'var(--color-ink)'

  return (
    <motion.div
      key={activeTab}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-40"
      style={{ backgroundColor: color }}
      initial={{ scaleX: 0, originX: 0 }}
      animate={{
        scaleX: [0, 1, 1, 0],
        originX: [0, 0, 1, 1],
      }}
      transition={{
        duration: 0.9,
        times: [0, 0.45, 0.5, 1],
        ease: [0.76, 0, 0.24, 1],
      }}
    />
  )
}
