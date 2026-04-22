// Vercel Serverless Function — GET /api/github
// Returns a compact summary of Stuti's public GitHub activity:
//   - last 3 commit messages (with repo, relative time, sha)
//   - 53-week × 7-day contribution heatmap grid (counts only, no dates)
//
// Why the shape is small: the NowBuilding strip renders it directly and we
// want the JSON to be trivially cacheable at the edge.
//
// The contribution graph is scraped from github.com's public contributions
// page (no auth required). If that scrape fails we degrade gracefully to
// `null` for contributions and the UI shows just the commit list.

export const config = {
  runtime: 'nodejs',
  maxDuration: 15,
}

const USERNAME = process.env.GITHUB_USERNAME || 'stupnd'
const CACHE_TTL_MS = 15 * 60 * 1000
let cache: { at: number; payload: unknown } | null = null

interface GithubEvent {
  type: string
  created_at: string
  repo?: { name: string }
}

interface CommitEntry {
  repo: string
  message: string
  when: string
  sha: string
  url: string
}

interface RepoCommit {
  sha: string
  commit: {
    message: string
    author: { date: string }
  }
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

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || ''

function ghHeaders() {
  const h: Record<string, string> = {
    'user-agent': 'stuti-portfolio',
    accept: 'application/vnd.github+json',
  }
  if (GITHUB_TOKEN) h.authorization = `Bearer ${GITHUB_TOKEN}`
  return h
}

// GitHub's public-events feed strips commit lists when a user's commit email
// is marked private, which makes it useless here. Strategy:
//   1. Use the events feed only to DISCOVER which repos the user has pushed
//      to recently.
//   2. Hit /repos/{owner}/{repo}/commits on each — that endpoint returns the
//      real commits regardless of email privacy.
//   3. Merge, sort by date, take the 3 newest.
async function discoverRecentRepos(): Promise<string[]> {
  try {
    const res = await fetchWithTimeout(
      `https://api.github.com/users/${USERNAME}/events/public?per_page=30`,
      { headers: ghHeaders() },
      5000
    )
    if (!res.ok) return []
    const events = (await res.json()) as GithubEvent[]
    const seen = new Set<string>()
    const repos: string[] = []
    for (const ev of events) {
      if (ev.type !== 'PushEvent' && ev.type !== 'CreateEvent') continue
      const name = ev.repo?.name
      if (!name || seen.has(name)) continue
      seen.add(name)
      repos.push(name)
      if (repos.length >= 5) break
    }
    return repos
  } catch (err) {
    console.warn('[github] events_failed', err)
    return []
  }
}

async function fetchRecentCommits(): Promise<CommitEntry[]> {
  const repos = await discoverRecentRepos()
  if (!repos.length) return []

  // Fetch in parallel with per-request timeout so a single slow repo can't
  // stall the whole response.
  const results = await Promise.all(repos.map((r) => fetchRepoCommitsTagged(r)))
  const flat = results.flat()
  flat.sort((a, b) => (a.isoDate < b.isoDate ? 1 : -1))
  return flat.slice(0, 3).map(({ isoDate: _iso, ...rest }) => rest)
}

// Same as fetchRepoCommits but also returns the ISO date for precise sort.
async function fetchRepoCommitsTagged(
  fullName: string
): Promise<Array<CommitEntry & { isoDate: string }>> {
  try {
    const res = await fetchWithTimeout(
      `https://api.github.com/repos/${fullName}/commits?author=${USERNAME}&per_page=3`,
      { headers: ghHeaders() },
      4000
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
  } catch (err) {
    console.warn(`[github] repo_commits_failed ${fullName}`, err)
    return []
  }
}

// Scrape the public contributions page. GitHub renders the calendar as a
// table of <td data-date="YYYY-MM-DD" data-level="0..4">. We extract the
// last 53 weeks (371 days) and bin by week column.
async function fetchContributions(): Promise<number[][] | null> {
  try {
    const res = await fetchWithTimeout(
      `https://github.com/users/${USERNAME}/contributions`,
      {
        headers: {
          'user-agent':
            'Mozilla/5.0 (compatible; stuti-portfolio/1.0)',
          accept: 'text/html',
        },
      },
      6000
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

    // Re-shape into [week][dayOfWeek] so the UI can render columns directly.
    // We use the first day's weekday as the offset for the first column.
    const firstDow = new Date(tail[0].date).getUTCDay() // 0=Sun
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
  } catch (err) {
    console.warn('[github] contributions_failed', err)
    return null
  }
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

  // Both fetches are individually try/catch'd so Promise.all can't reject;
  // if GitHub is fully unreachable we still return a well-shaped payload
  // with empty data and let the client decide what to render.
  const [commits, contributions] = await Promise.all([
    fetchRecentCommits(),
    fetchContributions(),
  ])
  const payload = {
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
