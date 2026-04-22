import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import Squiggle from './Squiggle'
import MagneticButton from './MagneticButton'
import { HandStar } from './Doodles'
import { gsap } from '../lib/scroll'
import { prefersReducedMotion } from '../hooks/useReducedMotion'

const EMAIL = 'stuti.pandya0@gmail.com'

// Channel cards — each link gets its own tile with an icon, handle, and a
// "call to action" line so the footer reads richer than a row of underlines.
const channels = [
  {
    label: 'LinkedIn',
    handle: 'stuti-pandya',
    cta: "let's connect",
    accent: 'cobalt',
    href: 'https://www.linkedin.com/in/stuti-pandya-6a8bab258',
    icon: (
      <path d="M4 9h4v12H4zM6 4a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM10 9h4v2c.6-1.2 2-2.3 4-2.3 3.3 0 4 2.1 4 5.1V21h-4v-6.2c0-1.5-.6-2.5-2-2.5s-2.2.9-2.2 2.5V21h-4z" />
    ),
  },
  {
    label: 'GitHub',
    handle: '@stupnd',
    cta: 'see my commits',
    accent: 'forest',
    href: 'https://github.com/stupnd',
    icon: (
      <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.49v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.12-1.47-1.12-1.47-.91-.62.07-.61.07-.61 1.01.07 1.54 1.03 1.54 1.03.9 1.52 2.36 1.08 2.94.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.95 0-1.09.39-1.99 1.03-2.69-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.03a9.6 9.6 0 0 1 5 0c1.91-1.3 2.75-1.03 2.75-1.03.55 1.38.2 2.4.1 2.65.64.7 1.03 1.6 1.03 2.69 0 3.85-2.34 4.69-4.57 4.94.36.31.68.92.68 1.86v2.76c0 .27.18.59.69.49A10 10 0 0 0 12 2z" />
    ),
  },
  {
    label: 'Resume',
    handle: 'PDF · 1 page',
    cta: 'download',
    accent: 'sun',
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
    accent: 'terracotta',
    href: 'https://www.instagram.com/lilbytes.tech/',
    icon: (
      <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm5 3.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9zm0 2a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zm4.8-2.8a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2z" />
    ),
  },
]

// Small "live-ish" status items that live above the email. They make the page
// feel like a real human is on the other end rather than a static footer.
const statusPills = [
  { label: 'Ottawa, Canada', glyph: '◎', tone: 'cobalt' },
  { label: 'New grad · Jan 2027', glyph: '✦', tone: 'terracotta' },
]

const CARD_ACCENTS = {
  cobalt: {
    glow: 'from-cobalt/50',
    hoverIcon: 'group-hover:text-cobalt',
    hoverCta: 'group-hover:text-cobalt',
    hoverArrow: 'group-hover:text-cobalt',
  },
  terracotta: {
    glow: 'from-terracotta/50',
    hoverIcon: 'group-hover:text-terracotta',
    hoverCta: 'group-hover:text-terracotta',
    hoverArrow: 'group-hover:text-terracotta',
  },
  forest: {
    glow: 'from-forest/50',
    hoverIcon: 'group-hover:text-forest',
    hoverCta: 'group-hover:text-forest',
    hoverArrow: 'group-hover:text-forest',
  },
  sun: {
    glow: 'from-sun/45',
    hoverIcon: 'group-hover:text-sun',
    hoverCta: 'group-hover:text-sun',
    hoverArrow: 'group-hover:text-sun',
  },
}

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
  const a = CARD_ACCENTS[channel.accent] ?? CARD_ACCENTS.terracotta
  return (
    <a
      href={channel.href}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noreferrer' : undefined}
      download={channel.download}
      data-cursor="view"
      className="group relative block overflow-hidden rounded-2xl bg-bg/10 p-5 text-left ring-1 ring-bg/20 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-bg/15 hover:ring-bg/40 md:p-6"
    >
      <span
        aria-hidden
        className={`pointer-events-none absolute inset-x-0 -bottom-16 h-20 bg-gradient-to-t ${a.glow} to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
      />
      <div className="relative flex items-start gap-3">
        <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-bg/15 ring-1 ring-bg/20 transition-colors duration-300">
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className={`h-5 w-5 text-bg transition-colors duration-300 ${a.hoverIcon}`}
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
          className={`mt-1 h-4 w-4 shrink-0 text-bg/60 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${a.hoverArrow}`}
          aria-hidden
        >
          <path d="M7 17 17 7" />
          <path d="M8 7h9v9" />
        </svg>
      </div>
      <p
        className={`relative mt-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-bg/55 transition-colors duration-300 ${a.hoverCta}`}
      >
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
    <section className="relative flex min-h-full items-center overflow-hidden bg-bg text-ink py-10 md:py-14">
      <div className="relative mx-auto w-full max-w-5xl px-5 md:px-8">
        <div className="relative overflow-hidden rounded-[1.75rem] bg-ink px-5 py-14 text-bg shadow-[0_28px_100px_-28px_rgba(42,75,204,0.22),0_24px_80px_-32px_rgba(232,82,26,0.14),0_20px_60px_-36px_rgba(26,107,69,0.12)] ring-1 ring-white/10 md:rounded-[2.25rem] md:px-8 md:py-16">
          <div
            aria-hidden
            className="pointer-events-none absolute -left-[18%] -top-[22%] h-[min(90vw,520px)] w-[min(90vw,520px)] rounded-full bg-cobalt/30 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -right-[8%] top-[8%] h-[min(75vw,420px)] w-[min(75vw,420px)] rounded-full bg-terracotta/22 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute bottom-[-20%] left-[12%] h-[min(85vw,480px)] w-[min(85vw,480px)] rounded-full bg-forest/24 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute left-[40%] -top-[12%] h-[280px] w-[280px] rounded-full bg-sun/18 blur-2xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.4]"
            style={{
              backgroundImage:
                'radial-gradient(circle at 20% 30%, rgba(250,250,248,0.07), transparent 45%), radial-gradient(circle at 80% 70%, rgba(250,250,248,0.05), transparent 40%)',
            }}
          />

          <div className="relative">
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
          I&apos;m looking for new-grad SWE or AI engineer roles starting{' '}
          <span className="font-semibold text-bg">January 2027</span>. Happy to
          talk about internships you are hiring for, a weird bug you are stuck on,
          or a small tool you want built.
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
              className={`inline-flex items-center gap-2 rounded-full bg-bg/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-bg/85 ring-1 ring-bg/20 ${
                p.tone === 'cobalt' ? 'ring-cobalt/35' : 'ring-terracotta/35'
              }`}
            >
              <span
                aria-hidden
                className={p.tone === 'cobalt' ? 'text-cobalt' : 'text-terracotta'}
              >
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
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-bg/60">
                  email
                </p>
                <MagneticButton strength={0.2} radius={140}>
                  <a
                    href={`mailto:${EMAIL}`}
                    data-cursor="write"
                    className="group f-display inline-block break-all text-lg font-bold tracking-tight text-bg transition-colors hover:text-cobalt md:text-2xl"
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
                className="inline-flex items-center gap-1.5 rounded-full bg-bg px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink ring-1 ring-bg/80 transition-all hover:-translate-y-0.5 hover:bg-gradient-to-r hover:from-cobalt hover:via-terracotta hover:to-forest hover:text-bg hover:ring-transparent"
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
            <p className="f-serif text-2xl italic text-bg md:text-3xl">Stuti</p>
            <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-bg/60">
              Portfolio · 2026
            </p>
          </div>
          <p className="text-xs text-bg/60">
            Designed &amp; built by Stuti Pandya · 2026
          </p>
        </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
