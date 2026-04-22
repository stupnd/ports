// Vercel Serverless Function — GET /api/github
// Returns a compact summary of Stuti's public GitHub activity:
//   - last 3 commit messages (with repo, relative time, sha)
//   - 53-week × 7-day contribution heatmap grid
//
// Strategy (kept simple to fit inside Vercel's serverless budget):
//   1. Ask GitHub for the user's 3 most-recently-pushed public repos
//      (/users/:user/repos?sort=pushed).
//   2. Fetch 3 commits from each in parallel (/repos/:r/commits?author=:u).
//      This works regardless of the user's commit-email privacy setting.
//   3. Merge, sort by date, take the top 3.
//   4. In parallel, scrape the public contributions page for the heatmap.
//   5. Wrap the WHOLE handler in a 7s overall budget so we never time out.

export const config = {
  runtime: 'nodejs',
  maxDuration: 10,
}

// Bump this when the function meaningfully changes — makes it easy to verify
// the deployed build matches the latest commit by curling the endpoint.
const FN_VERSION = '2026-04-21-03'

const USERNAME = process.env.GITHUB_USERNAME || 'stupnd'
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || ''
const CACHE_TTL_MS = 15 * 60 * 1000
const OVERALL_BUDGET_MS = 7000

let cache: { at: number; payload: unknown } | null = null

interface RepoSummary {
  full_name: string
  pushed_at: string
}

interface RepoCommit {
  sha: string
  commit: { message: string; author: { date: string } }
}

interface CommitEntry {
  repo: string
  message: string
  when: string
  sha: string
  url: string
}

function relativeTime(iso: string) {
  const then = new Date(iso).getTime()
  const diff = Date.now() - then
  const mins = Math.round(diff / 60_000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.round(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.round(hrs / 24)
  if (days < 30) return `${days}d ago`
  const months = Math.round(days / 30)
  return `${months}mo ago`
}

async function fetchWithTimeout(url: string, init: RequestInit, ms: number) {
  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), ms)
  try {
    return await fetch(url, { ...init, signal: ctrl.signal })
  } finally {
    clearTimeout(t)
  }
}

function ghHeaders() {
  const h: Record<string, string> = {
    'user-agent': 'stuti-portfolio',
    accept: 'application/vnd.github+json',
  }
  if (GITHUB_TOKEN) h.authorization = `Bearer ${GITHUB_TOKEN}`
  return h
}

async function fetchRepoCommits(
  fullName: string
): Promise<Array<CommitEntry & { isoDate: string }>> {
  try {
    const res = await fetchWithTimeout(
      `https://api.github.com/repos/${fullName}/commits?author=${USERNAME}&per_page=3`,
      { headers: ghHeaders() },
      3000
    )
    if (!res.ok) return []
    const commits = (await res.json()) as RepoCommit[]
    return commits.map((c) => ({
      repo: fullName,
      message: c.commit.message.split('\n')[0].slice(0, 100),
      when: relativeTime(c.commit.author.date),
      sha: c.sha.slice(0, 7),
      url: `https://github.com/${fullName}/commit/${c.sha}`,
      isoDate: c.commit.author.date,
    }))
  } catch {
    return []
  }
}

async function fetchRecentCommits(): Promise<CommitEntry[]> {
  try {
    const res = await fetchWithTimeout(
      `https://api.github.com/users/${USERNAME}/repos?sort=pushed&direction=desc&per_page=5`,
      { headers: ghHeaders() },
      3000
    )
    if (!res.ok) return []
    const repos = (await res.json()) as RepoSummary[]
    const top = repos.slice(0, 3).map((r) => r.full_name)
    if (!top.length) return []
    const results = await Promise.all(top.map(fetchRepoCommits))
    const flat = results.flat()
    flat.sort((a, b) => (a.isoDate < b.isoDate ? 1 : -1))
    return flat.slice(0, 3).map(({ isoDate: _iso, ...rest }) => rest)
  } catch {
    return []
  }
}

async function fetchContributions(): Promise<number[][] | null> {
  try {
    const res = await fetchWithTimeout(
      `https://github.com/users/${USERNAME}/contributions`,
      {
        headers: {
          'user-agent': 'Mozilla/5.0 (compatible; stuti-portfolio/1.0)',
          accept: 'text/html',
        },
      },
      3500
    )
    if (!res.ok) return null
    const html = await res.text()
    const dayRegex = /data-date="(\d{4}-\d{2}-\d{2})"\s+data-level="(\d)"/g
    const days: Array<{ date: string; level: number }> = []
    let m
    while ((m = dayRegex.exec(html)) !== null) {
      days.push({ date: m[1], level: parseInt(m[2], 10) })
    }
    if (!days.length) return null
    days.sort((a, b) => (a.date < b.date ? -1 : 1))
    const tail = days.slice(-53 * 7)

    const firstDow = new Date(tail[0].date).getUTCDay()
    const grid: number[][] = []
    let col: number[] = new Array(firstDow).fill(-1)
    for (const d of tail) {
      col.push(d.level)
      if (col.length === 7) {
        grid.push(col)
        col = []
      }
    }
    if (col.length) {
      while (col.length < 7) col.push(-1)
      grid.push(col)
    }
    return grid
  } catch {
    return null
  }
}

// Wraps a promise with a timeout; resolves with fallback if the promise
// doesn't settle in time. Guarantees we return data before Vercel kills us.
function withBudget<T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> {
  return new Promise((resolve) => {
    const t = setTimeout(() => resolve(fallback), ms)
    promise.then(
      (v) => {
        clearTimeout(t)
        resolve(v)
      },
      () => {
        clearTimeout(t)
        resolve(fallback)
      }
    )
  })
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'method_not_allowed' }), {
      status: 405,
      headers: { 'content-type': 'application/json' },
    })
  }

  if (cache && Date.now() - cache.at < CACHE_TTL_MS) {
    return new Response(JSON.stringify(cache.payload), {
      status: 200,
      headers: {
        'content-type': 'application/json',
        'cache-control': 's-maxage=900, stale-while-revalidate=3600',
      },
    })
  }

  const [commits, contributions] = await Promise.all([
    withBudget<CommitEntry[]>(fetchRecentCommits(), OVERALL_BUDGET_MS, []),
    withBudget<number[][] | null>(fetchContributions(), OVERALL_BUDGET_MS, null),
  ])

  const payload = {
    version: FN_VERSION,
    username: USERNAME,
    commits,
    contributions,
    fetchedAt: new Date().toISOString(),
  }
  cache = { at: Date.now(), payload }

  return new Response(JSON.stringify(payload), {
    status: 200,
    headers: {
      'content-type': 'application/json',
      'cache-control': 's-maxage=900, stale-while-revalidate=3600',
    },
  })
}
