import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Squiggle from './Squiggle'
import Polaroid from './Polaroid'
import { WavyUnderline, HandStar, HandArrow } from './Doodles'

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

// Scrapbook mosaic — more photos from the roll, no captions (vibes-only).
// Rotations cycle through a small set so the mosaic feels hand-pinned without
// any single image floating too far off-axis.
const mosaicRotations = [-1.8, 1.2, -0.8, 2, -1.2, 0.8, -2, 1.6, -0.4, 1.4, -1.6, 0.6]
const mosaicSources = [
  '/photos/beyond/IMG_1989.JPG',
  '/photos/beyond/IMG_1990.JPG',
  '/photos/beyond/IMG_1991.JPG',
  '/photos/beyond/IMG_1992.JPG',
  '/photos/beyond/IMG_1993.JPG',
  '/photos/beyond/IMG_1994.JPG',
  '/photos/beyond/IMG_1995.JPG',
  '/photos/beyond/IMG_1996.JPG',
  '/photos/beyond/IMG_1997.JPG',
  '/photos/beyond/IMG_1998.JPG',
  '/photos/beyond/IMG_1999.JPG',
  '/photos/beyond/IMG_2001.JPG',
  '/photos/beyond/IMG_2002.JPG',
  '/photos/beyond/IMG_2003.JPG',
  '/photos/beyond/IMG_2004.JPG',
  '/photos/beyond/IMG_2005.JPG',
  '/photos/beyond/IMG_2006.JPG',
  '/photos/beyond/IMG_2007.JPG',
]
const mosaic = mosaicSources.map((src, i) => ({
  src,
  rotation: mosaicRotations[i % mosaicRotations.length],
  caption: '',
}))

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

function MosaicTile({ poly, index, onOpen }) {
  const reveal = (poly.rotation || 0) * 1.6
  return (
    <motion.button
      type="button"
      onClick={onOpen}
      data-cursor="view"
      initial={{ opacity: 0, y: 14, rotate: (poly.rotation || 0) * 1.4 }}
      whileInView={{ opacity: 1, y: 0, rotate: poly.rotation || 0 }}
      whileHover={{ rotate: reveal, y: -3, scale: 1.025, zIndex: 5 }}
      whileTap={{ scale: 0.97 }}
      viewport={viewOnce}
      transition={{
        duration: 0.55,
        ease: [0.22, 1, 0.36, 1],
        delay: 0.05 + (index % 6) * 0.04,
      }}
      className="mb-4 block w-full cursor-pointer rounded-[3px] bg-white p-[8px] shadow-[0_4px_14px_rgba(17,17,17,0.1)] transition-shadow duration-200 hover:shadow-[0_18px_34px_-16px_rgba(17,17,17,0.28)] focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 focus-visible:ring-offset-bg md:mb-5 md:p-[10px]"
      style={{ breakInside: 'avoid' }}
      aria-label="Open photo larger"
    >
      <img
        src={poly.src}
        alt=""
        loading="lazy"
        decoding="async"
        className="block w-full rounded-[2px] object-cover"
      />
    </motion.button>
  )
}

