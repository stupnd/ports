import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import PillTag from './PillTag'
import { HandArrow } from './Doodles'
import useReveal from '../hooks/useReveal'
import { bio } from '../data/knowledge'
import BeyondPhotos from './BeyondPhotos'
import WIE from './WIE'

const ME_PHOTO_PNG = '/photos/beyond/me2.png'
const ME_PHOTO_JPG = '/photos/beyond/me.JPG'

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
  { text: 'Ottawa, Canada' },
  { text: 'Grace Hopper Celebration — Fall 2026' },
  { text: `GPA ${bio.gpa}` },
  { text: 'B.A.Sc. Computer Engineering — Management & Entrepreneurship stream' },
  { text: 'Graduating Dec 2026' },
  { text: 'Co-op @ TrendAI, May 2026' },
  { text: 'Open to new-grad SWE / AI, Jan 2027' },
]

const cutoutImgBase =
  'mx-auto block w-full max-w-[280px] object-contain object-top md:mx-0 md:max-h-[min(72vh,540px)] md:max-w-none'

export default function About() {
  const headlineRef = useRef(null)
  const [mePhotoSrc, setMePhotoSrc] = useState(ME_PHOTO_PNG)
  const isJpgFallback = mePhotoSrc === ME_PHOTO_JPG
  useReveal(headlineRef, { stagger: 0.05, y: 30, duration: 0.75 })

  const cutoutImgClass = [
    cutoutImgBase,
    isJpgFallback
      ? 'rounded-2xl object-cover object-center shadow-[0_12px_40px_rgba(17,17,17,0.12)] ring-1 ring-ink/10'
      : 'drop-shadow-[0_8px_28px_rgba(17,17,17,0.14)]',
  ].join(' ')

  const cutoutBottomFade = {
    WebkitMaskImage:
      'linear-gradient(to bottom, #000 0%, #000 calc(100% - 3.5rem), rgba(0,0,0,0.35) calc(100% - 1.25rem), transparent 100%)',
    maskImage:
      'linear-gradient(to bottom, #000 0%, #000 calc(100% - 3.5rem), rgba(0,0,0,0.35) calc(100% - 1.25rem), transparent 100%)',
    WebkitMaskSize: '100% 100%',
    maskSize: '100% 100%',
    WebkitMaskRepeat: 'no-repeat',
    maskRepeat: 'no-repeat',
  }

  const cutoutPhoto = (extraWrapClass) => (
    <div className={extraWrapClass}>
      <div
        className={[
          'overflow-hidden',
          isJpgFallback ? 'rounded-2xl' : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <motion.img
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          src={mePhotoSrc}
          alt="Stuti Pandya"
          onError={() => setMePhotoSrc(ME_PHOTO_JPG)}
          className={cutoutImgClass}
          style={cutoutBottomFade}
          decoding="async"
        />
      </div>
      <div className="relative mt-3 flex flex-col items-center md:mt-4 md:items-start">
        <HandArrow
          stroke="currentColor"
          aria-hidden
          className="pointer-events-none -mb-1.5 h-[3.75rem] w-[5.25rem] rotate-[208deg] text-terracotta md:ml-8 md:h-16 md:w-28 md:rotate-[196deg]"
        />
        <div className="relative inline-block max-w-[18rem] -rotate-1 md:max-w-none">
          <span
            aria-hidden
            className="absolute left-1/2 top-0 z-[1] h-2 w-16 -translate-x-1/2 -translate-y-1/2 rounded-[2px] bg-terracotta/30 shadow-[0_1px_0_rgba(17,17,17,0.08)]"
          />
          <div className="relative z-[2] rounded-[2px] border border-ink/15 bg-[#fffdf6] px-4 py-2.5 shadow-[3px_4px_0_rgba(17,17,17,0.07),inset_0_1px_0_rgba(255,255,255,0.75)]">
            <p className="f-hand text-center text-[clamp(1.5rem,4.8vw,1.85rem)] leading-tight text-ink md:text-left">
              that&apos;s me
              <span className="text-terracotta"> :)</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <>
      <section className="min-h-full bg-bg">
        <div className="relative mx-auto max-w-6xl px-5 py-14 md:px-8 md:py-20">
          <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(220px,320px)] md:items-start md:gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(260px,360px)]">
            <div className="min-w-0">
              <motion.p
                initial="hidden"
                whileInView="show"
                viewport={viewOnce}
                variants={fadeUp(0)}
                className="eyebrow text-terracotta"
              >
                About
              </motion.p>

              <h2
                ref={headlineRef}
                className="f-serif mt-8 max-w-4xl text-[clamp(36px,5vw,72px)] font-bold leading-[1.2] tracking-tight text-ink"
              >
                Hi, I&apos;m Stuti. I work on hardware, software, and the glue between them.
              </h2>

              <motion.p
                initial="hidden"
                whileInView="show"
                viewport={viewOnce}
                variants={fadeUp(0.1)}
                className="mt-10 max-w-2xl text-base leading-[1.75] text-ink/85 md:text-[17px]"
              >
                Fourth-year Computer Engineering at uOttawa, graduating December 2026. Most of my
                time goes to AI and web apps, embedded class projects, and side builds that started
                as “what if.” I co-run{' '}
                <a
                  href="https://www.instagram.com/lilbytes.tech/"
                  target="_blank"
                  rel="noreferrer"
                  className="underline decoration-terracotta decoration-2 underline-offset-4 hover:text-terracotta"
                >
                  Lil Bytes
                </a>{' '}
                with Krisha: short Instagram posts that unpack CS ideas for people outside the
                lecture hall. IEEE WIE Chair this year. More on student leadership in the{' '}
                <a
                  href="#wie"
                  className="underline decoration-terracotta decoration-2 underline-offset-4 hover:text-terracotta"
                >
                  IEEE WIE section
                </a>{' '}
                below. Ottawa based. Grace Hopper this fall.
              </motion.p>

              <div className="mt-8 md:hidden">{cutoutPhoto('')}</div>

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
            </div>

            <div className="hidden min-w-0 md:block md:pt-2 lg:-mt-2 lg:pt-0">
              {cutoutPhoto('md:sticky md:top-24')}
            </div>
          </div>

          <motion.aside
            initial="hidden"
            whileInView="show"
            viewport={viewOnce}
            variants={fadeUp(0.2)}
            aria-label="Currently"
            className="relative mt-14 rounded-2xl bg-ink p-8 text-bg md:mt-16 md:p-10"
          >
            <HandArrow
              className="pointer-events-none absolute -top-20 left-6 hidden h-16 w-24 rotate-[-8deg] md:block"
              aria-hidden
            />
            <div className="flex flex-col gap-8 md:flex-row md:items-start md:gap-12">
              <div className="shrink-0">
                <p className="eyebrow text-terracotta">Currently</p>
                <p className="f-display mt-3 text-2xl font-bold leading-tight md:text-[28px]">
                  Co-ops, classes,
                  <br />
                  and campus events.
                </p>
              </div>
              <ul className="grid flex-1 grid-cols-1 gap-x-10 gap-y-3 sm:grid-cols-2">
                {currently.map((row) => (
                  <li
                    key={row.text}
                    className="flex gap-3 border-l-2 border-terracotta/50 pl-3 text-[15px] text-bg/90"
                  >
                    <span>{row.text}</span>
                  </li>
                ))}
                <li className="flex gap-3 border-l-2 border-terracotta/50 pl-3 text-[15px] text-bg/90 sm:col-span-2">
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

      <BeyondPhotos />

      <div id="wie" className="scroll-mt-6 md:scroll-mt-8">
        <WIE embedded />
      </div>
    </>
  )
}
