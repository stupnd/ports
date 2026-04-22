# Stuti Pandya — Portfolio

React 19 + Vite + Tailwind 4 + Framer Motion + GSAP/Lenis. Deploys on Vercel.

## Dev

```bash
npm install
npm run dev
```

## Deploy

Push to a Vercel-linked repo. The `/api/*` functions deploy as Node serverless functions automatically alongside the static Vite build.

## Environment variables (Vercel)

The "Ask my portfolio" chat on Home is powered by `api/chat.ts`. Configure one of the following on the Vercel project's **Settings → Environment Variables**:

| Variable          | Required | Default                       | Notes                                        |
| ----------------- | -------- | ----------------------------- | -------------------------------------------- |
| `AI_PROVIDER`     | no       | `groq`                        | `groq` or `openai`.                          |
| `GROQ_API_KEY`    | if Groq  | —                             | Free tier available at console.groq.com.     |
| `GROQ_MODEL`      | no       | `llama-3.3-70b-versatile`     |                                              |
| `OPENAI_API_KEY`  | if OpenAI| —                             |                                              |
| `OPENAI_MODEL`    | no       | `gpt-4o-mini`                 |                                              |
| `ALLOW_CHAT`      | no       | _unset (enabled)_             | Set to `false` to kill-switch the chat.      |

If no key is configured, the chat degrades gracefully to canned fallback answers so the UI never breaks.

## Endpoints

- `POST /api/chat` — streaming LLM chat grounded on `src/data/knowledge.js`. Rate-limited (10 msgs/min per IP).

## Keyboard

- `⌘K` / `Ctrl+K` — open the command palette.
- `Esc` — close the command palette or back out of a project case study.
