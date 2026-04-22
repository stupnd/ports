import { useEffect } from 'react'
import { gsap, ScrollTrigger } from '../lib/scroll'
import { prefersReducedMotion } from './useReducedMotion'

// Split the text content of `ref.current` into word-spans and animate them
// in on scroll with a stagger. Works with the #tab-panel scroller proxy.
// Pass `splitChars: true` to split by letter for title-style reveals.
export default function useReveal(
  ref,
  {
    scroller = '#tab-panel',
    start = 'top 85%',
    stagger = 0.04,
    duration = 0.7,
    y = 24,
    splitChars = false,
    delay = 0,
  } = {}
) {
  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    if (prefersReducedMotion()) return undefined

    const original = el.innerHTML
    const text = el.textContent

    // Tokenize: words (or chars). Preserve whitespace.
    const tokens = splitChars
      ? Array.from(text)
      : text.split(/(\s+)/)

    // Replace innerHTML with wrapped tokens
    el.innerHTML = ''
    const spans = []
    tokens.forEach((tok) => {
      if (/^\s+$/.test(tok)) {
        el.appendChild(document.createTextNode(tok))
        return
      }
      if (!tok) return
      const outer = document.createElement('span')
      outer.style.display = 'inline-block'
      outer.style.overflow = 'hidden'
      outer.style.verticalAlign = 'baseline'
      const inner = document.createElement('span')
      inner.style.display = 'inline-block'
      inner.style.willChange = 'transform, opacity'
      inner.textContent = tok
      outer.appendChild(inner)
      el.appendChild(outer)
      spans.push(inner)
    })

    gsap.set(spans, { y, opacity: 0 })

    const scrollerEl = document.querySelector(scroller)
    const tween = gsap.to(spans, {
      y: 0,
      opacity: 1,
      duration,
      ease: 'power3.out',
      stagger,
      delay,
      scrollTrigger: {
        trigger: el,
        scroller: scrollerEl || undefined,
        start,
        toggleActions: 'play none none reverse',
      },
    })

    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
      el.innerHTML = original
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
