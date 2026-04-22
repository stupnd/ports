// Single source of truth for Stuti's portfolio content.
// Used by: (1) the /api/chat function to ground the LLM's answers,
// and (2) UI components (AskMeChat citation chips, future case studies).
// Keep entries small and factual — the whole file gets stuffed into a
// system prompt, so it should stay under ~8 KB.

export const bio = {
  name: 'Stuti Pandya',
  location: 'Ottawa, Ontario, Canada',
  relocation: 'Open to relocating for the right opportunity.',
  school: 'University of Ottawa',
  degree: 'B.A.Sc. Computer Engineering — Engineering Management & Entrepreneurship stream',
  gpa: '8.0 / 10.0  (≈ 3.7 / 4.0)',
  graduation: 'December 2026',
  availability:
    'Looking for full-time SWE / AI engineer roles starting January 2027. Open to remote, hybrid, or in-person in Canada.',
  currentRole:
    'Software Developer Co-op at TrendAI (Trend Micro Canada Technologies), starting May 2026',
  targetCompanies: ['Wealthsimple', 'Google', 'Microsoft', 'Cohere', 'Canadian AI + fintech'],
  pronouns: 'she/her',
  email: 'stuti.pandya0@gmail.com',
  links: {
    github: 'https://github.com/stupnd',
    githubHandle: 'stupnd',
    lilBytes: 'https://www.instagram.com/lilbytes.tech/',
  },
  tagline: 'Computer Engineer. Builder. Creative Technologist.',
  summary:
    "4th-year Computer Engineering student at uOttawa, graduating December 2026. Builds across AI/ML, full-stack, and embedded. IEEE WIE Chair 2026–27. Heading to Grace Hopper 2026. Co-runs Lil Bytes, a tech-education page on Instagram.",
  workingStyle:
    'Learns by building real things end-to-end. Uses Cursor + Claude for architecture and planning. Prefers shipping over theorizing.',
}

export const skills = {
  languages: ['Python', 'JavaScript / TypeScript', 'C / C++', 'Java', 'SQL'],
  frameworks: ['React', 'Next.js', 'FastAPI', 'React Native'],
  ai: ['Anthropic API (streaming, tool use, vision)', 'MediaPipe', 'UNet', 'PyTorch'],
  embedded: ['Arduino', 'STM32', 'FreeRTOS', 'BLE'],
  infra: ['Supabase', 'Docker', 'Git', 'Oracle SQL', 'Salesforce / Apex', 'AWS / Azure / GCP'],
  design: ['Tailwind CSS', 'Figma'],
}

