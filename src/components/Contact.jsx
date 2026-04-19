import { motion } from 'framer-motion'
import Squiggle from './Squiggle'

const links = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/stutipandya' },
  { label: 'GitHub', href: 'https://github.com/stutipandya' },
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
  return (
    <section className="flex min-h-full items-center bg-terracotta text-bg">
      <div className="mx-auto w-full max-w-4xl px-5 py-16 text-center md:px-8 md:py-24">
        <motion.h2
          initial="hidden"
          whileInView="show"
          viewport={viewOnce}
          variants={fadeUp(0)}
          className="f-serif text-[clamp(40px,7vw,88px)] font-bold leading-[1.1] tracking-tight text-bg"
        >
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
          <a
            href="mailto:stuti.pandya0@gmail.com"
            className="group f-display inline-block text-2xl font-bold tracking-tight text-bg md:text-4xl"
          >
            <span className="border-b-2 border-transparent pb-1 transition-colors duration-200 group-hover:border-sun group-hover:text-sun">
              stuti.pandya0@gmail.com
            </span>
          </a>
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
