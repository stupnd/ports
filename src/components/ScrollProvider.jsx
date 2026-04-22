import { useEffect, useRef } from 'react'
import { initScroll, destroyScroll, ScrollTrigger } from '../lib/scroll'
import useReducedMotion from '../hooks/useReducedMotion'

// Re-initialises Lenis + ScrollTrigger every time the active tab changes,
// because AnimatePresence mode="wait" unmounts the scroll container.
export default function ScrollProvider({ scrollerId = 'tab-panel', activeTab, children }) {
  const reduced = useReducedMotion()
  const tokenRef = useRef(0)

  useEffect(() => {
    if (reduced) return undefined

    const token = ++tokenRef.current

    // AnimatePresence mount takes a frame; wait until the new #tab-panel is in the DOM.
    let raf = requestAnimationFrame(function attach() {
      if (token !== tokenRef.current) return
      const el = document.getElementById(scrollerId)
      if (!el) {
        raf = requestAnimationFrame(attach)
        return
      }
      initScroll(el)
      // Let subscribers know the scroller is ready
      window.dispatchEvent(new CustomEvent('scroll:ready', { detail: { el } }))
    })

    return () => {
      cancelAnimationFrame(raf)
      destroyScroll()
    }
  }, [activeTab, scrollerId, reduced])

  // Keep ScrollTrigger refreshed on resize
  useEffect(() => {
    if (reduced) return undefined
    const onResize = () => ScrollTrigger.refresh()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [reduced])

  return children
}
