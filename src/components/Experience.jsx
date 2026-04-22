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

/** Warm panel + strong left edge (reads like a margin note, not a generic card) */
const SHIPPED_PANEL = {
  cobalt: 'border-l-[5px] border-cobalt bg-[#f4f6fd] shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]',
  terracotta: 'border-l-[5px] border-terracotta bg-[#fff8f3] shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]',
  forest: 'border-l-[5px] border-forest bg-[#f2faf5] shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]',
  sun: 'border-l-[5px] border-sun bg-[#fffbeb] shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]',
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
    <section className="relative min-h-full overflow-hidden bg-sand text-ink">
      {/* Paper grain — breaks up flat fills without “hero gradient” cliché */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.05\'/%3E%3C/svg%3E")',
        }}
      />
      <div className="relative mx-auto max-w-6xl px-5 py-14 md:px-8 md:py-20">
        <div>
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
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.55, ease: 'easeOut', delay: 0.12 }}
          className="mt-8 max-w-2xl border-l-4 border-terracotta/45 pl-5 md:mt-9 md:pl-6"
        >
          <p className="f-hand text-[1.35rem] leading-snug text-ink/75 md:text-[1.45rem]">
            Government tooling, message brokers, then threat-detection ML.
          </p>
          <p className="mt-3 text-base leading-[1.75] text-muted md:text-[17px]">
            Four co-op terms across two industries, plus one incoming role: Salesforce and data work
            at NRC, pub/sub support at Solace, then TrendAI in 2026.
          </p>
        </motion.div>

        {/* One “desk card” strip instead of three identical tiles */}
        <div className="mt-12 md:mt-14">
          <p className="eyebrow mb-3 text-muted">At a glance</p>
          <motion.ul
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.08, delayChildren: 0.18 } },
            }}
            className="grid grid-cols-3 overflow-hidden rounded-2xl bg-bg shadow-[0_2px_0_rgba(17,17,17,0.04),0_12px_40px_-12px_rgba(17,17,17,0.08)] ring-1 ring-ink/10"
          >
            {stats.map((s, i) => (
              <motion.li
                key={s.label}
                variants={row(0)}
                className={`relative px-4 py-6 md:px-7 md:py-8 ${i > 0 ? 'border-l border-ink/10' : ''}`}
              >
                <span
                  aria-hidden
                  className={`absolute left-3 top-0 h-1 w-10 rounded-b-sm md:left-5 md:w-12 ${
                    i === 0 ? 'bg-forest' : i === 1 ? 'bg-terracotta' : 'bg-cobalt'
                  }`}
                />
                <p className="f-display pt-2 text-3xl font-bold tabular-nums tracking-tight text-ink md:text-[2.75rem]">
                  <CountNumber value={s.n} />
                </p>
                <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted md:text-[11px]">
                  {s.label}
                </p>
              </motion.li>
            ))}
          </motion.ul>
        </div>

        {/* Roles: stacked papers + timeline rail */}
        <ul ref={listRef} className="relative mt-14 md:mt-20">
          <span
            ref={railRef}
            aria-hidden
            className="pointer-events-none absolute left-[5px] top-2 hidden h-[calc(100%-0.5rem)] w-[2px] origin-top rounded-full bg-gradient-to-b from-terracotta/45 via-ink/18 to-ink/8 md:block"
          />
          {roles.map((r, i) => (
            <motion.li
              key={`${r.company}-${r.dates}`}
              variants={row(i)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.25 }}
              className="group relative mb-6 last:mb-0 md:mb-8"
            >
              <span
                className={`absolute left-0 top-8 z-[1] hidden h-3 w-3 rounded-full ring-[3px] ring-sand ring-offset-0 md:block ${ACCENT_BAR[r.accent]}`}
                aria-hidden
              />

              <div className="rounded-2xl bg-bg p-6 shadow-[0_1px_0_rgba(17,17,17,0.05)] ring-1 ring-ink/[0.08] transition-shadow duration-200 group-hover:shadow-[0_10px_36px_-12px_rgba(17,17,17,0.12)] md:ml-7 md:p-8 md:pl-10">
                <div className="flex flex-col gap-2 md:flex-row md:items-baseline md:justify-between">
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="f-display text-2xl font-bold tracking-tight text-ink md:text-4xl">
                      {r.company}
                    </p>
                    {r.incoming ? <IncomingBadge /> : null}
                  </div>
                  <p className="eyebrow text-muted">{r.dates}</p>
                </div>

                {r.sub ? (
                  <p className="mt-1 text-sm text-muted md:text-[15px]">{r.sub}</p>
                ) : null}

                <p
                  className={`mt-4 text-sm font-semibold md:text-[15px] ${ACCENT_TEXT[r.accent]}`}
                >
                  {r.title}
                </p>
                <p className="mt-2 max-w-3xl text-[15px] leading-[1.65] text-ink/80 md:text-[1.02rem]">
                  {r.line}
                </p>

                {r.shipped?.length ? (
                  <div className={`mt-5 rounded-r-xl rounded-bl-xl px-4 py-4 md:mt-6 md:px-5 md:py-5 ${SHIPPED_PANEL[r.accent]}`}>
                    <p className="eyebrow text-ink/50">{r.shippedLabel}</p>
                    <ul className="mt-2.5 grid gap-2 md:gap-2.5">
                      {r.shipped.map((item) => (
                        <li
                          key={item}
                          className="flex gap-3 text-[14px] leading-[1.55] text-ink/88 md:text-[15px]"
                        >
                          <span
                            aria-hidden
                            className={`mt-[0.5em] inline-block h-1 w-1 shrink-0 rotate-45 ${ACCENT_BAR[r.accent]}`}
                          />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {r.tags?.length ? (
                  <ul className="mt-4 flex flex-wrap gap-2 md:mt-5">
                    {r.tags.map((t) => (
                      <li key={t}>
                        <span className="inline-flex items-center rounded-md border border-dashed border-ink/15 bg-sand/80 px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.1em] text-ink/70">
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
    <span className="relative inline-flex items-center gap-1.5 rounded-md border border-cobalt/25 bg-cobalt/[0.08] px-2 py-1 text-[9px] font-bold uppercase tracking-[0.2em] text-cobalt">
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cobalt/50" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cobalt" />
      </span>
      Incoming
    </span>
  )
}
