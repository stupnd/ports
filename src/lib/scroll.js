// Lenis smooth scroll + GSAP ScrollTrigger integration.
// Targets the #tab-panel element as the scroller (inner scroll container).

import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { prefersReducedMotion } from '../hooks/useReducedMotion'

gsap.registerPlugin(ScrollTrigger)

let lenisInstance = null
let rafHandler = null

export function getLenis() {
  return lenisInstance
}

export function initScroll(scrollerEl) {
  if (!scrollerEl) return null
  if (prefersReducedMotion()) return null

  // Tear down only the Lenis instance + ticker from a previous tab.
  // Do NOT kill ScrollTriggers here — the new tab has likely already created its own.
  if (rafHandler) {
    gsap.ticker.remove(rafHandler)
    rafHandler = null
  }
  if (lenisInstance) {
    lenisInstance.destroy()
    lenisInstance = null
  }

  const lenis = new Lenis({
    wrapper: scrollerEl,
    content: scrollerEl.firstElementChild || scrollerEl,
    duration: 1.1,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    syncTouch: false,
  })

  ScrollTrigger.scrollerProxy(scrollerEl, {
    scrollTop(value) {
      if (arguments.length) {
        lenis.scrollTo(value, { immediate: true })
      }
      return lenis.scroll
    },
    getBoundingClientRect() {
      return {
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      }
    },
  })

  lenis.on('scroll', ScrollTrigger.update)

  rafHandler = (time) => lenis.raf(time * 1000)
  gsap.ticker.add(rafHandler)
  gsap.ticker.lagSmoothing(0)

  lenisInstance = lenis

  // Refresh triggers after Lenis has latched onto the scroller
  requestAnimationFrame(() => ScrollTrigger.refresh())

  return lenis
}

export function destroyScroll() {
  if (rafHandler) {
    gsap.ticker.remove(rafHandler)
    rafHandler = null
  }
  if (lenisInstance) {
    lenisInstance.destroy()
    lenisInstance = null
  }
  ScrollTrigger.getAll().forEach((t) => t.kill())
}

export { ScrollTrigger, gsap }
