import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { gsap } from '../lib/scroll'
import { prefersReducedMotion } from '../hooks/useReducedMotion'

// Accent resolution — mirrors the palette used on the Projects grid so a tile
// and its case-study hero share colors during the Framer layoutId morph.
const ACCENTS = {
  cobalt: { hex: '#2A4BCC', bar: 'bg-cobalt', text: 'text-cobalt' },
  terracotta: { hex: '#E8521A', bar: 'bg-terracotta', text: 'text-terracotta' },
  sun: { hex: '#F0C93A', bar: 'bg-sun', text: 'text-sun' },
  forest: { hex: '#1A6B45', bar: 'bg-forest', text: 'text-forest' },
}

function StackPills({ stack, accent }) {
  return (
    <motion.ul
      layoutId={`project-stack-${accent}-${stack.join('|')}`}
      className="flex flex-wrap gap-2"
    >
      {stack.map((s) => (
        <li key={s}>
          <span className="inline-flex items-center rounded-full bg-bg/10 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-bg/85 ring-1 ring-bg/20">
            {s}
          </span>
        </li>
      ))}
    </motion.ul>
  )
}

function MetricPill({ metric, accent }) {
  const numRef = useRef(null)
  const countTo = parseFloat(metric.number)
  const isNumeric = Number.isFinite(countTo)

  useEffect(() => {
    if (!isNumeric) return undefined
    if (prefersReducedMotion()) return undefined
    const el = numRef.current
    if (!el) return undefined

    const scrollerEl = document.querySelector('#tab-panel')
    const counter = { val: 0 }
    const decimals = (metric.number.split('.')[1] || '').length
    const tween = gsap.to(counter, {
      val: countTo,
      duration: 1.3,
      ease: 'power2.out',
      onUpdate: () => {
        el.textContent = `${counter.val.toFixed(decimals)}${metric.suffix || ''}`
      },
      scrollTrigger: {
        trigger: el,
        scroller: scrollerEl || undefined,
        start: 'top 85%',
        toggleActions: 'play none none reset',
      },
    })
    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [isNumeric, countTo, metric.number, metric.suffix])

  return (
    <li className="flex flex-col gap-2 rounded-2xl bg-ink-card p-6 ring-1 ring-bg/10">
      <span
        ref={numRef}
        className="f-display text-3xl font-bold tabular-nums md:text-4xl"
        style={{ color: accent.hex }}
      >
        {isNumeric ? `0${metric.suffix || ''}` : `${metric.number}${metric.suffix || ''}`}
      </span>
      <span className="text-[13px] font-medium text-bg/70 md:text-sm">{metric.label}</span>
    </li>
  )
}

export default function ProjectCaseStudy({ project, onBack }) {
  const { title, tagline, blurb, stack, github, live, accent: accentKey, caseStudy } = project
  const accent = ACCENTS[accentKey] || ACCENTS.terracotta

  // Scroll to top of case study on open so the user sees the morph target.
  useEffect(() => {
    const el = document.getElementById('tab-panel')
    if (el) el.scrollTop = 0
  }, [project.id])

  // Esc key closes the case study.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onBack()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onBack])

  return (
    <motion.article
      key={project.id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="min-h-full bg-ink text-bg"
    >
      {/* Hero — layoutId elements morph from the grid tile. */}
      <div className="relative mx-auto max-w-6xl px-5 pt-10 md:px-8 md:pt-14">
        <button
          type="button"
          onClick={onBack}
          data-cursor="view"
          className="group inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.16em] text-bg/70 transition-colors hover:text-bg"
        >
          <span
            aria-hidden
            className="inline-block transition-transform duration-200 group-hover:-translate-x-1"
          >
            ←
          </span>
          Back to projects
          <span className="ml-3 hidden text-[10px] text-bg/40 md:inline">ESC</span>
        </button>

        <motion.div
          layoutId={`project-card-${project.id}`}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="relative mt-6 overflow-hidden rounded-2xl bg-ink-card p-8 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.5)] md:p-12"
        >
          <motion.span
            layoutId={`project-bar-${project.id}`}
            className={`absolute inset-x-0 top-0 h-1 ${accent.bar}`}
            aria-hidden
          />
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <motion.h2
                layoutId={`project-title-${project.id}`}
                className="f-display text-5xl font-bold leading-[0.95] tracking-tight md:text-[5rem]"
              >
                {title}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: 'easeOut', delay: 0.25 }}
                className={`eyebrow mt-5 ${accent.text}`}
              >
                {tagline}
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut', delay: 0.32 }}
                className="mt-5 max-w-xl text-[15px] leading-relaxed text-bg/80 md:text-base"
              >
                {blurb}
              </motion.p>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: 0.38 }}
              className="flex flex-col gap-4 md:items-end"
            >
              <StackPills stack={stack} accent={accentKey} />
              <div className="flex gap-4 text-sm font-semibold">
                <a
                  href={github}
                  target="_blank"
                  rel="noreferrer"
                  data-cursor="open"
                  className="inline-flex items-center gap-1 text-bg/85 underline decoration-bg/30 decoration-2 underline-offset-[6px] transition-colors hover:text-bg"
                >
                  GitHub →
                </a>
                {live ? (
                  <a
                    href={live}
                    target="_blank"
                    rel="noreferrer"
                    data-cursor="open"
                    className="inline-flex items-center gap-1 text-bg/85 underline decoration-bg/30 decoration-2 underline-offset-[6px] transition-colors hover:text-bg"
                  >
                    Live →
                  </a>
                ) : null}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Problem */}
      {caseStudy?.problem ? (
        <section className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
          <p className={`eyebrow ${accent.text}`}>The problem</p>
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="f-serif mt-6 max-w-4xl text-[clamp(28px,3.8vw,48px)] font-bold leading-[1.2] tracking-tight"
          >
            {caseStudy.problem}
          </motion.h3>
          {caseStudy.pullQuote ? (
            <motion.blockquote
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
              className="f-hand relative mt-14 max-w-3xl border-l-2 pl-6 text-[22px] leading-[1.35] text-bg/85 md:text-[26px]"
              style={{ borderColor: accent.hex }}
            >
              &ldquo;{caseStudy.pullQuote}&rdquo;
            </motion.blockquote>
          ) : null}
        </section>
      ) : null}

      {/* Decisions */}
      {caseStudy?.decisions?.length ? (
        <section className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
          <p className={`eyebrow ${accent.text}`}>Key decisions</p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {caseStudy.decisions.map((d, i) => (
              <motion.article
                key={d.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, ease: 'easeOut', delay: i * 0.08 }}
                className="relative rounded-xl bg-ink-card p-6 ring-1 ring-bg/10 md:p-7"
              >
                <span
                  className="absolute inset-x-0 top-0 h-[2px] rounded-t-xl"
                  style={{ backgroundColor: accent.hex }}
                  aria-hidden
                />
                <h4 className="f-display text-lg font-bold leading-tight md:text-xl">
                  {d.title}
                </h4>
                <p className="mt-3 text-[14.5px] leading-relaxed text-bg/75">{d.body}</p>
              </motion.article>
            ))}
          </div>
        </section>
      ) : null}

      {/* Metrics */}
      {caseStudy?.metrics?.length ? (
        <section className="bg-ink-card py-20 md:py-24">
          <div className="mx-auto max-w-6xl px-5 md:px-8">
            <p className={`eyebrow ${accent.text}`}>Shipped</p>
            <ul className="mt-8 grid gap-5 sm:grid-cols-2 md:grid-cols-3">
              {caseStudy.metrics.map((m) => (
                <MetricPill key={m.label} metric={m} accent={accent} />
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {/* Lessons */}
      {caseStudy?.lessons ? (
        <section className="mx-auto max-w-4xl px-5 py-20 md:px-8 md:py-28">
          <p className={`eyebrow ${accent.text}`}>Lessons</p>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            className="f-serif mt-6 text-[clamp(22px,2.6vw,32px)] font-medium leading-[1.4]"
          >
            {caseStudy.lessons}
          </motion.p>
        </section>
      ) : null}

      {/* CTA */}
      <section className="mx-auto max-w-5xl px-5 pb-24 md:px-8 md:pb-32">
        <div className="flex flex-col items-start justify-between gap-6 rounded-2xl bg-ink-card p-8 ring-1 ring-bg/10 md:flex-row md:items-center md:p-10">
          <div>
            <p className={`eyebrow ${accent.text}`}>Have a look</p>
            <p className="f-display mt-3 text-2xl font-bold tracking-tight md:text-3xl">
              Code, live demo, or reach out.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 text-sm font-semibold">
            <a
              href={github}
              target="_blank"
              rel="noreferrer"
              data-cursor="open"
              className="rounded-full px-5 py-2.5 ring-1 ring-bg/30 transition-all hover:-translate-y-0.5 hover:bg-bg hover:text-ink"
            >
              GitHub
            </a>
            {live ? (
              <a
                href={live}
                target="_blank"
                rel="noreferrer"
                data-cursor="open"
                className="rounded-full px-5 py-2.5 transition-all hover:-translate-y-0.5"
                style={{
                  backgroundColor: accent.hex,
                  color: accentKey === 'sun' ? '#111' : '#FAFAF8',
                }}
              >
                Live demo
              </a>
            ) : null}
            <button
              type="button"
              onClick={() =>
                window.dispatchEvent(new CustomEvent('portfolio:navigate', { detail: 'contact' }))
              }
              data-cursor="write"
              className="rounded-full px-5 py-2.5 ring-1 ring-bg/30 transition-all hover:-translate-y-0.5 hover:bg-bg hover:text-ink"
            >
              Email Stuti
            </button>
          </div>
        </div>
      </section>
    </motion.article>
  )
}