function PolaroidTile({ poly, index, onOpen }) {
  const reveal = (poly.rotation || 0) * 2
  return (
    <motion.button
      type="button"
      onClick={onOpen}
      data-cursor="view"
      initial={{ y: 16, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      whileHover={{ rotate: reveal, y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      viewport={viewOnce}
      transition={{
        duration: 0.55,
        ease: [0.22, 1, 0.36, 1],
        delay: 0.15 + index * 0.06,
      }}
      className="block w-full cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
      aria-label={`Open ${poly.caption} larger`}
    >
      <Polaroid
        src={poly.src}
        caption={poly.caption}
        rotation={poly.rotation}
        alt={poly.caption}
      />
    </motion.button>
  )
}

function Lightbox({ poly, onClose }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      onClick={onClose}
      className="fixed inset-0 z-[120] flex items-center justify-center bg-ink/80 p-6 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.94, y: 10, rotate: 0, opacity: 0 }}
        animate={{ scale: 1, y: 0, rotate: (poly.rotation || 0) / 2, opacity: 1 }}
        exit={{ scale: 0.95, y: 6, opacity: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[86vh] w-full max-w-[460px]"
      >
        <Polaroid
          src={poly.src}
          caption={poly.caption}
          rotation={0}
          alt={poly.caption}
          style={{ padding: '14px 14px 52px 14px' }}
        />
      </motion.div>
      <button
        type="button"
        onClick={onClose}
        className="absolute right-6 top-6 inline-flex items-center gap-2 rounded-full bg-bg/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-bg/85 ring-1 ring-bg/20 transition-colors hover:bg-bg hover:text-ink"
      >
        Close <span className="text-[10px] opacity-70">ESC</span>
      </button>
    </motion.div>
  )
}

function Signature({ className = '' }) {
  // Abstract cursive signature — a single swooping stroke with an underline
  // flourish. Draws itself on scroll-into-view for the classic pen-on-paper
  // feel without trying to spell letters out rigidly.
  return (
    <svg
      viewBox="0 0 320 90"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {/* Main signature flourish */}
      <motion.path
        d="M12 56
           C 24 26, 44 22, 52 42
           C 56 56, 42 66, 34 58
           C 30 54, 36 48, 48 50
           C 66 54, 72 40, 78 28
           L 78 62
           M 66 46 L 94 46
           C 104 46, 108 56, 100 62
           C 92 68, 82 62, 86 54
           C 90 46, 108 44, 114 50
           L 120 66
           C 122 70, 130 70, 134 62
           L 138 46
           M 124 46 L 150 46
           M 158 28 L 158 66
           M 148 46 L 172 46
           C 180 46, 188 52, 182 62
           C 176 72, 196 68, 206 60
           C 218 50, 224 58, 232 52"
        strokeWidth={2.3}
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 2.2, ease: [0.65, 0, 0.35, 1] }}
      />
      {/* Underline flourish */}
      <motion.path
        d="M 18 80 C 70 74, 150 72, 240 78 C 256 79, 264 77, 270 72"
        strokeWidth={1.6}
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.1, ease: 'easeInOut', delay: 2.2 }}
      />
      {/* Dot at the end — the little flick */}
      <motion.circle
        cx={276}
        cy={70}
        r={2}
        fill="currentColor"
        stroke="none"
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3, ease: 'easeOut', delay: 3.2 }}
      />
    </svg>
  )
}

export default function Beyond() {
  const [openPoly, setOpenPoly] = useState(null)

  return (
    <section className="relative min-h-full bg-bg">
      <div className="mx-auto max-w-6xl px-5 py-14 md:px-8 md:py-20">
        {/* Header */}
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

        {/* Favorite things — full width, single row on desktop */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewOnce}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
          }}
          className="mt-16 md:mt-20"
        >
          <div className="flex items-baseline gap-3">
            <p className="eyebrow text-muted">A few favorite things</p>
            <HandArrow className="h-4 w-8 text-muted/40" strokeWidth={1.5} />
          </div>
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 md:mt-6 md:grid-cols-4 md:gap-5">
            {interests.map((item, i) => (
              <InterestCard key={item.name} item={item} index={i} />
            ))}
          </div>
        </motion.div>

        {/* Camera roll — 6 captioned polaroids, full width */}
        <div className="mt-14 md:mt-16">
          <div className="flex items-baseline justify-between gap-4">
            <p className="eyebrow text-muted">From the camera roll</p>
            <p className="text-[11px] italic text-muted/70">tap a polaroid →</p>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 md:mt-6 md:grid-cols-6 md:gap-5">
            {polaroids.map((p, i) => (
              <PolaroidTile
                key={p.caption}
                poly={p}
                index={i}
                onOpen={() => setOpenPoly(p)}
              />
            ))}
          </div>
        </div>

        {/* Scrapbook mosaic — more from the roll */}
        <div className="relative mt-14 md:mt-16">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow text-muted">More from the roll</p>
              <p className="f-hand mt-2 text-[26px] leading-[1.1] text-ink/80 md:text-[32px]">
                a scrapbook, basically.
              </p>
            </div>
            <HandArrow className="mb-1 hidden h-6 w-12 text-terracotta/60 md:block" strokeWidth={1.8} />
          </div>

          <div
            className="mt-8 columns-2 gap-4 sm:columns-3 md:mt-10 md:gap-5 lg:columns-4"
            style={{ columnFill: 'balance' }}
          >
            {mosaic.map((p, i) => (
              <MosaicTile
                key={p.src}
                poly={p}
                index={i}
                onOpen={() => setOpenPoly(p)}
              />
            ))}
          </div>
        </div>

        {/* Signature + sign-off */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewOnce}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mt-20 flex flex-col items-start gap-4 md:mt-24"
        >
          <p className="f-hand text-[22px] leading-[1.3] text-ink/80 md:text-[24px]">
            Thanks for scrolling this far.
          </p>
          <p className="f-hand max-w-md text-[17px] leading-[1.4] text-muted md:text-[18px]">
            If you&apos;ve made it here, we probably&apos;d get along.
          </p>
          <Signature className="-ml-1 mt-2 h-20 w-[260px] text-terracotta md:h-24 md:w-[300px]" />
        </motion.div>
      </div>

      <AnimatePresence>
        {openPoly ? <Lightbox poly={openPoly} onClose={() => setOpenPoly(null)} /> : null}
      </AnimatePresence>
    </section>
  )
}
