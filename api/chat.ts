// Vercel Serverless Function — POST /api/chat
// Streams LLM answers about Stuti's portfolio, grounded on src/data/knowledge.js.
// Protocol: client sends { messages: [{role, content}] }, server responds with
// text/event-stream of plain UTF-8 chunks. Keep it framework-minimal so the
// Vite SPA client can read it with fetch + ReadableStream.

import { streamText } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'
import { createGroq } from '@ai-sdk/groq'
import { buildKnowledgeDump } from '../src/data/knowledge.js'

export const config = {
  runtime: 'nodejs',
  maxDuration: 30,
}

// Naive in-memory rate limit (resets on cold start, which is fine for a
// portfolio-scale site — this is abuse deterrence, not a security boundary).
const RL_WINDOW_MS = 60_000
const RL_MAX_HITS = 10
const rlBuckets = new Map<string, number[]>()

function rateLimit(ip: string): { ok: boolean; retryAfter?: number } {
  const now = Date.now()
  const hits = (rlBuckets.get(ip) || []).filter((t) => now - t < RL_WINDOW_MS)
  if (hits.length >= RL_MAX_HITS) {
    const oldest = hits[0]
    return { ok: false, retryAfter: Math.ceil((RL_WINDOW_MS - (now - oldest)) / 1000) }
  }
  hits.push(now)
  rlBuckets.set(ip, hits)
  return { ok: true }
}

function getIp(req: Request): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'
  )
}

const SYSTEM_PROMPT_PREFIX = `You are Stuti Pandya's portfolio assistant. You answer questions about Stuti for recruiters, engineers, and anyone curious.

Ground rules:
- Only use the grounding context below. Do NOT invent facts about Stuti. If something is not in the context, say you don't have that detail and suggest they reach out at stuti.pandya0@gmail.com.
- Keep answers tight: 1–4 short sentences unless the user asks for more depth. Recruiters skim.
- Be conversational, warm, concrete. Never salesy. Never use "I" as if you are Stuti — say "she / Stuti".
- When you reference a specific project, role, or section, append a citation token in this exact form: [[cite:id]], using the ids listed in the context (e.g. [[cite:sage]], [[cite:wie]], [[cite:trendai]]). The UI renders these as clickable chips. Include at most 3 citations per answer.
- If asked something off-topic (jokes, unrelated trivia, politics, code help), politely steer back to Stuti.
- If asked "are you an AI / a bot / Stuti?", say you're a small chatbot grounded on her portfolio — not Stuti herself.

Grounding context:
---`

function buildModel() {
  const provider = (process.env.AI_PROVIDER || 'groq').toLowerCase()
  if (provider === 'openai' && process.env.OPENAI_API_KEY) {
    const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY })
    return openai(process.env.OPENAI_MODEL || 'gpt-4o-mini')
  }
  if (process.env.GROQ_API_KEY) {
    const groq = createGroq({ apiKey: process.env.GROQ_API_KEY })
    return groq(process.env.GROQ_MODEL || 'llama-3.3-70b-versatile')
  }
  // Fall back to OpenAI if Groq key missing but OpenAI present.
  if (process.env.OPENAI_API_KEY) {
    const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY })
    return openai(process.env.OPENAI_MODEL || 'gpt-4o-mini')
  }
  return null
}

function errorResponse(status: number, code: string, detail?: string) {
  return new Response(JSON.stringify({ error: code, detail }), {
    status,
    headers: { 'content-type': 'application/json' },
  })
}

export default async function handler(req: Request): Promise<Response> {
  try {
    if (req.method !== 'POST') return errorResponse(405, 'method_not_allowed')

    // Kill-switch — set ALLOW_CHAT=false on Vercel to disable without a redeploy.
    if (process.env.ALLOW_CHAT === 'false') return errorResponse(503, 'chat_disabled')

    const ip = getIp(req)
    const rl = rateLimit(ip)
    if (!rl.ok) {
      return new Response(
        JSON.stringify({ error: 'rate_limited', retryAfter: rl.retryAfter }),
        {
          status: 429,
          headers: {
            'content-type': 'application/json',
            'retry-after': String(rl.retryAfter || 60),
          },
        }
      )
    }

    let body: { messages?: Array<{ role: string; content: string }> } = {}
    try {
      body = await req.json()
    } catch {
      return errorResponse(400, 'invalid_json')
    }

    const messages = Array.isArray(body.messages) ? body.messages.slice(-12) : []
    if (!messages.length) return errorResponse(400, 'no_messages')

    // Sanity caps: shrink oversized messages so a malicious caller can't blow
    // up the token bill via a single huge prompt.
    const cleanMessages = messages
      .filter(
        (m) =>
          m && typeof m.content === 'string' && (m.role === 'user' || m.role === 'assistant')
      )
      .map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content.slice(0, 2000),
      }))

    if (!cleanMessages.length) return errorResponse(400, 'no_valid_messages')

    const model = buildModel()
    if (!model) return errorResponse(503, 'no_provider_configured')

    let system: string
    try {
      system = `${SYSTEM_PROMPT_PREFIX}\n${buildKnowledgeDump()}\n---`
    } catch (err) {
      console.error('[chat] knowledge_dump_failed', err)
      return errorResponse(500, 'knowledge_dump_failed', (err as Error)?.message)
    }

    let result
    try {
      result = streamText({
        model,
        system,
        messages: cleanMessages,
        maxOutputTokens: 320,
        temperature: 0.4,
      })
    } catch (err) {
      console.error('[chat] stream_init_failed', err)
      return errorResponse(500, 'stream_init_failed', (err as Error)?.message)
    }

    // Plain text-stream response — simpler than the AI SDK data-stream protocol
    // and trivial to consume from the browser via ReadableStream.
    return result.toTextStreamResponse({
      headers: {
        'cache-control': 'no-store',
        'x-content-type-options': 'nosniff',
      },
    })
  } catch (err) {
    console.error('[chat] unhandled', err)
    return errorResponse(500, 'unhandled', (err as Error)?.message)
  }
}
