import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { gsap, ScrollTrigger } from '../lib/scroll'
import { prefersReducedMotion } from '../hooks/useReducedMotion'

const stats = [
  { number: '600+', label: 'Students reached', colorClass: 'text-sun', countTo: 600, suffix: '+' },
  { number: '1st', label: 'WIEee Code hackathon', colorClass: 'text-wie-pink' },
  { number: 'Vice Chair', label: '2025–2026', colorClass: 'text-wie-accent' },
  { number: 'Chair', label: '2026–2027', colorClass: 'text-wie-pink' },
]

const initiatives = [
  {
    icon: '✦',
    title: 'WIEee Code',
    line: 'One-day beginner event with React, Git, and Docker workshops. 100+ students showed up.',
    barClass: 'bg-wie-pink',
    iconClass: 'text-wie-pink',
  },
  {
    icon: '◆',
    title: 'Technical Workshops',
    line: 'Hands-on Git, React, and Docker sessions with live coding, not slide-only blocks.',
    barClass: 'bg-wie-accent',
    iconClass: 'text-wie-accent',
  },
  {
    icon: '★',
    title: 'Mentorship Program',
    line: 'Matched upper-years with first- and second-years for one-on-one check-ins and study help.',
    barClass: 'bg-sun',
    iconClass: 'text-amber-800',
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
      className="group absolute cursor-pointer rounded bg-white shadow-[0_18px_40px_-12px_rgba(0,0,0,0.55),0_4px_16px_rgba(0,0,0,0.35)] transition-transform duration-200 ease-out hover:z-50"
      style={{
        top,
        left,
        width,
        zIndex,
        padding: '10px 10px 36px 10px',
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
        className="block w-full rounded-[2px]"
        style={{
          aspectRatio,
          objectFit: 'cover',
          objectPosition,
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
    <li className="inline-flex items-center gap-3 rounded-full border border-wie-accent/50 bg-card px-5 py-2.5 shadow-sm shadow-wie-accent/10 ring-1 ring-wie-accent/15">
      <span
        ref={numRef}
        className={`f-display text-lg font-bold tracking-tight tabular-nums ${stat.colorClass}`}
      >
        {stat.countTo ? `0${stat.suffix || ''}` : stat.number}
      </span>
      <span className="text-[13px] font-semibold text-ink/80">{stat.label}</span>
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
      className="relative flex flex-col gap-3 overflow-hidden rounded-2xl border border-wie-accent/45 bg-gradient-to-b from-[#f7f2ff] to-card p-7 shadow-md shadow-wie-accent/10 ring-1 ring-wie-accent/20"
    >
      <span className={`absolute inset-x-0 top-0 h-1.5 ${item.barClass}`} aria-hidden />
      <span className={`f-display text-2xl ${item.iconClass}`} aria-hidden>
        {item.icon}
      </span>
      <h3 className="f-display text-xl font-bold tracking-tight text-ink">{item.title}</h3>
      <p className="text-[15px] font-medium leading-relaxed text-ink/80">{item.line}</p>
    </motion.article>
  )
}

function GalleryPhoto({ src, alt, minHeight = 280 }) {
  return (
    <div className="group mb-5 overflow-hidden rounded-xl border border-wie-accent/30 shadow-sm ring-1 ring-wie-accent/15 transition-all duration-300 ease-out hover:border-wie-accent/45 hover:ring-wie-accent/25">
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
    <section className="min-h-full bg-bg text-ink">
      <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
        <div className="grid gap-14 md:grid-cols-[1.05fr_1fr] md:items-start md:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <p className="eyebrow font-semibold tracking-[0.18em] text-wie-accent">
              IEEE Women in Engineering · uOttawa
            </p>
            <h1 className="f-serif mt-8 text-[clamp(36px,5.5vw,68px)] font-bold leading-[1.1] tracking-tight text-ink">
              Building community, one{' '}
              <span className="font-extrabold text-wie-accent">workshop</span> at a time.
            </h1>
            <p className="mt-8 max-w-xl text-[16px] font-medium leading-[1.75] text-ink/80">
              I served as Vice Chair (2024–25) and Chair (2025–26) of IEEE WIE at the University of
              Ottawa, one of the busier IEEE student groups on campus. We ran hackathons, technical
              workshops, mentorship nights, and events that routinely drew 100+ students.
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

      <div className="mx-auto max-w-6xl px-5 pb-8 md:px-8 md:pb-16">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="eyebrow font-semibold tracking-[0.18em] text-wie-accent"
        >
          What we built
        </motion.p>
        <div className="mt-8 grid gap-6 md:mt-10 md:grid-cols-3 md:gap-7">
          {initiatives.map((item, i) => (
            <InitiativeCard key={item.title} item={item} index={i} />
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-5 py-20 text-center md:px-8 md:py-28">
        <div className="h-px w-full bg-wie-accent/50" aria-hidden />
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="f-serif my-12 text-[clamp(28px,3.6vw,48px)] font-bold leading-[1.25] tracking-tight text-ink"
        >
          Engineering is better when everyone has a seat at the table.
        </motion.p>
        <div className="mt-10 h-px w-full bg-wie-accent/50" aria-hidden />
      </div>

      <div className="mx-auto max-w-6xl px-5 pb-24 md:px-8 md:pb-32">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="eyebrow font-semibold tracking-[0.18em] text-wie-accent"
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
