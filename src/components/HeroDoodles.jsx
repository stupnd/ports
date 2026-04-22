import { motion } from 'framer-motion'
import {
  HandStar,
  WavyUnderline,
  HandCircle,
  HandArrow,
  HandBracket,
} from './Doodles'
import useReducedMotion from '../hooks/useReducedMotion'

// Scattered hand-drawn doodles used as the mobile hero backdrop instead of the
// heavy physics orbs (which feel squished on small screens). Each doodle gets a
// gentle infinite float + wiggle animation on different durations so the whole
// composition feels alive without being busy.
const DOODLES = [
  {
    Comp: HandStar,
    color: '#E8521A',
    style: { top: '3%', left: '6%', width: 36, height: 36 },
    rotate: -12,
    wiggle: 10,
    floatY: -8,
    duration: 5.2,
    delay: 0.0,
  },
  {
    Comp: WavyUnderline,
    color: '#2A4BCC',
    style: { top: '5%', right: '6%', width: 96, height: 16 },
    rotate: -6,
    wiggle: 4,
    floatY: -6,
    duration: 6.4,
    delay: 0.4,
  },
  {
    Comp: HandCircle,
    color: '#1A6B45',
    style: { top: '28%', right: '4%', width: 62, height: 42 },
    rotate: 8,
    wiggle: -6,
    floatY: 10,
    duration: 6.8,
    delay: 0.8,
  },
  {
    Comp: HandStar,
    color: '#F0C93A',
    style: { bottom: '28%', left: '8%', width: 28, height: 28 },
    rotate: 18,
    wiggle: 14,
    floatY: -10,
    duration: 4.8,
    delay: 0.2,
  },
  {
    Comp: HandArrow,
    color: '#F15BB5',
    style: { bottom: '32%', right: '10%', width: 78, height: 54 },
    rotate: -14,
    wiggle: 6,
    floatY: 8,
    duration: 5.8,
    delay: 0.6,
  },
  {
    Comp: HandBracket,
    color: '#9B5DE5',
    style: { bottom: '12%', left: '10%', width: 120, height: 18 },
    rotate: -4,
    wiggle: 3,
    floatY: -6,
    duration: 6.0,
    delay: 1.0,
  },
  {
    Comp: HandStar,
    color: '#F7A68A',
    style: { bottom: '14%', right: '8%', width: 22, height: 22 },
    rotate: 22,
    wiggle: -18,
    floatY: -9,
    duration: 5.0,
    delay: 1.2,
  },
  {
    Comp: WavyUnderline,
    color: '#E8521A',
    style: { top: '42%', left: '4%', width: 68, height: 14 },
    rotate: 12,
    wiggle: -4,
    floatY: 6,
    duration: 6.6,
    delay: 1.4,
  },
  {
    Comp: HandStar,
    color: '#2A4BCC',
    style: { top: '18%', right: '30%', width: 18, height: 18 },
    rotate: 8,
    wiggle: 24,
    floatY: -5,
    duration: 4.2,
    delay: 0.9,
  },
  {
    Comp: HandArrow,
    color: '#1A6B45',
    style: { top: '52%', left: '28%', width: 56, height: 40 },
    rotate: 28,
    wiggle: -8,
    floatY: 7,
    duration: 6.2,
    delay: 1.6,
  },
  {
    Comp: HandStar,
    color: '#9B5DE5',
    style: { top: '62%', right: '18%', width: 20, height: 20 },
    rotate: -18,
    wiggle: 28,
    floatY: -7,
    duration: 4.6,
    delay: 1.8,
  },
  {
    Comp: WavyUnderline,
    color: '#F0C93A',
    style: { bottom: '22%', right: '28%', width: 72, height: 14 },
    rotate: -10,
    wiggle: 6,
    floatY: 5,
    duration: 5.6,
    delay: 2.0,
  },
  {
    Comp: HandCircle,
    color: '#F15BB5',
    style: { top: '10%', left: '34%', width: 52, height: 34 },
    rotate: -14,
    wiggle: 4,
    floatY: -6,
    duration: 7.2,
    delay: 0.3,
  },
]

export default function HeroDoodles() {
  const reduced = useReducedMotion()
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      {DOODLES.map((d, i) => {
        const { Comp } = d
        const animate = reduced
          ? { opacity: 1, y: 0, rotate: d.rotate }
          : {
              opacity: 1,
              y: [0, d.floatY, 0],
              rotate: [d.rotate, d.rotate + d.wiggle, d.rotate],
            }
        const transition = reduced
          ? { duration: 0.4, ease: 'easeOut' }
          : {
              duration: d.duration,
              delay: d.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }
        return (
          <motion.div
            key={i}
            className="absolute"
            style={d.style}
            initial={{ opacity: 0, y: 8, rotate: d.rotate }}
            animate={animate}
            transition={transition}
          >
            <Comp
              stroke={d.color}
              strokeWidth={2}
              className="h-full w-full"
            />
          </motion.div>
        )
      })}
    </div>
  )
}
