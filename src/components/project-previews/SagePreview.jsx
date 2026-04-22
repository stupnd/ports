import { useEffect, useRef, useState } from 'react'
import useVisible from './useVisible'
import { prefersReducedMotion } from '../../hooks/useReducedMotion'

// Deterministic random-walk line chart that ticks forward once a second.
// Reads as "live ticker" without needing a real data feed.
const POINTS = 28
const W = 160
const H = 56

function seeded() {
  // Keep initial series stable across first mount so it looks curated.
  return [0.4, 0.44, 0.42, 0.5, 0.48, 0.55, 0.52, 0.6, 0.58, 0.62, 0.65, 0.61, 0.66, 0.7, 0.68, 0.72, 0.75, 0.74, 0.78, 0.76, 0.81, 0.79, 0.83, 0.86, 0.84, 0.88, 0.92, 0.9]
}

function toPath(series) {
  return series
    .map((v, i) => {
      const x = (i / (POINTS - 1)) * W
      const y = H - v * (H - 6) - 3
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`
    })
    .join(' ')
}

function toArea(series) {
  return `${toPath(series)} L ${W} ${H} L 0 ${H} Z`
}

export default function SagePreview() {
  const wrapRef = useRef(null)
  const visible = useVisible(wrapRef)
  const [series, setSeries] = useState(() => seeded())
  const reduced = prefersReducedMotion()

  useEffect(() => {
    if (reduced || !visible) return undefined
    const id = window.setInterval(() => {
      setSeries((prev) => {
        const last = prev[prev.length - 1]
        const step = (Math.random() - 0.45) * 0.08
        const next = Math.max(0.15, Math.min(0.95, last + step))
        return [...prev.slice(1), next]
      })
    }, 900)
    return () => window.clearInterval(id)
  }, [visible, reduced])

  const last = series[series.length - 1]
  const first = series[0]
  const up = last >= first

  return (
    <div
      ref={wrapRef}
      className="flex h-full w-full flex-col justify-between rounded-lg bg-bg/5 p-3 ring-1 ring-bg/10"
      aria-hidden
    >
      <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.14em]">
        <span className="flex items-center gap-1.5 text-bg/70">
          <span
            className="inline-block h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: '#2A4BCC', boxShadow: '0 0 0 3px rgba(42,75,204,0.25)' }}
          />
          NVDA · LIVE
        </span>
        <span style={{ color: up ? '#4ADE80' : '#F87171' }}>
          {up ? '▲' : '▼'} {(Math.abs(last - first) * 100).toFixed(1)}%
        </span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="mt-1 h-[56px] w-full">
        <defs>
          <linearGradient id="pulse-area" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#2A4BCC" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#2A4BCC" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={toArea(series)} fill="url(#pulse-area)" />
        <path
          d={toPath(series)}
          fill="none"
          stroke="#2A4BCC"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}
