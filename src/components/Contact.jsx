import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import Squiggle from './Squiggle'
import MagneticButton from './MagneticButton'
import { HandStar } from './Doodles'
import { gsap, ScrollTrigger } from '../lib/scroll'
import { prefersReducedMotion } from '../hooks/useReducedMotion'

const EMAIL = 'stuti.pandya0@gmail.com'

// Channel cards — each link gets its own tile with an icon, handle, and a
// "call to action" line so the footer reads richer than a row of underlines.
const channels = [
  {
    label: 'LinkedIn',
    handle: '@stutipandya',
    cta: "let's connect",
    href: 'https://www.linkedin.com/in/stutipandya',
    icon: (
      <path d="M4 9h4v12H4zM6 4a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM10 9h4v2c.6-1.2 2-2.3 4-2.3 3.3 0 4 2.1 4 5.1V21h-4v-6.2c0-1.5-.6-2.5-2-2.5s-2.2.9-2.2 2.5V21h-4z" />
    ),
  },
  {
    label: 'GitHub',
    handle: '@stupnd',
    cta: 'see my commits',
    href: 'https://github.com/stupnd',
    icon: (
      <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.49v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.12-1.47-1.12-1.47-.91-.62.07-.61.07-.61 1.01.07 1.54 1.03 1.54 1.03.9 1.52 2.36 1.08 2.94.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.95 0-1.09.39-1.99 1.03-2.69-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.03a9.6 9.6 0 0 1 5 0c1.91-1.3 2.75-1.03 2.75-1.03.55 1.38.2 2.4.1 2.65.64.7 1.03 1.6 1.03 2.69 0 3.85-2.34 4.69-4.57 4.94.36.31.68.92.68 1.86v2.76c0 .27.18.59.69.49A10 10 0 0 0 12 2z" />
    ),
  },
  {
    label: 'Resume',
    handle: 'PDF · 1 page',
    cta: 'download',
    href: '/Stuti_Pandya_Resume.pdf',
    external: true,
    download: 'Stuti_Pandya_Resume.pdf',
    icon: (
      <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9l-6-6zm0 2 5 5h-5V5zM8 13h8v2H8v-2zm0 4h5v2H8v-2z" />
    ),
  },
  {
    label: 'Lil Bytes',
    handle: '@lilbytes.tech',
    cta: 'our lil startup',
    href: 'https://www.instagram.com/lilbytes.tech/',
    icon: (
      <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm5 3.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9zm0 2a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zm4.8-2.8a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2z" />
    ),
  },
]

// Small "live-ish" status items that live above the email. They make the page
// feel like a real human is on the other end rather than a static footer.
const statusPills = [
  { label: 'Ottawa, Canada', glyph: '◎' },
  { label: 'Open for Jan 2027', glyph: '✦' },
  { label: 'Replies in ~24h', glyph: '⏱' },
]

const viewOnce = { once: true, amount: 0.2 }
const fadeUp = (delay = 0) => ({
  hidden: { y: 30, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: 'easeOut', delay },
  },
})

function CopyButton({ value }) {
  const [copied, setCopied] = useState(false)
  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(value)
    } catch {
      // Silently fall back — older browsers / denied permission still get the
      // visual confirmation so the UX doesn't feel broken.
    }
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1400)
  }
  return (
    <button
      type="button"
      onClick={onCopy}
      data-cursor="view"
      aria-label={copied ? 'Email copied to clipboard' : 'Copy email address'}
      className="inline-flex items-center gap-1.5 rounded-full bg-bg/15 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-bg/85 ring-1 ring-bg/25 transition-all hover:-translate-y-0.5 hover:bg-bg/25 hover:text-bg"
    >
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        {copied ? (
          <path d="M5 12l5 5L20 7" />
        ) : (
          <>
            <rect x="9" y="9" width="11" height="11" rx="2" />
            <path d="M5 15V5a2 2 0 0 1 2-2h10" />
          </>
        )}
      </svg>
      {copied ? 'copied' : 'copy'}
    </button>
  )
}