export const projects = [
  {
    id: 'sage',
    tab: 'projects',
    title: 'Sage',
    tagline: 'Full-stack AI investing assistant',
    blurb:
      'Full-stack AI investing assistant — Next.js + FastAPI with Anthropic agentic tool use, streaming responses, and real-time financial data.',
    stack: ['Next.js', 'FastAPI', 'Anthropic API', 'Supabase', 'Recharts'],
    github: 'https://github.com/stupnd/sage',
    live: 'https://pulse-ai-investing.vercel.app',
    highlights: [
      'Streaming Claude responses rendered into a Next.js chat UI.',
      'Agentic tool use — model calls live quote + chart tools, results stream back.',
      'FastAPI BFF keeps third-party API keys server-side and composes responses.',
      'Supabase auth + row-level security for per-user portfolios.',
    ],
    role: 'AI, full-stack',
    accent: 'cobalt',
    caseStudy: {
      problem:
        'Retail investors drown in noise — tickers, news, filings — without a way to ask plain-English questions about their own portfolio. Sage turns "why is NVDA up?" into a grounded answer using the user\'s actual holdings, with the model calling live data tools mid-response.',
      pullQuote:
        'Streaming tokens are the difference between a demo and a product. Users read at the same speed the model writes.',
      architecture: {
        nodes: [
          { id: 'client', label: 'Next.js client', col: 0, row: 0 },
          { id: 'api', label: 'FastAPI BFF', col: 1, row: 0 },
          { id: 'llm', label: 'Anthropic\n(tool use)', col: 2, row: 0 },
          { id: 'quotes', label: 'Quote tools', col: 1, row: 1 },
          { id: 'db', label: 'Supabase\n(portfolio, RLS)', col: 0, row: 1 },
        ],
        edges: [
          { from: 'client', to: 'api', label: 'SSE /chat' },
          { from: 'api', to: 'llm', label: 'stream' },
          { from: 'api', to: 'quotes', label: 'tool call' },
          { from: 'client', to: 'db', label: 'RLS read' },
          { from: 'api', to: 'db', label: 'grounding' },
        ],
      },
      decisions: [
        {
          title: 'Agentic tool use, not RAG',
          body: 'Quotes and charts change every second — caching them in a vector store would lie. Letting Claude call a live quote tool mid-response keeps the numbers honest.',
        },
        {
          title: 'FastAPI as a thin BFF',
          body: 'Anthropic + quote APIs get composed server-side so the client never sees third-party keys and token usage stays auditable.',
        },
        {
          title: 'Supabase RLS over custom auth',
          body: 'Row-level security policies gave per-user portfolio isolation in ~30 lines of SQL instead of a hand-rolled middleware layer.',
        },
      ],
      metrics: [
        { number: '180', suffix: 'ms', label: 'avg time-to-first-token' },
        { number: '5', suffix: 'x', label: 'fewer reloads vs. non-streaming' },
        { number: '100', suffix: '%', label: 'RLS-isolated user data' },
      ],
      lessons:
        'Ship streaming on day one — retrofitting it later rewrites half your UI. Give the model tools instead of stuffing context; live data beats stale context every time.',
    },
  },
  {
    id: 'glowmatch',
    tab: 'projects',
    title: 'GlowMatch',
    tagline: 'Real-time skin-tone analysis for makeup matching',
    blurb:
      'Real-time skin-tone analysis with MediaPipe face-mesh segmentation and Claude Vision for product-level makeup recommendations.',
    stack: ['Python', 'MediaPipe', 'Claude Vision API', 'React'],
    github: 'https://github.com/stupnd/glowmatch',
    highlights: [
      'MediaPipe face-mesh isolates skin-only pixels, ignoring hair / lips / eyes.',
      'Claude Vision API takes the masked frame and returns matched-shade product names, not just hex codes.',
      'Runs on live webcam input; no per-frame backend round-trip for the mask step.',
    ],
    role: 'Computer vision, LLM integration',
    accent: 'terracotta',
    caseStudy: {
      problem:
        'Online shade-matching is mostly guesswork because photos are a tangle of skin, hair, lips, and background pixels. GlowMatch segments the face first, then asks a vision LLM for product-level matches — not just a hex code.',
      decisions: [
        {
          title: 'MediaPipe mask first, vision LLM second',
          body: 'The 468-point face mesh gives a cheap, local mask so the vision model only sees skin pixels — fewer hallucinations, better matches.',
        },
        {
          title: 'LLM vision over a trained classifier',
          body: 'A vision LLM returns human-readable product names with context ("warm olive, try X in shade 12"). A closed-set classifier couldn\'t.',
        },
      ],
      lessons:
        'The hardest part of a CV side-project is rarely the model — it\'s the data plumbing. Good masks beat a deeper network.',
    },
  },
  {
    id: 'bridge',
    tab: 'projects',
    title: 'Bridge',
    tagline: 'Capstone — real-time ASL translation glove',
    blurb:
      'Capstone project. A glove with BLE flex sensors on an Arduino Nano ESP32, streaming gesture data to a React Native app that translates ASL in real time.',
    stack: ['Arduino Nano ESP32', 'BLE', 'Flex sensors', 'React Native'],
    github: 'https://github.com/stupnd/Bridge',
    highlights: [
      'Flex sensors + IMU on the Arduino Nano ESP32 sampled at 50 Hz.',
      'BLE GATT server streaming packed gesture frames to a React Native app.',
      'On-device gesture classification for sub-100 ms latency.',
      'Full pipeline: firmware, BLE protocol, mobile UI — owned end to end.',
    ],
    role: 'Embedded + mobile, full pipeline',
    accent: 'sun',
    caseStudy: {
      problem:
        'Wearable ASL translators usually sit behind a phone server, adding round-trip latency that kills the "real-time" feel. Bridge runs classification on the glove itself so gestures become text in under 100 ms.',
      pullQuote:
        'The glove does the inference; the phone is just a screen. That\'s what makes it feel alive.',
      architecture: {
        nodes: [
          { id: 'sensors', label: 'Flex + IMU\n(5 ch, 50 Hz)', col: 0, row: 0 },
          { id: 'esp', label: 'Arduino Nano\nESP32 + KNN', col: 1, row: 0 },
          { id: 'ble', label: 'BLE GATT', col: 2, row: 0 },
          { id: 'app', label: 'React Native app', col: 3, row: 0 },
        ],
        edges: [
          { from: 'sensors', to: 'esp', label: 'ADC' },
          { from: 'esp', to: 'ble', label: 'packed frame' },
          { from: 'ble', to: 'app', label: 'BLE' },
        ],
      },
      decisions: [
        {
          title: 'On-device classification, not cloud inference',
          body: 'A compact classifier fits comfortably in ESP32 SRAM and keeps end-to-end latency under 100 ms even with BLE overhead.',
        },
        {
          title: 'React Native, not a native app',
          body: 'One codebase for iOS + Android meant more time on the glove and less on UI plumbing.',
        },
        {
          title: 'Bit-packed BLE frames',
          body: 'Hand-rolled compact frames kept BLE throughput comfortable and firmware readable — JSON / protobuf was overkill for a handful of integers.',
        },
      ],
      metrics: [
        { number: '50', suffix: 'Hz', label: 'sample rate' },
        { number: '95', suffix: '%', label: 'gesture accuracy' },
        { number: '80', suffix: 'ms', label: 'end-to-end latency' },
      ],
      lessons:
        'Embedded work is a latency budget. Every stage — sensor → ADC → classifier → BLE → UI — spends milliseconds you don\'t get back. Profile early, trim ruthlessly.',
    },
  },
]

