import { useEffect, useState } from 'react'

// Tiny IntersectionObserver hook used by each project preview to pause its
// animation loop when the card is offscreen. Keeps total CPU flat as the
// Projects grid grows.
export default function useVisible(ref, { threshold = 0.2 } = {}) {
  const [visible, setVisible] = useState(() => typeof IntersectionObserver === 'undefined')

  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    if (typeof IntersectionObserver === 'undefined') return undefined
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) setVisible(entry.isIntersecting)
      },
      { threshold, root: document.querySelector('#tab-panel') }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [ref, threshold])

  return visible
}
