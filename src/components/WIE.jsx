import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { gsap, ScrollTrigger } from '../lib/scroll'
import { prefersReducedMotion } from '../hooks/useReducedMotion'

const PALETTE = {
  bg: '#1A0A2E',
  surface: '#2D1B4E',
  accent: '#9B5DE5',
  pink: '#F15BB5',
  gold: '#F0C93A',
  text: '#F8F4FF',
  muted: '#B8A9D4',
}

const stats = [
  { number: '600+', label: 'Students reached', color: PALETTE.gold, countTo: 600, suffix: '+' },
  { number: '1st', label: 'WIEee Code', color: PALETTE.pink },
  { number: 'Vice Chair', label: '2025–2026', color: PALETTE.accent },
  { number: 'Chair', label: '2026–2027', color: PALETTE.pink },
]

const initiatives = [
  {
    icon: '✦',
    title: 'WIEee Code',
    line: 'Organized WIEee Code, a beginner-friendly one-day coding event featuring hands-on workshops in React, Git, and Docker. 100+ students. One chaotic, amazing day.',
    accent: PALETTE.pink,
  },
  {
    icon: '◆',
    title: 'Technical Workshops',
    line: 'Led hands-on workshops on Git, React, and Docker. Made them actually useful, not just slides.',
    accent: PALETTE.accent,
  },
  {
    icon: '★',
    title: 'Mentorship Program',
    line: 'Paired upper-year students with first- and second-years navigating engineering. Real connections, not spreadsheets.',
    accent: PALETTE.gold,
  },
]

function ClusterPolaroid({
  src,
  alt,
  top,
  left,
  width,
  rotate,
  zIndex,
  aspectRatio = '4 / 3',
  objectPosition = 'center top',
}) {
  return (
    <div
      className="group absolute cursor-pointer bg-white transition-transform duration-200 ease-out hover:z-50"
      style={{
        top,
        left,
        width,
        zIndex,
        padding: '10px 10px 36px 10px',
        borderRadius: '4px',
        boxShadow:
          '0 18px 40px -12px rgba(0,0,0,0.55), 0 4px 16px rgba(0,0,0,0.35)',
        transform: `rotate(${rotate}deg)`,
        transformOrigin: 'center',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = `rotate(${rotate}deg) scale(1.05)`
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = `rotate(${rotate}deg)`
      }}
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className="block w-full"
        style={{
          aspectRatio,
          objectFit: 'cover',
          objectPosition,
          borderRadius: '2px',
        }}
      />
    </div>
  )
}

function PhotoCluster() {
  return (
    <div className="relative hidden md:block" style={{ width: '420px', height: '520px' }}>
      <ClusterPolaroid
        src="/photos/wie/wie-photobooth-strip.JPG"
        alt="Wine & Cheese photobooth strip"
        top="0"
        left="0"
        width="200px"
        rotate={-4}
        zIndex={3}
        aspectRatio="3 / 4"
        objectPosition="center"
      />
      <ClusterPolaroid
        src="/photos/wie/wie-team-stage.JPG"
        alt="WIE team on stage"
        top="60px"
        left="180px"
        width="220px"
        rotate={3}
        zIndex={2}
      />
      <ClusterPolaroid
        src="/photos/wie/wie-welcome-full.JPG"
        alt="WIE welcome night 2024"
        top="260px"
        left="20px"
        width="200px"
        rotate={-2}
        zIndex={4}
      />
      <ClusterPolaroid
        src="/photos/wie/wie-gala-group.JPG"
        alt="WIE gala 2025"
        top="300px"
        left="210px"
        width="190px"
        rotate={4}
        zIndex={1}
      />
    </div>
  )
}