export const experience = [
  {
    id: 'trendai',
    tab: 'experience',
    company: 'TrendAI',
    sub: 'Trend Micro Canada Technologies',
    title: 'Software Developer Co-op',
    dates: 'May – Aug 2026',
    line: 'AI-driven threat detection and ML pipeline development.',
  },
  {
    id: 'solace',
    tab: 'experience',
    company: 'Solace',
    sub: null,
    title: 'Support Engineer Intern',
    dates: 'Sep – Dec 2025',
    line: 'Debugged distributed event broker systems; guided enterprise cloud architecture across AWS / Azure / GCP.',
  },
  {
    id: 'nrcan',
    tab: 'experience',
    company: 'Natural Resources Canada',
    sub: null,
    title: 'Software Engineering Intern',
    dates: 'May 2024 – Aug 2025 · 3 terms',
    line: 'Oracle SQL data work, Salesforce automation, and C# / Apex data pipelines.',
  },
]

export const wie = {
  id: 'wie',
  tab: 'wie',
  title: 'IEEE Women in Engineering — uOttawa',
  role: 'Vice Chair (2024–25) → Chair (2025–26 & 2026–27)',
  summary:
    'Two-year tenure chairing one of the most active IEEE student branches on campus. Organized the inaugural WIE hackathon (100+ students), led Git / React / Docker workshops, ran a mentorship program, and organized WIPS 2026 — a speed-networking and awards night.',
  highlights: [
    'Organized uOttawa WIE\'s first-ever hackathon — 100+ students.',
    'Ran technical workshops on Git, React, and Docker.',
    'Built a mentorship program pairing upper-years with first- and second-years.',
    'Organized WIPS 2026 — speed-networking + awards for IEEE WIE.',
  ],
}

export const beyond = {
  id: 'beyond',
  tab: 'beyond',
  title: 'Beyond the code',
  summary:
    'Reader (currently on a fiction kick), digicam photographer, and always hunting the best meal in any city. Co-runs Lil Bytes — a tech-education Instagram page that breaks down CS and engineering concepts for a general audience.',
  interests: ['Reading (fiction)', 'Sitcoms', 'Trying new food', 'Digicam photography'],
}

// Extra Q&A-style facts that don't fit cleanly into the sections above.
// The LLM sees these as additional grounding context.
export const faq = [
  { q: 'GPA?', a: '8.0 / 10.0 (roughly 3.7 / 4.0).' },
  { q: 'Graduation?', a: 'December 2026 — Computer Engineering at the University of Ottawa.' },
  { q: 'Remote work?', a: 'Yes — open to remote, hybrid, or in-person roles in Canada.' },
  { q: 'Location?', a: 'Ottawa, Ontario. Open to relocating for the right opportunity.' },
  { q: 'Capstone?', a: 'Bridge — the ASL translation glove.' },
  {
    q: 'Roles of interest?',
    a: 'Software engineering, AI / ML engineering, or full-stack. Open to product and infra-leaning work. Full-time starting January 2027.',
  },
  {
    q: 'AI / ML experience?',
    a: 'Built with the Anthropic API (streaming, tool use, vision), MediaPipe for CV, and UNet for semantic segmentation. Took Applied Machine Learning at uOttawa.',
  },
  {
    q: 'Strongest language?',
    a: 'Python and JavaScript / TypeScript for everyday work. C / C++ from embedded + real-time OS work.',
  },
  {
    q: 'Team experience?',
    a: 'Worked on a Solace engineering team. Co-founded Lil Bytes and co-chairs IEEE WIE, organizing events like WIPS 2026.',
  },
  {
    q: 'What makes her different?',
    a: 'Unusual mix — full-stack AI apps, computer-vision / ML, AND embedded C for microcontrollers. Most candidates only do one. Ships real things, not academic exercises.',
  },
  { q: 'GitHub?', a: 'github.com/stupnd' },
  {
    q: 'Lil Bytes?',
    a: 'A tech-education Instagram she co-runs — breaks down CS / engineering concepts for a general audience.',
  },
]

