import { useEffect, useRef, useState } from 'react'
import useVisible from './useVisible'
import { prefersReducedMotion } from '../../hooks/useReducedMotion'

// Five-finger glove silhouette with sensor dots that pulse, and a text-output
// row that types out sample ASL translations letter by letter.
const PHRASES = ['HELLO', 'THANK YOU', 'YES', 'MORE']

export default function BridgePreview() {
  const wrapRef = useRef(null)
  const visible = useVisible(wrapRef)
  const reduced = prefersReducedMotion()
  const [phraseIdx, setPhraseIdx] = useState(0)
  // When reduced motion is set, we jump straight to the fully-typed phrase.
  const [charCount, setCharCount] = useState(() =>
    prefersReducedMotion() ? PHRASES[0].length : 0
  )
  const [pulseTick, setPulseTick] = useState(0)

  useEffect(() => {
    if (reduced || !visible) return undefined
    const t = window.setInterval(() => setPulseTick((n) => n + 1), 220)
    return () => window.clearInterval(t)
  }, [visible, reduced])

  useEffect(() => {
    if (reduced || !visible) return undefined
    let i = 0
    const phrase = PHRASES[phraseIdx]
    // Reset scheduled, not synchronous — avoids cascading render warning.
    const reset = window.setTimeout(() => setCharCount(0), 0)
    const typer = window.setInterval(() => {
      i += 1
      if (i > phrase.length) {
        window.clearInterval(typer)
        window.setTimeout(() => setPhraseIdx((p) => (p + 1) % PHRASES.length), 900)
        return
      }
      setCharCount(i)
    }, 120)
    return () => {
      window.clearTimeout(reset)
      window.clearInterval(typer)
    }
  }, [phraseIdx, visible, reduced])

  // Sensor pulse pattern — five fingers light up in sequence.
  const activeDot = reduced ? -1 : pulseTick % 5

  return (
    <div
      ref={wrapRef}
      className="flex h-full w-full items-center gap-3 rounded-lg bg-bg/5 p-3 ring-1 ring-bg/10"
      aria-hidden
    >
      <svg viewBox="0 0 48 52" className="h-14 w-12 shrink-0">
        <path
          d="M10 22 L10 10 q 0 -3 3 -3 q 3 0 3 3 L16 22
             M16 22 L16 6 q 0 -3 3 -3 q 3 0 3 3 L22 22
             M22 22 L22 4 q 0 -3 3 -3 q 3 0 3 3 L28 22
             M28 22 L28 8 q 0 -3 3 -3 q 3 0 3 3 L34 22
             M34 22 L34 14 q 0 -3 3 -3 q 3 0 3 3 L40 22"
          stroke="#F0C93A"
          strokeWidth="1.3"
          strokeLinecap="round"
          fill="none"
          opacity="0.7"
        />
        <path
          d="M8 22 q 0 -2 2 -2 L38 20 q 2 0 2 2 L40 38 q 0 4 -4 4 L12 42 q -4 0 -4 -4 Z"
          fill="none"
          stroke="#F0C93A"
          strokeWidth="1.3"
        />
        {[0, 1, 2, 3, 4].map((i) => (
          <circle
            key={i}
            cx={13 + i * 6}
            cy={7 + (i === 2 ? -2 : i === 0 || i === 4 ? 4 : 0)}
            r={activeDot === i ? 2.2 : 1.4}
            fill="#F0C93A"
            opacity={activeDot === i ? 1 : 0.45}
            style={{ transition: 'r 0.22s ease, opacity 0.22s ease' }}
          />
        ))}
        <circle cx="24" cy="32" r="2" fill="#F0C93A" opacity="0.7" />
      </svg>
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-bg/70">
          ASL → text
        </span>
        <div className="flex h-7 min-w-0 items-center overflow-hidden rounded-md bg-bg/10 px-2 ring-1 ring-bg/15">
          <span className="f-display truncate text-[12.5px] font-bold tracking-[0.06em] text-sun">
            {PHRASES[phraseIdx].slice(0, charCount)}
            <span className="ml-0.5 inline-block h-2.5 w-[2px] translate-y-0.5 bg-sun/70 align-middle" />
          </span>
        </div>
      </div>
    </div>
  )
}