function StatPill({ stat }) {
  const numRef = useRef(null)

  useEffect(() => {
    if (!stat.countTo) return undefined
    if (prefersReducedMotion()) return undefined
    const el = numRef.current
    if (!el) return undefined

    const scrollerEl = document.querySelector('#tab-panel')
    const counter = { val: 0 }
    const tween = gsap.to(counter, {
      val: stat.countTo,
      duration: 1.4,
      ease: 'power2.out',
      onUpdate: () => {
        el.textContent = `${Math.round(counter.val)}${stat.suffix || ''}`
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
  }, [stat])

  return (
    <li
      className="inline-flex items-center gap-3 rounded-full px-5 py-2.5"
      style={{
        background: PALETTE.surface,
        border: `1px solid ${PALETTE.accent}55`,
      }}
    >
      <span
        ref={numRef}
        className="f-display text-lg font-bold tracking-tight tabular-nums"
        style={{ color: stat.color }}
      >
        {stat.countTo ? `0${stat.suffix || ''}` : stat.number}
      </span>
      <span className="text-[13px] font-medium" style={{ color: PALETTE.muted }}>
        {stat.label}
      </span>
    </li>
  )
}

function InitiativeCard({ item, index }) {
  return (
    <motion.article
      initial={{ y: 24, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.55, ease: 'easeOut', delay: index * 0.08 }}
      className="relative flex flex-col gap-3 overflow-hidden rounded-2xl p-7"
      style={{
        background: PALETTE.surface,
        border: `1px solid ${PALETTE.accent}40`,
      }}
    >
      <span
        className="absolute inset-x-0 top-0 h-1"
        style={{ background: item.accent }}
        aria-hidden
      />
      <span
        className="f-display text-2xl"
        style={{ color: item.accent }}
        aria-hidden
      >
        {item.icon}
      </span>
      <h3
        className="f-display text-xl font-bold tracking-tight"
        style={{ color: PALETTE.text }}
      >
        {item.title}
      </h3>
      <p className="text-[15px] leading-relaxed" style={{ color: PALETTE.muted }}>
        {item.line}
      </p>
    </motion.article>
  )
}

function GalleryPhoto({ src, alt, minHeight = 280 }) {
  return (
    <div
      className="group overflow-hidden rounded-xl transition-all duration-300 ease-out"
      style={{ border: `1px solid ${PALETTE.accent}33`, marginBottom: 20 }}
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className="block w-full transition-transform duration-500 ease-out group-hover:scale-[1.03]"
        style={{
          minHeight,
          height: minHeight,
          objectFit: 'cover',
          objectPosition: 'center top',
        }}
      />
    </div>
  )
}

export default function WIE() {
  return (
    <section
      className="min-h-full"
      style={{ background: PALETTE.bg, color: PALETTE.text }}
    >
      {/* Hero */}
      <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
        <div className="grid gap-14 md:grid-cols-[1.05fr_1fr] md:items-start md:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <p
              className="eyebrow"
              style={{ color: PALETTE.accent, letterSpacing: '0.18em' }}
            >
              IEEE Women in Engineering · uOttawa
            </p>
            <h1
              className="f-serif mt-8 text-[clamp(36px,5.5vw,68px)] font-bold leading-[1.1] tracking-tight"
              style={{ color: PALETTE.text }}
            >
              Building community, one{' '}
              <span style={{ color: PALETTE.accent }}>workshop</span> at a time.
            </h1>
            <p
              className="mt-8 max-w-xl text-[16px] leading-[1.75]"
              style={{ color: PALETTE.muted }}
            >
              I served as Vice Chair (2024–25) and Chair (2025–26) of IEEE WIE at
              the University of Ottawa — one of the most active student branches
              on campus. We ran hackathons, technical workshops, mentorship
              programs, and brought together 100+ students who just needed a room
              where they belonged.
            </p>
            <ul className="mt-10 flex flex-wrap gap-3">
              {stats.map((s) => (
                <StatPill key={s.label} stat={s} />
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.15 }}
            className="flex justify-center md:justify-end"
          >
            <PhotoCluster />
          </motion.div>
        </div>
      </div>

      {/* What we built */}
      <div className="mx-auto max-w-6xl px-5 pb-8 md:px-8 md:pb-16">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="eyebrow"
          style={{ color: PALETTE.accent, letterSpacing: '0.18em' }}
        >
          What we built
        </motion.p>
        <div className="mt-8 grid gap-6 md:mt-10 md:grid-cols-3 md:gap-7">
          {initiatives.map((item, i) => (
            <InitiativeCard key={item.title} item={item} index={i} />
          ))}
        </div>
      </div>

      {/* Closing quote — above gallery */}
      <div className="mx-auto max-w-4xl px-5 py-20 text-center md:px-8 md:py-28">
        <div
          className="h-px w-full"
          style={{ background: `${PALETTE.accent}55` }}
          aria-hidden
        />
        <motion.blockquote
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="f-serif my-10 text-[clamp(28px,3.6vw,48px)] font-bold leading-[1.25] tracking-tight"
          style={{ color: PALETTE.text }}
        >
          “Engineering is better when everyone has a seat at the table.”
        </motion.blockquote>
        <p
          className="text-sm font-medium tracking-wide"
          style={{ color: PALETTE.muted }}
        >
          — IEEE WIE uOttawa, 2024–2026
        </p>
        <div
          className="mt-10 h-px w-full"
          style={{ background: `${PALETTE.accent}55` }}
          aria-hidden
        />
      </div>

      {/* The moments */}
      <div className="mx-auto max-w-6xl px-5 pb-24 md:px-8 md:pb-32">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="eyebrow"
          style={{ color: PALETTE.accent, letterSpacing: '0.18em' }}
        >
          The moments
        </motion.p>

        <div className="mt-10 grid gap-5 md:grid-cols-[40fr_30fr_30fr] md:gap-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
          >
            <GalleryPhoto
              src="/photos/wie/wie-team-stage.JPG"
              alt="WIE team on stage at Wine & Cheese"
              minHeight={520}
            />
            <GalleryPhoto
              src="/photos/wie/wie-welcome-full.JPG"
              alt="WIE welcome night with balloons"
              minHeight={320}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, ease: 'easeOut', delay: 0.12 }}
          >
            <GalleryPhoto
              src="/photos/wie/wie-welcome-group.JPG"
              alt="WIE welcome night group"
              minHeight={280}
            />
            <GalleryPhoto
              src="/photos/wie/wie-dinner-table.JPG"
              alt="Dinner after the hackathon"
              minHeight={280}
            />
            <GalleryPhoto
              src="/photos/wie/wie-gala-group.JPG"
              alt="WIE gala 2025"
              minHeight={280}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, ease: 'easeOut', delay: 0.24 }}
          >
            <GalleryPhoto
              src="/photos/wie/wie-photobooth-friends.JPG"
              alt="Four friends at gold curtain photobooth"
              minHeight={300}
            />
            <GalleryPhoto
              src="/photos/wie/wie-big-group-gala.JPG"
              alt="WIE gala large group shot"
              minHeight={300}
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
