import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import Squiggle from './Squiggle'
import { gsap } from '../lib/scroll'
import { prefersReducedMotion } from '../hooks/useReducedMotion'

const roles = [
  {
    company: 'TrendAI',
    sub: 'Trend Micro Canada Technologies',
    title: 'Software Developer Co-op',
    dates: 'May – Aug 2026',
    incoming: true,
    line: 'Incoming software developer co-op at TrendAI (Trend Micro Canada), May 2026. Focus will be ML pipelines for threat detection. I will know more once I start; likely Python services, model tooling, and cloud deploys.',
    shippedLabel: "What I'll be working on",
    shipped: [
      'ML pipelines behind real-time threat detection.',
      'First role on a security-focused ML team.',
      'Python, model tooling, and cloud infrastructure in production.',
    ],
    tags: ['Python', 'ML pipelines', 'Cloud infra', 'Security ML'],
    accent: 'cobalt',
  },
  {
    company: 'Solace',
    sub: null,
    title: 'Support Engineer Intern',
    dates: 'Sep – Dec 2025',
    line: 'Production debugging on distributed PubSub+ brokers for enterprise clients (trading, airlines, large SaaS backends). Helped customers choose AWS, Azure, or GCP layouts for event-driven systems.',
    shippedLabel: 'Shipped',
    shipped: [
      'Triaged and resolved production pub/sub incidents for enterprise clients.',
      'Guided cloud architecture across AWS, Azure, and GCP deployments.',
      'Learned how pub/sub behaves under load: backpressure, ordering, failover paths.',
    ],
    tags: ['PubSub+', 'Event brokers', 'AWS', 'Azure', 'GCP'],
    accent: 'terracotta',
  },
  {
    company: 'Natural Resources Canada',
    sub: null,
    title: 'Software Engineering Intern',
    dates: 'May 2024 – Aug 2025 · 3 terms',
    line: 'Three co-op terms building internal tooling for a federal science organization. Salesforce apps in Apex and Lightning Web Components, automation that cut manual processing time, Oracle tuning, and C# pipelines between legacy systems and Salesforce.',
    shippedLabel: 'Shipped',
    shipped: [
      'Custom Salesforce apps in Apex + Lightning Web Components.',
      'Automation workflows and triggers that cut manual processing time.',
      'Oracle SQL tuning and C# pipelines bridging legacy systems into Salesforce.',
    ],
    tags: ['Salesforce', 'Apex', 'LWC', 'C#', 'Oracle SQL', 'SQL Server'],
    accent: 'forest',
  },
]

const ACCENT_BAR = {
  cobalt: 'bg-cobalt',
  terracotta: 'bg-terracotta',
  forest: 'bg-forest',
  sun: 'bg-sun',
}

const ACCENT_TEXT = {
  cobalt: 'text-cobalt',
  terracotta: 'text-terracotta',
  forest: 'text-forest',
  sun: 'text-ink',
}

const ACCENT_RING = {
  cobalt: 'ring-cobalt/30',
  terracotta: 'ring-terracotta/30',
  forest: 'ring-forest/30',
  sun: 'ring-sun/60',
}

const ACCENT_BG_SOFT = {
  cobalt: 'bg-cobalt/5',
  terracotta: 'bg-terracotta/5',
  forest: 'bg-forest/5',
  sun: 'bg-sun/15',
}

const stats = [
  { n: 3, label: 'Companies' },
  { n: 4, label: 'Co-op terms' },
  { n: 16, label: 'Months on co-op' },
]

const row = (i = 0) => ({
  hidden: { y: 30, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.55, ease: 'easeOut', delay: i * 0.1 },
  },
})

