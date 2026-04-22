import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { citations, suggestedPrompts } from '../data/knowledge'

// Embedded "Ask my portfolio" chat.
// Streams tokens from /api/chat. Answers reference sections via [[cite:id]]
// tokens that we parse into clickable chips. Clicking a chip dispatches a
// 'portfolio:navigate' custom event that App.jsx listens for.

function emitNavigate(tabId) {
  window.dispatchEvent(new CustomEvent('portfolio:navigate', { detail: tabId }))
}

// Split an assistant message by [[cite:id]] tokens. Returns an array of parts:
// { type: 'text', value } | { type: 'cite', id, tab, label }
function parseCitations(text) {
  if (!text) return []
  const re = /\[\[cite:([a-z0-9_-]+)\]\]/gi
  const parts = []
  let lastIndex = 0
  let match
  while ((match = re.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', value: text.slice(lastIndex, match.index) })
    }
    const id = match[1].toLowerCase()
    const meta = citations[id]
    if (meta) {
      parts.push({ type: 'cite', id, tab: meta.tab, label: meta.label })
    } else {
      parts.push({ type: 'text', value: match[0] })
    }
    lastIndex = re.lastIndex
  }
  if (lastIndex < text.length) {
    parts.push({ type: 'text', value: text.slice(lastIndex) })
  }
  return parts
}

function CiteChip({ cite }) {
  return (
    <button
      type="button"
      onClick={() => emitNavigate(cite.tab)}
      data-cursor="view"
      className="mx-0.5 inline-flex items-center gap-1 rounded-full bg-terracotta/10 px-2 py-0.5 text-[11px] font-semibold text-terracotta ring-1 ring-terracotta/25 transition-all hover:bg-terracotta hover:text-bg"
    >
      <span aria-hidden>→</span>
      {cite.label}
    </button>
  )
}

