import { motion } from 'framer-motion'
import useReducedMotion from '../hooks/useReducedMotion'

// Mobile hero ambient background — three oversized, heavily-blurred color
// washes (terracotta, cobalt, sun) that slowly drift across the viewport on
// different loops. Calm, atmospheric, very not-messy. The name card reads as
// a crisp sticker sitting on top of soft aurora-like color.
const BLOBS = [
  {
    color: 'rgba(232,82,26,0.55)',
    size: 360,
    top: '18%',
    left: '-18%',
    dx: 60,
    dy: 40,
    dur: 14,
    delay: 0,
  },
  {
    color: 'rgba(42,75,204,0.42)',
    size: 320,
    top: '54%',
    left: '58%',
    dx: -70,
    dy: -55,
    dur: 17,
    delay: 1.4,
  },
  {
    color: 'rgba(240,201,58,0.45)',
    size: 280,
    top: '72%',
    left: '-10%',
    dx: 80,
    dy: -45,
    dur: 16,
    delay: 0.8,
  },
]

export default function HeroDoodles() {
  const reduced = useReducedMotion()
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden
    >
      {BLOBS.map((b, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            top: b.top,
            left: b.left,
            width: b.size,
            height: b.size,
            background: `radial-gradient(circle at 35% 35%, ${b.color}, transparent 70%)`,
            filter: 'blur(40px)',
          }}
          animate={
            reduced
              ? { x: 0, y: 0, scale: 1 }
              : {
                  x: [0, b.dx, 0, -b.dx * 0.6, 0],
                  y: [0, b.dy, b.dy * 0.4, -b.dy * 0.3, 0],
                  scale: [1, 1.08, 0.96, 1.04, 1],
                }
          }
          transition={
            reduced
              ? { duration: 0.4 }
              : {
                  duration: b.dur,
                  delay: b.delay,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }
          }
        />
      ))}
    </div>
  )
}
