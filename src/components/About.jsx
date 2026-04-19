import { motion } from 'framer-motion'
import PillTag from './PillTag'

const viewOnce = { once: true, amount: 0.15 }

const fadeUp = (delay = 0) => ({
  hidden: { y: 30, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: 'easeOut', delay },
  },
})

const skills = [
  { label: 'AI / ML', tone: 'terracottaSolid', rotate: -3 },
  { label: 'Full Stack', tone: 'cobaltSolid', rotate: 2 },
  { label: 'Embedded', tone: 'sunSolid', rotate: -1.5 },
  { label: 'IEEE WIE Chair', tone: 'forestSolid', rotate: 3 },
]

const currently = [
  { icon: '📍', text: 'Ottawa → Toronto (soon)' },
  { icon: '🎓', text: 'Graduating Dec 2026' },
  { icon: '💼', text: 'Co-op @ TrendAI, May 2026' },
  { icon: '🔍', text: 'Open to New Grad SWE / AI, Jan 2027' },
]

export default function About() {
  return (
    <section className="min-h-full bg-bg">
      <div className="mx-auto max-w-6xl px-5 py-14 md:px-8 md:py-20">
        <motion.p
          initial="hidden"
          whileInView="show"
          viewport={viewOnce}
          variants={fadeUp(0)}
          className="eyebrow text-terracotta"
        >
          About
        </motion.p>

        <motion.h2
          initial="hidden"
          whileInView="show"
          viewport={viewOnce}
          variants={fadeUp(0.05)}
          className="f-serif mt-8 max-w-4xl text-[clamp(36px,5vw,72px)] font-bold leading-[1.2] tracking-tight text-ink"
        >
          Hi, I&apos;m Stuti. I build things across hardware, software, and the fuzzy parts in
          between.
        </motion.h2>

        <motion.p
          initial="hidden"
          whileInView="show"
          viewport={viewOnce}
          variants={fadeUp(0.1)}
          className="mt-10 max-w-2xl text-base leading-[1.75] text-ink/85 md:text-[17px]"
        >
          I&apos;m a 4th-year Computer Engineering student at uOttawa, graduating December 2026.
          I build across the full stack: AI/ML apps, embedded systems, the occasional overly
          ambitious side project. I co-run{' '}
          <a
            href="https://www.instagram.com/lilbytes.tech/"
            target="_blank"
            rel="noreferrer"
            className="underline decoration-terracotta decoration-2 underline-offset-4 hover:text-terracotta"
          >
            Lil Bytes
          </a>{' '}
          with my friend Krisha — a tech education page where we try to make CS concepts
          actually make sense. IEEE WIE Chair this year. Based in Ottawa, headed to Toronto
          soon.
        </motion.p>

        <motion.ul
          initial="hidden"
          whileInView="show"
          viewport={viewOnce}
          variants={fadeUp(0.15)}
          className="mt-8 flex flex-wrap gap-3"
        >
          {skills.map((s) => (
            <li key={s.label}>
              <PillTag tone={s.tone} rotate={s.rotate} size="md">
                {s.label}
              </PillTag>
            </li>
          ))}
        </motion.ul>

        <motion.aside
          initial="hidden"
          whileInView="show"
          viewport={viewOnce}
          variants={fadeUp(0.2)}
          aria-label="Currently"
          className="mt-14 rounded-2xl bg-ink p-8 text-bg md:mt-16 md:p-10"
        >
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:gap-12">
            <div className="shrink-0">
              <p className="eyebrow text-terracotta">Currently</p>
              <p className="f-display mt-3 text-2xl font-bold leading-tight md:text-[28px]">
                On the way to
                <br />
                Toronto.
              </p>
            </div>
            <ul className="grid flex-1 grid-cols-1 gap-x-10 gap-y-4 sm:grid-cols-2">
              {currently.map((row) => (
                <li key={row.text} className="flex gap-3 text-[15px] text-bg/90">
                  <span aria-hidden>{row.icon}</span>
                  <span>{row.text}</span>
                </li>
              ))}
              <li className="flex gap-3 text-[15px] text-bg/90 sm:col-span-2">
                <span aria-hidden>🌐</span>
                <span>
                  <a
                    href="https://www.instagram.com/lilbytes.tech/"
                    target="_blank"
                    rel="noreferrer"
                    className="underline decoration-terracotta decoration-2 underline-offset-4 transition-colors hover:text-terracotta"
                  >
                    Lil Bytes
                  </a>{' '}
                  on Instagram
                </span>
              </li>
            </ul>
          </div>
        </motion.aside>
      </div>
    </section>
  )
}