function MessageBubble({ role, content }) {
  const parts = role === 'assistant' ? parseCitations(content) : [{ type: 'text', value: content }]
  const isUser = role === 'user'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-[14.5px] leading-[1.6] md:text-[15px] ${
          isUser
            ? 'bg-ink text-bg'
            : 'bg-card text-ink ring-1 ring-ink/10'
        }`}
      >
        {parts.map((p, i) =>
          p.type === 'text' ? (
            <span key={i}>{p.value}</span>
          ) : (
            <CiteChip key={i} cite={p} />
          )
        )}
      </div>
    </div>
  )
}

function TypingDots() {
  return (
    <div className="flex justify-start">
      <div className="flex items-center gap-1.5 rounded-2xl bg-card px-4 py-3 ring-1 ring-ink/10">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="inline-block h-1.5 w-1.5 rounded-full bg-ink/40"
            animate={{ y: [0, -3, 0], opacity: [0.35, 0.9, 0.35] }}
            transition={{
              duration: 0.9,
              repeat: Infinity,
              delay: i * 0.12,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
    </div>
  )
}

const FALLBACK_ANSWERS = {
  'Tell me about Sage':
    "Sage is Stuti's full-stack AI investing assistant — Next.js + FastAPI with streaming Anthropic responses, agentic tool use for real-time financial data, and Supabase-backed per-user portfolios. Live at pulse-ai-investing.vercel.app. [[cite:sage]]",
  'Is she available for new grad?':
    'Yes. Stuti graduates December 2026 and is open to New Grad SWE / AI roles starting January 2027. [[cite:about]] [[cite:contact]]',
  "What's her hardware experience?":
    'On Bridge (her capstone), she built the full embedded pipeline — Arduino Nano ESP32 firmware reading flex sensors + IMU at 50 Hz, a BLE GATT stream, and on-device gesture classification, all feeding a React Native app. [[cite:bridge]]',
  'What did she build for WIE?':
    "As Chair of IEEE WIE at uOttawa, Stuti ran the inaugural WIE hackathon (100+ students), led Git / React / Docker workshops, built a mentorship program, and organized WIPS 2026. [[cite:wie]]",
}

function pickFallback(prompt) {
  const direct = FALLBACK_ANSWERS[prompt]
  if (direct) return direct
  const lc = (prompt || '').toLowerCase()
  if (lc.includes('sage') || lc.includes('investing') || lc.includes('pulse'))
    return FALLBACK_ANSWERS['Tell me about Sage']
  if (lc.includes('bridge') || lc.includes('hardware') || lc.includes('embedded') || lc.includes('asl'))
    return FALLBACK_ANSWERS["What's her hardware experience?"]
  if (lc.includes('wie') || lc.includes('women') || lc.includes('community'))
    return FALLBACK_ANSWERS['What did she build for WIE?']
  if (lc.includes('new grad') || lc.includes('available') || lc.includes('hir'))
    return FALLBACK_ANSWERS['Is she available for new grad?']
  return "The live chat isn't wired up in this environment — but Stuti is graduating Dec 2026 and open to New Grad SWE / AI roles for Jan 2027. Email her at stuti.pandya0@gmail.com or browse the other tabs. [[cite:projects]] [[cite:about]]"
}

// Any non-2xx response other than 429 is treated as "API not available here"
// and we fall through to canned fallback answers so local dev (plain `vite`)
// Just Works without needing `vercel dev`.
const RATE_LIMIT_STATUS = 429

export default function AskMeChat() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState(null)
  const [apiMissing, setApiMissing] = useState(false)
  const scrollRef = useRef(null)
  const abortRef = useRef(null)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.scrollTop = el.scrollHeight
  }, [messages, pending])

  useEffect(() => () => abortRef.current?.abort(), [])

  async function send(prompt) {
    const text = (prompt ?? input).trim()
    if (!text || pending) return
    setError(null)
    setInput('')

    const nextHistory = [...messages, { role: 'user', content: text }]
    setMessages(nextHistory)
    setPending(true)

    // If we've already learned the API isn't available, just serve a fallback.
    if (apiMissing) {
      setMessages((m) => [...m, { role: 'assistant', content: pickFallback(text) }])
      setPending(false)
      return
    }

    const controller = new AbortController()
    abortRef.current = controller

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ messages: nextHistory }),
        signal: controller.signal,
      })

      if (res.status === RATE_LIMIT_STATUS) {
        setError('Slow down a touch — too many messages in the last minute.')
        return
      }

      // Detect Vite's SPA fallback: dev server returns index.html with 200 for
      // unknown POST routes, so check content-type too.
      const ct = res.headers.get('content-type') || ''
      const looksLikeHtml = ct.includes('text/html')

      if (!res.ok || looksLikeHtml) {
        setApiMissing(true)
        setMessages((m) => [...m, { role: 'assistant', content: pickFallback(text) }])
        return
      }

      const reader = res.body?.getReader()
      if (!reader) {
        setApiMissing(true)
        setMessages((m) => [...m, { role: 'assistant', content: pickFallback(text) }])
        return
      }

      setMessages((m) => [...m, { role: 'assistant', content: '' }])

      const decoder = new TextDecoder()
      let streamed = ''
      while (true) {
        const { value, done } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        if (!chunk) continue
        streamed += chunk
        setMessages((m) => {
          const last = m[m.length - 1]
          if (!last || last.role !== 'assistant') return m
          const updated = { ...last, content: last.content + chunk }
          return [...m.slice(0, -1), updated]
        })
      }

      // If the API streamed nothing (e.g. misconfigured), fall back cleanly.
      if (!streamed.trim()) {
        setApiMissing(true)
        setMessages((m) => {
          const last = m[m.length - 1]
          if (!last || last.role !== 'assistant') return m
          const updated = { ...last, content: pickFallback(text) }
          return [...m.slice(0, -1), updated]
        })
      }
    } catch (err) {
      if (err?.name === 'AbortError') return
      setApiMissing(true)
      setMessages((m) => [...m, { role: 'assistant', content: pickFallback(text) }])
    } finally {
      setPending(false)
      abortRef.current = null
    }
  }

  function reset() {
    abortRef.current?.abort()
    setMessages([])
    setError(null)
    setInput('')
    setPending(false)
  }

  return (
    <section
      aria-label="Ask my portfolio anything"
      className="mt-16 md:mt-20"
    >
      <div className="flex items-baseline justify-between gap-4">
        <div>
          <p className="eyebrow text-terracotta">Ask me anything</p>
          <h2 className="f-serif mt-3 text-[clamp(26px,3.5vw,42px)] font-bold leading-[1.15] tracking-tight text-ink">
            A chatbot trained on Stuti&apos;s resume.
          </h2>
          <p className="mt-2 max-w-lg text-sm text-muted md:text-[15px]">
            Try &ldquo;tell me about Sage&rdquo; or &ldquo;is she available for new grad?&rdquo;
          </p>
        </div>
        {messages.length > 0 ? (
          <button
            type="button"
            onClick={reset}
            className="shrink-0 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted transition-colors hover:text-terracotta"
          >
            Clear
          </button>
        ) : null}
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl bg-bg ring-1 ring-ink/10 shadow-[0_24px_60px_-30px_rgba(17,17,17,0.3)]">
        <div
          ref={scrollRef}
          className="max-h-[360px] min-h-[180px] space-y-3 overflow-y-auto p-5 md:p-6"
        >
          {messages.length === 0 ? (
            <div className="space-y-3">
              <p className="text-sm text-muted">
                A little AI assistant that knows Stuti&apos;s projects, roles, and WIE work. Pick a
                prompt or type your own.
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {suggestedPrompts.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => send(p)}
                    data-cursor="write"
                    className="rounded-full bg-card px-3.5 py-1.5 text-[13px] font-medium text-ink/85 ring-1 ring-ink/10 transition-all hover:-translate-y-0.5 hover:bg-terracotta hover:text-bg hover:ring-terracotta"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                >
                  <MessageBubble role={m.role} content={m.content} />
                </motion.div>
              ))}
              {pending && messages[messages.length - 1]?.role !== 'assistant' ? (
                <TypingDots key="typing" />
              ) : null}
            </AnimatePresence>
          )}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            send()
          }}
          className="flex items-stretch gap-2 border-t border-ink/10 bg-card/60 p-3 md:p-4"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about Stuti's work, projects, or availability…"
            disabled={pending}
            aria-label="Ask my portfolio a question"
            className="f-body flex-1 rounded-xl bg-bg px-4 py-2.5 text-[14.5px] text-ink placeholder:text-muted/90 ring-1 ring-ink/10 outline-none transition-colors focus:ring-terracotta md:text-[15px]"
          />
          <button
            type="submit"
            disabled={pending || !input.trim()}
            data-cursor="write"
            className="rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-bg transition-all disabled:opacity-40 enabled:hover:bg-terracotta"
          >
            {pending ? '…' : 'Ask'}
          </button>
        </form>
      </div>

      {error ? (
        <p className="mt-3 text-sm text-terracotta">{error}</p>
      ) : null}
      {apiMissing && messages.length > 0 ? (
        <p className="mt-3 flex items-center gap-2 text-[11px] text-muted">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-muted/50" aria-hidden />
          Demo mode — answers are curated. Live streaming chat activates on the deployed build.
        </p>
      ) : null}
    </section>
  )
}
