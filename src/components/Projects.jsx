import { motion } from 'framer-motion'
import Squiggle from './Squiggle'

const ACCENTS = {
  cobalt: {
    bar: 'bg-cobalt',
    pill: 'bg-cobalt text-bg ring-cobalt/40',
    link: 'hover:text-cobalt hover:decoration-cobalt',
    squiggle: '#2A4BCC',
  },
  terracotta: {
    bar: 'bg-terracotta',
    pill: 'bg-terracotta text-bg ring-terracotta/40',
    link: 'hover:text-terracotta hover:decoration-terracotta',
    squiggle: '#E8521A',
  },
  sun: {
    bar: 'bg-sun',
    pill: 'bg-sun text-ink ring-sun/60',
    link: 'hover:text-sun hover:decoration-sun',
    squiggle: '#F0C93A',
  },
  forest: {
    bar: 'bg-forest',
    pill: 'bg-forest text-bg ring-forest/40',
    link: 'hover:text-forest hover:decoration-forest',
    squiggle: '#1A6B45',
  },
}

const projects = [
  {
    id: 'pulse',
    title: 'Pulse',
    accent: 'cobalt',
    blurb:
      'AI investing assistant with streaming LLM responses, real-time stock data, and portfolio tracking.',
    stack: ['Next.js', 'FastAPI', 'Supabase', 'Claude API', 'Recharts'],
    github: 'https://github.com/stutipandya/pulse',
    live: 'https://pulse-stuti.vercel.app',
    featured: true,
  },
  {
    id: 'tinted',
    title: 'Tinted',
    accent: 'terracotta',
    blurb:
      'Computer vision pipeline for skin tone analysis and makeup recommendations.',
    stack: ['Python', 'MediaPipe', 'FastAPI', 'React'],
    github: 'https://github.com/stutipandya/tinted',
  },
  {
    id: 'bridge',
    title: 'Bridge',
    accent: 'sun',
    blurb:
      'Real-time ASL translation glove — Arduino ESP32 + flex sensors → BLE → React web app.',
    stack: ['Arduino', 'ESP32', 'BLE', 'React'],
    github: 'https://github.com/stutipandya/bridge',
  },
  {
    id: 'aerial',
    title: 'Aerial Image Segmentation',
    accent: 'forest',
    blurb:
      'UNet model for building footprint detection, deployed with Docker and CI/CD.',
    stack: ['PyTorch', 'Flask', 'Docker', 'GitHub Actions'],
    github: 'https://github.com/stutipandya/aerial-segmentation',
  },
]

const cardVariants = {
  hidden: { y: 30, opacity: 0 },
  show: (i = 0) => ({
    y: 0,
    opacity: 1,
    transition: { duration: 0.55, ease: 'easeOut', delay: i * 0.1 },
  }),
}

function ProjectCard({ project, index, featured = false }) {
  const { title, blurb, stack, github, live, accent } = project
  const a = ACCENTS[accent]

  return (
    <motion.article
      custom={index}
      variants={cardVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.25 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={`group relative flex flex-col justify-between overflow-hidden rounded-xl bg-ink-card p-7 shadow-[0_1px_0_rgba(0,0,0,0.4)] transition-shadow duration-200 hover:shadow-[0_24px_60px_-24px_rgba(0,0,0,0.6)] md:p-9 ${
        featured ? 'min-h-[320px] md:min-h-[360px]' : 'min-h-[260px]'
      }`}
    >
      <span className={`absolute inset-x-0 top-0 h-1 ${a.bar}`} aria-hidden />

      <div className="relative">
        <h3
          className={`f-display font-bold tracking-tight text-bg ${
            featured ? 'text-4xl md:text-[3.25rem]' : 'text-3xl md:text-4xl'
          }`}
        >
          {title}
        </h3>
        <p className="mt-4 max-w-prose text-[15px] leading-relaxed text-bg/75 md:text-base">
          {blurb}
        </p>
      </div>

      <div className="relative mt-8 flex flex-wrap items-end justify-between gap-5">
        <ul className="flex flex-wrap gap-2">
          {stack.map((s) => (
            <li key={s}>
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.12em] ring-1 ${a.pill}`}
              >
                {s}
              </span>
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap gap-5 text-sm font-semibold">
          <a
            href={github}
            target="_blank"
            rel="noreferrer"
            className={`text-bg/80 underline decoration-bg/25 decoration-2 underline-offset-[6px] transition-colors ${a.link}`}
          >
            GitHub →
          </a>
          {live ? (
            <a
              href={live}
              target="_blank"
              rel="noreferrer"
              className={`text-bg/80 underline decoration-bg/25 decoration-2 underline-offset-[6px] transition-colors ${a.link}`}
            >
              Live →
            </a>
          ) : null}
        </div>
      </div>
    </motion.article>
  )
}

export default function Projects() {
  const [featured, ...rest] = projects

  return (
    <section className="min-h-full bg-ink text-bg">
      <div className="mx-auto max-w-6xl px-5 py-14 md:px-8 md:py-20">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="eyebrow text-terracotta"
        >
          Projects
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.05 }}
          className="f-serif mt-6 max-w-3xl text-[clamp(36px,5vw,72px)] font-bold leading-[1.15] tracking-tight text-bg"
        >
          Things shipped{' '}
          <span className="relative inline-block">
            with care.
            <Squiggle className="pointer-events-none absolute -bottom-1 left-0 w-full md:-bottom-2" />
          </span>
        </motion.h2>

        <div className="mt-14 space-y-6 md:mt-16 md:space-y-8">
          <ProjectCard project={featured} index={0} featured />
          <div className="grid gap-6 md:grid-cols-2 md:gap-8">
            {rest.map((p, i) => (
              <ProjectCard key={p.id} project={p} index={i + 1} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
