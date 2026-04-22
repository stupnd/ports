import { useEffect, useRef, useState } from 'react'
import useVisible from './useVisible'
import { prefersReducedMotion } from '../../hooks/useReducedMotion'

// Face silhouette on the left, skin-tone → matched palette on the right.
// Palette cycles through curated sets that loosely mirror warm/cool/neutral
// undertone families — what the real GlowMatch pipeline spits out.
const PALETTES = [
  { skin: '#C9A080', matched: ['#8B3A2E', '#B35B3A', '#D07A5A', '#E9A58A'] },
  { skin: '#7A4A2E', matched: ['#3B1A14', '#6A2A1D', '#9C4A2D', '#C87A4A'] },
  { skin: '#E8C8A8', matched: ['#B66A5A', '#D99A7A', '#F0BDA0', '#F5D6C0'] },
  { skin: '#4E2E1E', matched: ['#28110A', '#4B1F14', '#7A3824', '#A65A36'] },
]

export default function GlowMatchPreview() {
  const wrapRef = useRef(null)
  const visible = useVisible(wrapRef)
  const [index, setIndex] = useState(0)
  const reduced = prefersReducedMotion()

  useEffect(() => {
    if (reduced || !visible) return undefined
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % PALETTES.length)
    }, 1800)
    return () => window.clearInterval(id)
  }, [visible, reduced])

  const p = PALETTES[index]

  return (
    <div
      ref={wrapRef}
      className="flex h-full w-full items-center gap-3 rounded-lg bg-bg/5 p-3 ring-1 ring-bg/10"
      aria-hidden
    >
      <svg viewBox="0 0 40 48" className="h-14 w-10 shrink-0">
        <defs>
          <clipPath id="glowmatch-face">
            <path d="M20 4 C 8 4, 4 16, 4 24 C 4 36, 14 44, 20 44 C 26 44, 36 36, 36 24 C 36 16, 32 4, 20 4 Z" />
          </clipPath>
        </defs>
        <g clipPath="url(#glowmatch-face)">
          <rect x="0" y="0" width="40" height="48" fill={p.skin} style={{ transition: 'fill 0.7s ease' }} />
        </g>
        <path
          d="M20 4 C 8 4, 4 16, 4 24 C 4 36, 14 44, 20 44 C 26 44, 36 36, 36 24 C 36 16, 32 4, 20 4 Z"
          fill="none"
          stroke="rgba(255,255,255,0.35)"
          strokeWidth="1"
        />
        <path d="M12 22 q 2 -2 4 0" stroke="rgba(0,0,0,0.35)" strokeWidth="1.1" fill="none" strokeLinecap="round" />
        <path d="M24 22 q 2 -2 4 0" stroke="rgba(0,0,0,0.35)" strokeWidth="1.1" fill="none" strokeLinecap="round" />
        <path d="M16 32 q 4 2 8 0" stroke="rgba(0,0,0,0.35)" strokeWidth="1.1" fill="none" strokeLinecap="round" />
      </svg>
      <div className="flex flex-1 flex-col gap-1.5">
        <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-bg/70">
          Matched palette
        </span>
        <div className="flex gap-1.5">
          {p.matched.map((c) => (
            <span
              key={c}
              className="h-6 flex-1 rounded-md ring-1 ring-bg/15"
              style={{ backgroundColor: c, transition: 'background-color 0.7s ease' }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
