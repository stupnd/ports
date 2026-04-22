import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import Squiggle from './Squiggle'
import MagneticButton from './MagneticButton'
import { HandStar } from './Doodles'
import { gsap, ScrollTrigger } from '../lib/scroll'
import { prefersReducedMotion } from '../hooks/useReducedMotion'

const links = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/stutipandya' },
  { label: 'GitHub', href: 'https://github.com/stupnd' },
  { label: 'Resume (PDF)', href: '/resume.pdf' },
  { label: 'Lil Bytes', href: 'https://www.instagram.com/lilbytes.tech/' },
]

function DownArrow({ className = '' }) {
  return (
    <svg
      viewBox="0 0 60 90"
      fill="none"
      stroke="#FAFAF8"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      <path d="M30 6 C 40 28, 18 46, 32 68" />
      <path d="M32 68 L 24 60" />
      <path d="M32 68 L 40 58" />
    </svg>
  )
}

const viewOnce = { once: true, amount: 0.25 }
const fadeUp = (delay = 0) => ({
  hidden: { y: 30, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: 'easeOut', delay },
  },
})

export default function Contact() {
  const starWrapRef = useRef(null)

  useEffect(() => {
    if (prefersReducedMotion()) return undefined
    const wrap = starWrapRef.current
    if (!wrap) return undefined
    const paths = wrap.querySelectorAll('path')
    if (!paths.length) return undefined

    const lens = Array.from(paths).map((p) => {
      try {
        return p.getTotalLength()
      } catch {
        return 100
      }
    })
    paths.forEach((p, i) => {
      p.style.strokeDasharray = lens[i]
      p.style.strokeDashoffset = lens[i]
    })

    const scrollerEl = document.querySelector('#tab-panel')
    const tween = gsap.to(paths, {
      strokeDashoffset: 0,
      duration: 0.7,
      ease: 'power2.out',
      stagger: 0.1,
      scrollTrigger: {
        trigger: wrap,
        scroller: scrollerEl || undefined,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      },
    })
    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [])

  return (
    <section className="flex min-h-full items-center bg-terracotta text-bg">
      <div className="mx-auto w-full max-w-4xl px-5 py-16 text-center md:px-8 md:py-24">
        <motion.h2
          initial="hidden"
          whileInView="show"
          viewport={viewOnce}
          variants={fadeUp(0)}
          className="f-serif relative inline-block text-[clamp(40px,7vw,88px)] font-bold leading-[1.1] tracking-tight text-bg"
        >
          <span
            ref={starWrapRef}
            className="pointer-events-none absolute -left-8 -top-6 block h-8 w-8 rotate-[-12deg] md:-left-14 md:-top-10 md:h-12 md:w-12"
            aria-hidden
          >
            <HandStar stroke="#FAFAF8" strokeWidth={2} className="h-full w-full" />
          </span>
          Let&apos;s build{' '}
          <span className="relative inline-block">
            something.
            <Squiggle
              stroke="#FAFAF8"
              strokeWidth={3}
              className="pointer-events-none absolute -bottom-1 left-0 w-full md:-bottom-2"
            />
          </span>
        </motion.h2>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewOnce}
          variants={fadeUp(0.1)}
          className="relative mt-14 inline-block"
        >
          <DownArrow className="pointer-events-none absolute -left-14 -top-14 h-16 w-10 md:-left-20 md:-top-16 md:h-20 md:w-12" />
          <MagneticButton strength={0.35} radius={180}>
            <a
              href="mailto:stuti.pandya0@gmail.com"
              data-cursor="write"
              className="group f-display inline-block text-2xl font-bold tracking-tight text-bg md:text-4xl"
            >
              <span className="border-b-2 border-transparent pb-1 transition-colors duration-200 group-hover:border-sun group-hover:text-sun">
                stuti.pandya0@gmail.com
              </span>
            </a>
          </MagneticButton>
        </motion.div>

        <motion.ul
          initial="hidden"
          whileInView="show"
          viewport={viewOnce}
          variants={fadeUp(0.2)}
          className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 md:mt-12"
        >
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                target={l.href.startsWith('http') ? '_blank' : undefined}
                rel={l.href.startsWith('http') ? 'noreferrer' : undefined}
                className="text-sm font-semibold text-bg underline decoration-bg/40 decoration-2 underline-offset-[6px] transition-colors hover:text-sun hover:decoration-sun"
              >
                {l.label}
              </a>
            </li>
          ))}
        </motion.ul>

        <p className="mt-16 text-xs text-bg/60 md:mt-20">
          Designed &amp; built by Stuti Pandya · 2026
        </p>
      </div>
    </section>
  )
}