function ChannelCard({ channel }) {
  const isExternal = channel.external || channel.href.startsWith('http')
  return (
    <a
      href={channel.href}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noreferrer' : undefined}
      download={channel.download}
      data-cursor="view"
      className="group relative block overflow-hidden rounded-2xl bg-bg/10 p-5 text-left ring-1 ring-bg/20 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-bg/15 hover:ring-bg/40 md:p-6"
    >
      {/* Warm sun glow on hover — slides in from the bottom */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -bottom-16 h-20 bg-gradient-to-t from-sun/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
      <div className="relative flex items-start gap-3">
        <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-bg/15 ring-1 ring-bg/20">
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-5 w-5 text-bg"
            aria-hidden
          >
            {channel.icon}
          </svg>
        </span>
        <div className="min-w-0 flex-1">
          <p className="f-display text-lg font-bold tracking-tight text-bg">
            {channel.label}
          </p>
          <p className="text-[13px] text-bg/70">{channel.handle}</p>
        </div>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mt-1 h-4 w-4 shrink-0 text-bg/60 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-sun"
          aria-hidden
        >
          <path d="M7 17 17 7" />
          <path d="M8 7h9v9" />
        </svg>
      </div>
      <p className="relative mt-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-bg/55 transition-colors duration-300 group-hover:text-sun">
        {channel.cta}
      </p>
    </a>
  )
}

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
    <section className="relative flex min-h-full items-center overflow-hidden bg-terracotta text-bg">
      {/* Ambient cream glow — softens the flat terracotta and gives the cards
          something warm to sit on top of. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-[15%] -top-[20%] h-[520px] w-[520px] rounded-full"
        style={{
          background:
            'radial-gradient(circle at center, rgba(250,250,248,0.16), transparent 65%)',
          filter: 'blur(20px)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-[12%] bottom-[-18%] h-[480px] w-[480px] rounded-full"
        style={{
          background:
            'radial-gradient(circle at center, rgba(240,201,58,0.22), transparent 65%)',
          filter: 'blur(26px)',
        }}
      />

      <div className="relative mx-auto w-full max-w-5xl px-5 py-16 md:px-8 md:py-24">
        {/* Eyebrow */}
        <motion.p
          initial="hidden"
          whileInView="show"
          viewport={viewOnce}
          variants={fadeUp(0)}
          className="mb-4 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-bg/75"
        >
          <span className="inline-block h-px w-8 bg-bg/50" />
          say hi
          <span aria-hidden>✦</span>
        </motion.p>

        {/* Big heading */}
        <motion.h2
          initial="hidden"
          whileInView="show"
          viewport={viewOnce}
          variants={fadeUp(0.05)}
          className="f-serif relative inline-block text-[clamp(44px,8vw,104px)] font-bold leading-[1.02] tracking-tight text-bg"
        >
          <span
            ref={starWrapRef}
            className="pointer-events-none absolute -left-6 -top-5 block h-8 w-8 rotate-[-12deg] md:-left-14 md:-top-10 md:h-14 md:w-14"
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

        {/* Sub-intro */}
        <motion.p
          initial="hidden"
          whileInView="show"
          viewport={viewOnce}
          variants={fadeUp(0.15)}
          className="mt-6 max-w-2xl text-base text-bg/85 md:mt-8 md:text-lg"
        >
          I&apos;m looking for new-grad SWE/AI engineer roles starting{' '}
          <span className="font-semibold text-bg">January 2027</span>, and
          always down to chat about thoughtful software, AI + humans, or
          side-project ideas.
        </motion.p>

        {/* Status pills */}
        <motion.ul
          initial="hidden"
          whileInView="show"
          viewport={viewOnce}
          variants={fadeUp(0.22)}
          className="mt-8 flex flex-wrap gap-2"
        >
          {statusPills.map((p) => (
            <li
              key={p.label}
              className="inline-flex items-center gap-2 rounded-full bg-bg/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-bg/85 ring-1 ring-bg/20"
            >
              <span aria-hidden className="text-sun">
                {p.glyph}
              </span>
              {p.label}
            </li>
          ))}
        </motion.ul>

        {/* Email card */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewOnce}
          variants={fadeUp(0.32)}
          className="mt-10 overflow-hidden rounded-3xl bg-bg/10 p-5 ring-1 ring-bg/20 backdrop-blur-sm md:mt-12 md:p-7"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-bg/15 ring-1 ring-bg/20 md:h-14 md:w-14">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5 text-bg md:h-6 md:w-6"
                  aria-hidden
                >
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="M3 7l9 6 9-6" />
                </svg>
              </span>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-bg/60">
                  email
                </p>
                <MagneticButton strength={0.2} radius={140}>
                  <a
                    href={`mailto:${EMAIL}`}
                    data-cursor="write"
                    className="group f-display block truncate text-xl font-bold tracking-tight text-bg transition-colors hover:text-sun md:text-3xl"
                  >
                    {EMAIL}
                  </a>
                </MagneticButton>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <CopyButton value={EMAIL} />
              <a
                href={`mailto:${EMAIL}?subject=Hi%20Stuti`}
                data-cursor="write"
                className="inline-flex items-center gap-1.5 rounded-full bg-bg px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-terracotta ring-1 ring-bg transition-all hover:-translate-y-0.5 hover:bg-sun hover:text-ink hover:ring-sun"
              >
                write me
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-3.5 w-3.5"
                  aria-hidden
                >
                  <path d="M7 17 17 7" />
                  <path d="M8 7h9v9" />
                </svg>
              </a>
            </div>
          </div>
        </motion.div>

        {/* Channel grid */}
        <motion.ul
          initial="hidden"
          whileInView="show"
          viewport={viewOnce}
          variants={fadeUp(0.4)}
          className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2"
        >
          {channels.map((c) => (
            <li key={c.href}>
              <ChannelCard channel={c} />
            </li>
          ))}
        </motion.ul>

        {/* Closing signature */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewOnce}
          variants={fadeUp(0.5)}
          className="mt-16 flex flex-col gap-3 border-t border-bg/20 pt-8 md:mt-20 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <p className="f-serif text-2xl italic text-bg md:text-3xl">
              — Stuti
            </p>
            <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-bg/60">
              thanks for reading all the way down here
            </p>
          </div>
          <p className="text-xs text-bg/60">
            Designed &amp; built by Stuti Pandya · 2026
          </p>
        </motion.div>
      </div>
    </section>
  )
}
