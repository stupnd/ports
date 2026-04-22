import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

// "Now building" strip under the AskMe chat on Home. Pulls public GitHub
// activity for stuti and renders three most-recent commit messages plus a
// mini contribution heatmap. Degrades to a static placeholder if the
// /api/github function is unavailable (e.g. dev without `vercel dev`).

const FALLBACK_HEATMAP = (() => {
  // Deterministic placeholder grid so the strip has shape even offline.
  const weeks = 18
  const grid = []
  for (let w = 0; w < weeks; w++) {
    const col = []
    for (let d = 0; d < 7; d++) {
      const seed = (w * 7 + d) % 13
      col.push(seed < 3 ? 0 : seed < 6 ? 1 : seed < 9 ? 2 : seed < 11 ? 3 : 4)
    }
    grid.push(col)
  }
  return grid
})()

const LEVEL_COLORS = [
  'rgba(232, 82, 26, 0.12)',
  'rgba(232, 82, 26, 0.32)',
  'rgba(232, 82, 26, 0.55)',
  'rgba(232, 82, 26, 0.78)',
  'rgba(232, 82, 26, 1)',
]

function Heatmap({ grid, animated }) {
  // Trim to the most recent ~18 weeks so the strip stays compact.
  const weeks = grid.slice(-18)
  return (
    <div
      className="flex gap-[3px]"
      role="img"
      aria-label="GitHub contribution heatmap"
    >
      {weeks.map((col, wi) => (
        <div key={wi} className="flex flex-col gap-[3px]">
          {col.map((lvl, di) => {
            const empty = lvl < 0
            const color = empty ? 'transparent' : LEVEL_COLORS[lvl] || LEVEL_COLORS[0]
            return (
              <motion.span
                key={di}
                initial={animated ? { opacity: 0, scale: 0.4 } : false}
                animate={{ opacity: empty ? 0 : 1, scale: 1 }}
                transition={{
                  duration: 0.3,
                  ease: 'easeOut',
                  delay: animated ? (wi * 7 + di) * 0.004 : 0,
                }}
                className="block h-2 w-2 rounded-[2px] ring-1 ring-ink/5"
                style={{ backgroundColor: color }}
              />
            )
          })}
        </div>
      ))}
    </div>
  )
}

function usePortfolioGithub() {
  const [state, setState] = useState({ status: 'loading', data: null })

  useEffect(() => {
    let cancelled = false
    const controller = new AbortController()

    ;(async () => {
      try {
        const res = await fetch('/api/github', { signal: controller.signal })
        if (!res.ok) throw new Error('bad_status')
        const json = await res.json()
        if (!cancelled) setState({ status: 'ok', data: json })
      } catch {
        if (!cancelled) setState({ status: 'fallback', data: null })
      }
    })()

    return () => {
      cancelled = true
      controller.abort()
    }
  }, [])

  return state
}

export default function NowBuilding() {
  const { status, data } = usePortfolioGithub()

  const commits =
    status === 'ok' && data?.commits?.length
      ? data.commits
      : [
          {
            repo: 'stupnd/portfolio',
            message: 'polish: shader gradient, command palette, case studies',
            when: 'just now',
            sha: 'deadbee',
            url: 'https://github.com/stupnd',
          },
          {
            repo: 'stupnd/sage',
            message: 'stream Anthropic responses through FastAPI BFF',
            when: '2d ago',
            sha: 'cafebab',
            url: 'https://github.com/stupnd/sage',
          },
          {
            repo: 'stupnd/Bridge',
            message: 'tune on-device classifier for lower latency',
            when: '5d ago',
            sha: 'faceoff',
            url: 'https://github.com/stupnd/Bridge',
          },
        ]
  const heatmap = (status === 'ok' && data?.contributions) || FALLBACK_HEATMAP

  return (
    <section
      aria-label="Now building"
      className="mt-10 overflow-hidden rounded-2xl bg-card/70 p-5 ring-1 ring-ink/10 md:p-6"
    >
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <span
            className="relative inline-flex h-2 w-2 items-center justify-center rounded-full bg-terracotta"
            aria-hidden
          >
            <span className="absolute inset-0 animate-ping rounded-full bg-terracotta/60" />
          </span>
          <p className="eyebrow text-terracotta">Now building</p>
          <span className="text-[11px] text-muted">
            live from{' '}
            <a
              href={`https://github.com/${data?.username || 'stupnd'}`}
              target="_blank"
              rel="noreferrer"
              className="underline decoration-dotted underline-offset-[3px] hover:text-terracotta"
              data-cursor="open"
            >
              github.com/{data?.username || 'stupnd'}
            </a>
          </span>
        </div>
        <Heatmap grid={heatmap} animated={status === 'ok'} />
      </div>

      <ul className="mt-5 space-y-2.5">
        {commits.map((c, i) => (
          <motion.li
            key={`${c.sha}-${i}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut', delay: i * 0.05 }}
            className="flex items-baseline gap-3 text-[13px] leading-snug md:text-[14px]"
          >
            <a
              href={c.url}
              target="_blank"
              rel="noreferrer"
              data-cursor="open"
              className="shrink-0 rounded bg-ink/5 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-ink/70 ring-1 ring-ink/5 transition-colors hover:bg-terracotta hover:text-bg"
            >
              {c.sha}
            </a>
            <span className="flex-1 truncate text-ink/85">{c.message}</span>
            <span className="shrink-0 text-[11px] text-muted">
              <span className="hidden sm:inline">{c.repo.split('/')[1] || c.repo} · </span>
              {c.when}
            </span>
          </motion.li>
        ))}
      </ul>
      {status === 'fallback' ? (
        <p className="mt-4 flex items-center gap-2 text-[11px] text-muted">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-muted/50" aria-hidden />
          Sample activity — live GitHub feed activates on the deployed build.
        </p>
      ) : null}
    </section>
  )
}
