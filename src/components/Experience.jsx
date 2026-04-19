import { motion } from 'framer-motion'
import Squiggle from './Squiggle'

const roles = [
  {
    company: 'TrendAI',
    sub: 'Trend Micro Canada',
    title: 'Software Developer Co-op',
    dates: 'May – Aug 2026',
    line: 'AI-driven threat detection and ML pipeline development.',
    accent: 'cobalt',
  },
  {
    company: 'Solace',
    sub: null,
    title: 'Support Engineer Intern',
    dates: 'Sep – Dec 2025',
    line: 'Debugged distributed event broker systems; guided enterprise cloud architecture across AWS / Azure / GCP.',
    accent: 'terracotta',
  },
  {
    company: 'Natural Resources Canada',
    sub: null,
    title: 'Software Engineering Intern',
    dates: 'May 2024 – Aug 2025 · 3 terms',
    line: 'Salesforce automation, Oracle DB optimization, and C# / Apex data pipelines.',
    accent: 'forest',
  },
]

const ACCENT_BAR = {
  cobalt: 'bg-cobalt',
  terracotta: 'bg-terracotta',
  forest: 'bg-forest',
  sun: 'bg-sun',
}

const row = (i = 0) => ({
  hidden: { y: 30, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.55, ease: 'easeOut', delay: i * 0.1 },
  },
})

export default function Experience() {
  return (
    <section className="min-h-full bg-sand">
      <div className="mx-auto max-w-6xl px-5 py-14 md:px-8 md:py-20">
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
            built things.
            <Squiggle className="pointer-events-none absolute -bottom-1 left-0 w-full md:-bottom-2" />
          </span>
        </motion.h2>

        <ul className="mt-14 md:mt-16">
          {roles.map((r, i) => (
            <motion.li
              key={`${r.company}-${r.dates}`}
              variants={row(i)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              className="group relative border-b border-ink/10 py-8 md:py-10"
            >
              <span
                className={`absolute inset-y-0 left-0 w-[3px] origin-top scale-y-0 transition-transform duration-200 ease-out group-hover:scale-y-100 ${ACCENT_BAR[r.accent]}`}
                aria-hidden
              />
              <div className="md:pl-6">
                <div className="flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between">
                  <div>
                    <p className="f-display flex items-center gap-3 text-3xl font-bold tracking-tight text-ink md:text-5xl">
                      <span
                        className={`inline-block h-3 w-3 rounded-sm md:h-3.5 md:w-3.5 ${ACCENT_BAR[r.accent]}`}
                        aria-hidden
                      />
                      {r.company}
                    </p>
                    {r.sub ? (
                      <p className="mt-1 pl-6 text-sm text-muted md:pl-[26px]">{r.sub}</p>
                    ) : null}
                  </div>
                  <p className="eyebrow text-muted">{r.dates}</p>
                </div>
                <p className="mt-4 text-sm font-semibold text-terracotta md:text-base">
                  {r.title}
                </p>
                <p className="mt-2 max-w-3xl text-muted md:text-[1.02rem]">{r.line}</p>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  )
}
