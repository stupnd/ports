import { motion } from 'framer-motion'
import Squiggle from './Squiggle'

const viewOnce = { once: true, amount: 0.15 }

const fadeUp = (delay = 0) => ({
  hidden: { y: 30, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: 'easeOut', delay },
  },
})

const interests = [
  {
    icon: '📚',
    name: 'Reading',
    line: 'Currently: fiction, always. Recommendations welcome.',
    tone: 'terracotta',
  },
  {
    icon: '🎬',
    name: 'Sitcoms',
    line: 'Comfort rewatch of the same 4 shows on rotation.',
    tone: 'cobalt',
  },
  {
    icon: '🍰',
    name: 'Healthy Baking',
    line: "Tofu chocolate cake. Don't knock it.",
    tone: 'sun',
  },
  {
    icon: '📷',
    name: 'Digicam Photography',
    line: 'Grain > pixels. Always.',
    tone: 'forest',
  },
]

const PILL_TONES = {
  terracotta: 'bg-terracotta/10 text-terracotta ring-terracotta/20',
  cobalt: 'bg-cobalt/10 text-cobalt ring-cobalt/20',
  sun: 'bg-sun/25 text-ink/80 ring-sun/40',
  forest: 'bg-forest/10 text-forest ring-forest/25',
}

const polaroids = [
  { caption: 'ottawa 2025', rotate: -3, yStart: 40 },
  { caption: 'kitchen experiments', rotate: 1, yStart: 60 },
  { caption: 'friends :)', rotate: -1, yStart: 30 },
  { caption: 'somewhere', rotate: 2, yStart: 50 },
]

function InterestCard({ item, index }) {
  return (
    <motion.div
      variants={fadeUp(index * 0.08)}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="relative flex flex-col justify-between rounded-xl bg-card p-5 shadow-[0_1px_0_rgba(17,17,17,0.04)] transition-shadow duration-200 hover:shadow-[0_14px_32px_-18px_rgba(17,17,17,0.25)] md:p-6"
    >
      <span
        className={`absolute right-4 top-4 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] ring-1 ${PILL_TONES[item.tone]}`}
        aria-hidden
      >
        {item.tone === 'sun' ? '★' : item.tone === 'cobalt' ? '◆' : '✦'}
      </span>

      <div className="text-2xl md:text-[28px]" aria-hidden>
        {item.icon}
      </div>

      <div className="mt-3">
        <p className="f-display text-lg font-bold leading-tight text-ink md:text-xl">
          {item.name}
        </p>
        <p className="mt-1.5 text-[13px] leading-snug text-muted md:text-sm">{item.line}</p>
      </div>
    </motion.div>
  )
}

function Polaroid({ poly, index }) {
  return (
    <motion.figure
      initial={{ y: poly.yStart, rotate: poly.rotate - 4, opacity: 0 }}
      whileInView={{ y: 0, rotate: poly.rotate, opacity: 1 }}
      viewport={viewOnce}
      transition={{
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
        delay: 0.15 + index * 0.12,
      }}
      className="bg-white p-3 pb-10 shadow-[0_18px_30px_-18px_rgba(17,17,17,0.35),0_2px_4px_rgba(17,17,17,0.08)]"
      style={{ rotate: `${poly.rotate}deg` }}
    >
      <div
        className="aspect-[3/4] w-full bg-gradient-to-br from-gray-200 via-gray-200 to-gray-300"
        role="img"
        aria-label={poly.caption}
      />
      <figcaption className="f-hand mt-3 text-center text-xl leading-none text-ink/75 md:text-2xl">
        {poly.caption}
      </figcaption>
    </motion.figure>
  )
}

export default function Beyond() {
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
          Beyond the Code
        </motion.p>

        <motion.h2
          initial="hidden"
          whileInView="show"
          viewport={viewOnce}
          variants={fadeUp(0.05)}
          className="f-serif mt-8 max-w-4xl text-[clamp(36px,5vw,72px)] font-bold leading-[1.2] tracking-tight text-ink"
        >
          Engineer by degree. Cook, reader, and digicam{' '}
          <span className="relative inline-block">
            enthusiast
            <Squiggle className="pointer-events-none absolute -bottom-1 left-0 w-full md:-bottom-2" />
          </span>{' '}
          by choice.
        </motion.h2>

        <div className="mt-14 grid gap-12 md:mt-16 md:grid-cols-12 md:gap-16">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={viewOnce}
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
            }}
            className="md:col-span-7"
          >
            <p className="eyebrow text-muted">A few favorite things</p>
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5">
              {interests.map((item, i) => (
                <InterestCard key={item.name} item={item} index={i} />
              ))}
            </div>
          </motion.div>

          <div className="relative md:col-span-5">
            <p className="eyebrow text-muted">From the camera roll</p>
            <div className="relative mt-5 flex flex-col gap-7 overflow-visible md:gap-8">
              {polaroids.map((p, i) => (
                <div
                  key={p.caption}
                  className={i % 2 === 0 ? 'self-start md:pr-8' : 'self-end md:pl-8'}
                  style={{ width: 'min(220px, 70%)' }}
                >
                  <Polaroid poly={p} index={i} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
