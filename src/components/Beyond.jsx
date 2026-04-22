import { motion } from 'framer-motion'
import Squiggle from './Squiggle'
import Polaroid from './Polaroid'
import { WavyUnderline, HandStar } from './Doodles'

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
    icon: '🍜',
    name: 'Trying New Food',
    line: 'Always down to find the best spot in any city.',
    tone: 'terracotta',
  },
  {
    icon: '📷',
    name: 'Digicam Photography',
    line: 'Grain > pixels. Always.',
    tone: 'forest',
    star: true,
  },
]

const PILL_TONES = {
  terracotta: 'bg-terracotta/10 text-terracotta ring-terracotta/20',
  cobalt: 'bg-cobalt/10 text-cobalt ring-cobalt/20',
  sun: 'bg-sun/25 text-ink/80 ring-sun/40',
  forest: 'bg-forest/10 text-forest ring-forest/25',
}

const polaroids = [
  { src: '/photos/beyond/kayaks.JPG', caption: 'somewhere', rotation: 1 },
  { src: '/photos/beyond/pizza.JPG', caption: 'food > everything', rotation: -1.5 },
  { src: '/photos/beyond/flamingos.JPG', caption: 'ottawa zoo', rotation: 1.5 },
  { src: '/photos/beyond/friends.JPG', caption: 'us :)', rotation: -1 },
  { src: '/photos/beyond/digicam.JPG', caption: 'digicam dump', rotation: 0.5 },
  { src: '/photos/beyond/lil-bytes.JPG', caption: 'lil bytes', rotation: -2 },
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

      {item.star ? (
        <HandStar
          className="pointer-events-none absolute -right-4 -top-5 h-8 w-8 md:-right-6 md:-top-7 md:h-10 md:w-10"
          strokeWidth={2}
        />
      ) : null}

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

function PolaroidTile({ poly, index }) {
  return (
    <motion.div
      initial={{ y: 16, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={viewOnce}
      transition={{
        duration: 0.55,
        ease: [0.22, 1, 0.36, 1],
        delay: 0.15 + index * 0.06,
      }}
    >
      <Polaroid
        src={poly.src}
        caption={poly.caption}
        rotation={poly.rotation}
        alt={poly.caption}
      />
    </motion.div>
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
          Engineer by degree. Reader,{' '}
          <span className="relative inline-block">
            food hunter
            <WavyUnderline className="pointer-events-none absolute -bottom-1 left-0 w-full md:-bottom-2" />
          </span>
          , and digicam{' '}
          <span className="relative inline-block">
            enthusiast
            <Squiggle className="pointer-events-none absolute -bottom-1 left-0 w-full md:-bottom-2" />
          </span>{' '}
          by choice.
        </motion.h2>

        <motion.p
          initial="hidden"
          whileInView="show"
          viewport={viewOnce}
          variants={fadeUp(0.1)}
          className="mt-10 max-w-2xl text-base leading-[1.75] text-ink/85 md:text-[17px]"
        >
          I&apos;m Stuti — I build things across AI, hardware, and the full stack.
          When I&apos;m not writing code I&apos;m reading (currently on a big
          fiction kick), wandering around with my digicam, or always looking for
          the best meal in whatever city I&apos;m in. I co-run{' '}
          <a
            href="https://www.instagram.com/lilbytes.tech/"
            target="_blank"
            rel="noreferrer"
            className="underline decoration-terracotta decoration-2 underline-offset-4 hover:text-terracotta"
          >
            Lil Bytes
          </a>{' '}
          with Krisha — a small corner of the internet where we try to make CS
          concepts actually make sense.
        </motion.p>

        <div className="mt-14 grid gap-12 md:mt-16 md:grid-cols-[55fr_45fr] md:gap-16">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={viewOnce}
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
            }}
          >
            <p className="eyebrow text-muted">A few favorite things</p>
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5">
              {interests.map((item, i) => (
                <InterestCard key={item.name} item={item} index={i} />
              ))}
            </div>
          </motion.div>

          <div className="relative">
            <p className="eyebrow text-muted">From the camera roll</p>
            <div className="mt-5 grid grid-cols-2 gap-4 md:gap-5">
              {polaroids.map((p, i) => (
                <PolaroidTile key={p.caption} poly={p} index={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