// Counts up from 0 → target when the number scrolls into view. Falls back to
// the final value for reduced-motion users.
function CountNumber({ value, duration = 1.1 }) {
  const ref = useRef(null)
  useEffect(() => {
    if (prefersReducedMotion()) {
      if (ref.current) ref.current.textContent = String(value)
      return undefined
    }
    const el = ref.current
    if (!el) return undefined
    const scrollerEl = document.querySelector('#tab-panel')
    const counter = { v: 0 }
    const tween = gsap.to(counter, {
      v: value,
      duration,
      ease: 'power2.out',
      onUpdate: () => {
        el.textContent = Math.round(counter.v)
      },
      scrollTrigger: {
        trigger: el,
        scroller: scrollerEl || undefined,
        start: 'top 92%',
        once: true,
      },
    })
    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [value, duration])
  return (
    <span ref={ref} className="tabular-nums">
      {prefersReducedMotion() ? value : 0}
    </span>
  )
}

export default function Experience() {
  const railRef = useRef(null)
  const listRef = useRef(null)

  useEffect(() => {
    if (prefersReducedMotion()) return undefined
    const rail = railRef.current
    const list = listRef.current
    if (!rail || !list) return undefined

    const scrollerEl = document.querySelector('#tab-panel')

    const tween = gsap.fromTo(
      rail,
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: list,
          scroller: scrollerEl || undefined,
          start: 'top 80%',
          end: 'bottom 80%',
          scrub: 0.6,
        },
      }
    )

    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [])

  return (
    <section className="min-h-full bg-bg">
      <div className="mx-auto max-w-6xl px-5 py-14 md:px-8 md:py-20">
        {/* Header */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="eyebrow text-terracotta"
        >
          Experience
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.05 }}
          className="f-serif mt-6 max-w-3xl text-[clamp(36px,5vw,72px)] font-bold leading-[1.15] tracking-tight text-ink"
        >
          Where I&apos;ve{' '}
          <span className="relative inline-block">
            worked.
            <Squiggle className="pointer-events-none absolute -bottom-1 left-0 w-full md:-bottom-2" />
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.55, ease: 'easeOut', delay: 0.12 }}
          className="mt-6 max-w-2xl text-base leading-[1.7] text-muted md:text-[17px]"
        >
          Four co-op terms across two industries, plus one incoming role: federal Salesforce and
          data work, Solace pub/sub support, then TrendAI in 2026.
        </motion.p>

        {/* Stats strip */}
        <motion.ul
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.08, delayChildren: 0.18 } },
          }}
          className="mt-12 grid grid-cols-3 gap-3 md:mt-14 md:gap-5"
        >
          {stats.map((s, i) => (
            <motion.li
              key={s.label}
              variants={row(0)}
              className="relative overflow-hidden rounded-2xl bg-card px-5 py-6 ring-1 ring-ink/10 md:px-6 md:py-7"
            >
              <span
                aria-hidden
                className={`absolute inset-x-0 top-0 h-[2px] ${
                  i === 0 ? 'bg-forest' : i === 1 ? 'bg-terracotta' : 'bg-cobalt'
                }`}
              />
              <p className="f-display text-4xl font-bold tracking-tight text-ink md:text-[3.25rem]">
                <CountNumber value={s.n} />
              </p>
              <p className="mt-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted md:text-xs">
                {s.label}
              </p>
            </motion.li>
          ))}
        </motion.ul>

        {/* Roles list */}
        <ul ref={listRef} className="relative mt-16 md:mt-20">
          <span
            ref={railRef}
            aria-hidden
            className="pointer-events-none absolute left-0 top-0 hidden h-full w-[2px] origin-top bg-ink/25 md:block"
          />
          {roles.map((r, i) => (
            <motion.li
              key={`${r.company}-${r.dates}`}
              variants={row(i)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.25 }}
              className="group relative border-b border-ink/10 py-10 md:py-12"
            >
              {/* Hover accent bar */}
              <span
                className={`absolute inset-y-0 left-0 w-[3px] origin-top scale-y-0 transition-transform duration-200 ease-out group-hover:scale-y-100 ${ACCENT_BAR[r.accent]}`}
                aria-hidden
              />

              <div className="md:pl-8">
                {/* Top row: company + dates */}
                <div className="flex flex-col gap-2 md:flex-row md:items-baseline md:justify-between">
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="f-display flex items-center gap-3 text-3xl font-bold tracking-tight text-ink md:text-5xl">
                      <span
                        className={`inline-block h-3 w-3 rounded-sm md:h-3.5 md:w-3.5 ${ACCENT_BAR[r.accent]}`}
                        aria-hidden
                      />
                      {r.company}
                    </p>
                    {r.incoming ? <IncomingBadge /> : null}
                  </div>
                  <p className="eyebrow text-muted">{r.dates}</p>
                </div>

                {r.sub ? (
                  <p className="mt-1 pl-6 text-sm text-muted md:pl-[26px]">{r.sub}</p>
                ) : null}

                <p
                  className={`mt-5 text-sm font-semibold md:text-base ${ACCENT_TEXT[r.accent]}`}
                >
                  {r.title}
                </p>
                <p className="mt-3 max-w-3xl text-muted md:text-[1.02rem]">{r.line}</p>

                {/* Shipped / Excited-about bullets */}
                {r.shipped?.length ? (
                  <div
                    className={`mt-6 rounded-xl px-5 py-5 ring-1 ring-inset md:px-6 md:py-5 ${ACCENT_BG_SOFT[r.accent]} ${ACCENT_RING[r.accent]}`}
                  >
                    <p className="eyebrow text-muted">{r.shippedLabel}</p>
                    <ul className="mt-3 grid gap-2.5 md:gap-3">
                      {r.shipped.map((item) => (
                        <li key={item} className="flex gap-3 text-[14.5px] leading-[1.55] text-ink/85 md:text-[15px]">
                          <span
                            aria-hidden
                            className={`mt-[0.55em] inline-block h-1.5 w-1.5 shrink-0 rounded-full ${ACCENT_BAR[r.accent]}`}
                          />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {/* Tech tags */}
                {r.tags?.length ? (
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {r.tags.map((t) => (
                      <li key={t}>
                        <span className="inline-flex items-center rounded-full bg-ink/5 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-ink/70 ring-1 ring-ink/10">
                          {t}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </motion.li>
          ))}
        </ul>

      </div>
    </section>
  )
}

function IncomingBadge() {
  return (
    <span className="relative inline-flex items-center gap-1.5 rounded-full bg-cobalt/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-cobalt ring-1 ring-cobalt/30">
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cobalt/60" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cobalt" />
      </span>
      Incoming
    </span>
  )
}