// Compact string dump used to ground the LLM. Keep short and dense.
export function buildKnowledgeDump() {
  const lines = []
  lines.push(`# ${bio.name}`)
  lines.push(`Location: ${bio.location}. ${bio.relocation}`)
  lines.push(`School: ${bio.school} — ${bio.degree}`)
  lines.push(`GPA: ${bio.gpa}`)
  lines.push(`Graduation: ${bio.graduation}`)
  lines.push(`Availability: ${bio.availability}`)
  lines.push(`Currently: ${bio.currentRole}`)
  lines.push(`Target companies: ${bio.targetCompanies.join(', ')}`)
  lines.push(`Email: ${bio.email}`)
  lines.push(`GitHub: ${bio.links.github}`)
  lines.push(`Tagline: ${bio.tagline}`)
  lines.push(`Summary: ${bio.summary}`)
  lines.push(`Working style: ${bio.workingStyle}`)
  lines.push('')
  lines.push(`# Skills`)
  Object.entries(skills).forEach(([k, v]) => lines.push(`- ${k}: ${v.join(', ')}`))
  lines.push('')
  lines.push(`# Projects`)
  projects.forEach((p) => {
    lines.push(`## ${p.title} — ${p.tagline} [id:${p.id}]`)
    lines.push(`Role: ${p.role}`)
    lines.push(`Stack: ${p.stack.join(', ')}`)
    lines.push(`GitHub: ${p.github}${p.live ? ` | Live: ${p.live}` : ''}`)
    p.highlights.forEach((h) => lines.push(`- ${h}`))
    lines.push('')
  })
  lines.push(`# Work Experience`)
  experience.forEach((e) => {
    lines.push(`## ${e.company}${e.sub ? ` (${e.sub})` : ''} — ${e.title} [id:${e.id}]`)
    lines.push(`${e.dates}: ${e.line}`)
    lines.push('')
  })
  lines.push(`# IEEE WIE`)
  lines.push(`${wie.title} — ${wie.role}`)
  lines.push(wie.summary)
  wie.highlights.forEach((h) => lines.push(`- ${h}`))
  lines.push('')
  lines.push(`# Beyond the code`)
  lines.push(beyond.summary)
  lines.push('')
  lines.push(`# Common questions`)
  faq.forEach((item) => lines.push(`Q: ${item.q}\nA: ${item.a}`))
  return lines.join('\n')
}

// Citation registry — maps canonical ids to their tab + a short label.
// The LLM is instructed to emit [[cite:id]] tokens; the UI parses them
// into clickable chips that switch the active portfolio tab.
export const citations = {
  sage: { tab: 'projects', label: 'Sage' },
  glowmatch: { tab: 'projects', label: 'GlowMatch' },
  bridge: { tab: 'projects', label: 'Bridge' },
  projects: { tab: 'projects', label: 'Projects' },
  trendai: { tab: 'experience', label: 'TrendAI' },
  solace: { tab: 'experience', label: 'Solace' },
  nrcan: { tab: 'experience', label: 'Natural Resources Canada' },
  experience: { tab: 'experience', label: 'Experience' },
  wie: { tab: 'wie', label: 'IEEE WIE' },
  about: { tab: 'about', label: 'About Stuti' },
  beyond: { tab: 'beyond', label: 'Beyond the code' },
  contact: { tab: 'contact', label: 'Contact' },
}

export const suggestedPrompts = [
  'Tell me about Sage',
  'Is she available for new grad?',
  "What's her hardware experience?",
  'What did she build for WIE?',
]
