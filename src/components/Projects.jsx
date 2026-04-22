import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Squiggle from './Squiggle'
import { gsap } from '../lib/scroll'
import { prefersReducedMotion } from '../hooks/useReducedMotion'
import { projects as projectData } from '../data/knowledge'
import ProjectPreview from './project-previews'

const ProjectCaseStudy = lazy(() => import('./ProjectCaseStudy'))

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

function ProjectCard({ project, index, featured = false, onOpen }) {
  const { id, title, blurb, stack, github, live, accent, tagline } = project
  const a = ACCENTS[accent]
  const cardRef = useRef(null)

  useEffect(() => {
    if (prefersReducedMotion()) return undefined
    const el = cardRef.current
    if (!el) return undefined
    const scrollerEl = document.querySelector('#tab-panel')

    gsap.set(el, {
      clipPath: 'inset(0 100% 0 0)',
      opacity: 0,
      y: 30,
    })
    const tween = gsap.to(el, {
      clipPath: 'inset(0 0% 0 0)',
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: 'power3.out',
      delay: index * 0.05,
      scrollTrigger: {
        trigger: el,
        scroller: scrollerEl || undefined,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      },
    })
    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [index])

  return (
    <motion.article
      ref={cardRef}
      layoutId={`project-card-${id}`}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
      onClick={() => onOpen(project)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onOpen(project)
        }
      }}
      data-cursor="view"
      className={`group relative flex cursor-pointer flex-col justify-between overflow-hidden rounded-xl bg-ink-card p-7 shadow-[0_1px_0_rgba(0,0,0,0.4)] transition-shadow duration-200 hover:shadow-[0_24px_60px_-24px_rgba(0,0,0,0.6)] md:p-9 ${
        featured ? 'min-h-[320px] md:min-h-[360px]' : 'min-h-[260px]'
      }`}
    >
      <motion.span
        layoutId={`project-bar-${id}`}
        className={`absolute inset-x-0 top-0 h-1 ${a.bar}`}
        aria-hidden
      />

      <div className="relative flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <motion.h3
            layoutId={`project-title-${id}`}
            className={`f-display font-bold tracking-tight text-bg ${
              featured ? 'text-4xl md:text-[3.25rem]' : 'text-3xl md:text-4xl'
            }`}
          >
            {title}
          </motion.h3>
          {tagline ? (
            <p className="mt-2 text-[13px] font-medium uppercase tracking-[0.14em] text-bg/55">
              {tagline}
            </p>
          ) : null}
          <p className="mt-4 max-w-prose text-[15px] leading-relaxed text-bg/75 md:text-base">
            {blurb}
          </p>
        </div>
        <div
          className={`relative hidden shrink-0 transition-all duration-300 md:block ${
            featured ? 'w-[220px]' : 'w-[180px]'
          }`}
          style={{ height: featured ? 88 : 78 }}
        >
          <div className="absolute inset-0 opacity-80 transition-opacity duration-300 group-hover:opacity-100">
            <ProjectPreview id={id} />
          </div>
        </div>
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

        <div className="flex flex-wrap items-center gap-5 text-sm font-semibold">
          <span
            className={`inline-flex items-center gap-1 rounded-full bg-bg/0 px-3 py-1.5 text-[12px] font-semibold uppercase tracking-[0.12em] text-bg/75 ring-1 ring-bg/20 transition-all group-hover:bg-bg group-hover:text-ink`}
          >
            Case study
            <span
              aria-hidden
              className="inline-block -translate-x-0.5 transition-transform duration-200 ease-out group-hover:translate-x-0.5"
            >
              →
            </span>
          </span>
          <a
            href={github}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            data-cursor="open"
            className={`group/link inline-flex items-center gap-1 text-bg/80 underline decoration-bg/25 decoration-2 underline-offset-[6px] transition-colors ${a.link}`}
          >
            GitHub
            <span
              aria-hidden
              className="inline-block -translate-x-1 opacity-0 transition-all duration-200 ease-out group-hover/link:translate-x-0.5 group-hover/link:opacity-100"
            >
              →
            </span>
          </a>
          {live ? (
            <a
              href={live}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              data-cursor="open"
              className={`group/link inline-flex items-center gap-1 text-bg/80 underline decoration-bg/25 decoration-2 underline-offset-[6px] transition-colors ${a.link}`}
            >
              Live
              <span
                aria-hidden
                className="inline-block -translate-x-1 opacity-0 transition-all duration-200 ease-out group-hover/link:translate-x-0.5 group-hover/link:opacity-100"
              >
                →
              </span>
            </a>
          ) : null}
        </div>
      </div>
    </motion.article>
  )
}

export default function Projects() {
  const [openId, setOpenId] = useState(null)

  // Command palette can request a specific project via this event.
  useEffect(() => {
    const onOpenProject = (e) => {
      const id = e?.detail
      if (id && projectData.some((p) => p.id === id)) setOpenId(id)
    }
    window.addEventListener('portfolio:open-project', onOpenProject)
    return () => window.removeEventListener('portfolio:open-project', onOpenProject)
  }, [])

  // Reset scroll when switching between grid and detail.
  useEffect(() => {
    const el = document.getElementById('tab-panel')
    if (el) el.scrollTop = 0
  }, [openId])

  const activeProject = projectData.find((p) => p.id === openId)

  const [featured, ...rest] = projectData

  return (
    <AnimatePresence mode="wait" initial={false}>
      {activeProject ? (
        <Suspense fallback={null} key="detail">
          <ProjectCaseStudy project={activeProject} onBack={() => setOpenId(null)} />
        </Suspense>
      ) : (
        <motion.section
          key="grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="min-h-full bg-bg text-ink"
        >
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
              className="f-serif mt-6 max-w-3xl text-[clamp(36px,5vw,72px)] font-bold leading-[1.15] tracking-tight text-ink"
            >
              Selected{' '}
              <span className="relative inline-block">
                work
                <Squiggle className="pointer-events-none absolute -bottom-1 left-0 w-full md:-bottom-2" />
              </span>
            </motion.h2>

            <p className="mt-5 max-w-xl text-sm text-muted md:text-[15px]">
              Open a card for context, tradeoffs, and numbers. GitHub and demos are linked on each
              tile.
            </p>

            <div className="mt-12 space-y-6 md:mt-14 md:space-y-8">
              <ProjectCard project={featured} index={0} featured onOpen={(p) => setOpenId(p.id)} />
              <div className="grid gap-6 md:grid-cols-2 md:gap-8">
                {rest.map((p, i) => (
                  <ProjectCard
                    key={p.id}
                    project={p}
                    index={i + 1}
                    onOpen={(pr) => setOpenId(pr.id)}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  )
}
