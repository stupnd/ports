import { useEffect, useRef, useState } from 'react'
import useVisible from './useVisible'
import { prefersReducedMotion } from '../../hooks/useReducedMotion'

// Group of 5 friends voting on a trip activity — circles fill up one by one,
// consensus bar fills alongside, hits 80% and ticks over to the next activity.
// Directly visualizes Trippy's 80% consensus rule.
const ACTIVITIES = ['Snorkel tour', 'Sunrise hike', 'Night market', 'Beach day']
const GROUP_SIZE = 5
const THRESHOLD = 0.8

export default function TrippyPreview() {
  const wrapRef = useRef(null)
  const visible = useVisible(wrapRef)
  const reduced = prefersReducedMotion()
  const [activityIdx, setActivityIdx] = useState(0)
  const [votes, setVotes] = useState(() => (prefersReducedMotion() ? 4 : 0))

  useEffect(() => {
    if (reduced || !visible) return undefined
    // Stagger votes coming in, then hold, then cycle to the next activity.
    const reset = window.setTimeout(() => setVotes(0), 0)
    let count = 0
    const voter = window.setInterval(() => {
      count += 1
      if (count > 4) {
        window.clearInterval(voter)
        window.setTimeout(() => {
          setActivityIdx((a) => (a + 1) % ACTIVITIES.length)
        }, 900)
        return
      }
      setVotes(count)
    }, 320)
    return () => {
      window.clearTimeout(reset)
      window.clearInterval(voter)
    }
  }, [activityIdx, visible, reduced])

  const pct = Math.min(1, votes / GROUP_SIZE)
  const passed = pct >= THRESHOLD

  return (
    <div
      ref={wrapRef}
      className="flex h-full w-full items-center gap-3 rounded-lg bg-bg/5 p-3 ring-1 ring-bg/10"
      aria-hidden
    >
      <svg viewBox="0 0 40 48" className="h-14 w-10 shrink-0">
        {/* 5 avatar circles arranged in a friendly cluster */}
        {[
          { cx: 12, cy: 12 },
          { cx: 28, cy: 12 },
          { cx: 8, cy: 26 },
          { cx: 20, cy: 28 },
          { cx: 32, cy: 26 },
        ].map((pos, i) => {
          const voted = i < votes
          return (
            <g key={i}>
              <circle
                cx={pos.cx}
                cy={pos.cy}
                r={voted ? 6 : 5.2}
                fill={voted ? '#1A6B45' : 'rgba(255,255,255,0.08)'}
                stroke="#1A6B45"
                strokeWidth="1.2"
                opacity={voted ? 1 : 0.6}
                style={{ transition: 'r 0.28s ease, fill 0.28s ease, opacity 0.28s ease' }}
              />
              {voted ? (
                <path
                  d={`M ${pos.cx - 2.2} ${pos.cy} l 1.6 1.8 l 3.2 -3.4`}
                  stroke="#FAFAF8"
                  strokeWidth="1.3"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ) : null}
            </g>
          )
        })}
      </svg>
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div className="flex min-w-0 items-center justify-between gap-2">
          <span className="min-w-0 flex-1 truncate text-[9.5px] font-semibold uppercase tracking-[0.12em] text-bg/70">
            {ACTIVITIES[activityIdx]}
          </span>
          <span
            className="shrink-0 text-[9.5px] font-bold tabular-nums"
            style={{
              color: passed ? '#1A6B45' : 'rgba(250,250,248,0.55)',
              transition: 'color 0.3s ease',
            }}
          >
            {passed ? '✓ 80%' : `${Math.round(pct * 100)}%`}
          </span>
        </div>
        <div className="relative h-2 w-full overflow-hidden rounded-full bg-bg/10 ring-1 ring-bg/15">
          <div
            className="h-full rounded-full"
            style={{
              width: `${pct * 100}%`,
              maxWidth: '100%',
              backgroundColor: '#1A6B45',
              transition: 'width 0.32s ease',
            }}
          />
          {/* 80% threshold marker */}
          <div
            className="pointer-events-none absolute top-0 h-full w-[1.5px]"
            style={{ left: `${THRESHOLD * 100}%`, backgroundColor: 'rgba(250,250,248,0.45)' }}
          />
        </div>
      </div>
    </div>
  )
}
