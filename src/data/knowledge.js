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
        "Most investing tools either give you raw data with no explanation, or oversimplified advice with no transparency. There's no middle layer that thinks with you in real time — one that can fetch a live quote, explain what it means, and render a chart inline without losing the thread of the conversation.",
      pullQuote:
        "Streaming isn't just a UX nicety — it completely changes how a user trusts an AI response. Watching it think feels more honest than getting a wall of text.",
      decisions: [
        {
          title: 'Streaming responses, not batched',
          body: 'The UI feels alive instead of frozen during inference. Watching tokens appear is the difference between "is this thing working?" and "I trust this."',
        },
        {
          title: 'Agentic tool use over RAG',
          body: 'The model fetches real quotes and fundamentals mid-response instead of hallucinating numbers from a stale vector store. Finance data has a half-life of seconds.',
        },
        {
          title: 'Supabase for auth + persistence',
          body: "Row-level security and managed auth in ~30 lines of SQL. Kept the focus on the interesting parts instead of spinning up a custom backend.",
        },
      ],
      metrics: [
        { number: '2', suffix: 's', label: 'time to first token' },
        { number: '100', suffix: '%', label: 'live-data grounded answers' },
        { number: '1', suffix: '', label: 'publicly deployed build' },
      ],
      lessons:
        "Streaming isn't just a UX nicety — it completely changes how a user trusts an AI response. Watching it think feels more honest than a batched wall of text.",
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
        "Makeup recommendations online are either generic (\"for warm undertones\") or require a human expert. There's no tool that looks at your actual face and gives you specific product guidance — and the ones that try usually sample pixels from your hair or background.",
      pullQuote:
        "Sometimes the best ML decision is knowing when not to train your own model. Claude Vision with good prompting outperformed a custom classifier I prototyped in half the time.",
      decisions: [
        {
          title: 'MediaPipe for landmark detection',
          body: 'Tone sampling hits cheek + forehead regions specifically — never background or hair. The 468-point mesh is cheap, local, and runs in real time.',
        },
        {
          title: 'Claude Vision over a custom classifier',
          body: 'The recommendation reasoning matters as much as the result. A vision LLM returns human-readable explanations; a closed-set classifier only returns a label.',
        },
        {
          title: 'Python backend for CV logic',
          body: 'Keeps the computer-vision stack (OpenCV, MediaPipe, numpy) native and readable. Browser-side CV would have worked but added friction with no upside.',
        },
      ],
      metrics: [
        { number: '30', suffix: 'fps', label: 'live face detection' },
        { number: '1', suffix: 's', label: 'tone analysis latency' },
        { number: '0', suffix: '', label: 'training required' },
      ],
      lessons:
        "Sometimes the best ML decision is knowing when not to train your own model. Claude Vision plus good prompting outperformed a custom classifier I'd prototyped, in half the dev time.",
    },
  },
  {
    id: 'trippy',
    tab: 'projects',
    title: 'Trippy',
    tagline: 'Group trip planning, built around consensus',
    blurb:
      'Collaborative trip planner for groups — vote on flights and stays, rate activities with an 80% consensus rule, and walk away with a day-by-day itinerary everyone agreed on.',
    stack: ['Next.js 14', 'TypeScript', 'Tailwind CSS', 'React', 'Local Storage'],
    github: 'https://github.com/stupnd/trippy',
    highlights: [
      'Shareable trips via invite link — no auth friction for collaborators.',
      '80% consensus rule on activities, voting on flights + stays, veto-free.',
      'Seven core modules: creation, invites, flights, stays, activities, itinerary, public overview.',
      'In-memory MVP store with a clean swap path to Supabase.',
    ],
    role: 'Product + full-stack, hackathon build',
    accent: 'forest',
    caseStudy: {
      problem:
        "Group trips fall apart in the planning phase — one person books a flight everyone hates, someone vetoes the Airbnb last minute, and the itinerary never gets finished. There's no tool built around group consensus, only solo planning tools used awkwardly by groups.",
      pullQuote:
        "The hardest product problem wasn't the tech — it was deciding what \"agreement\" means for a group. The 80% rule was the design insight that made everything else feel fair.",
      decisions: [
        {
          title: '80% consensus, not unanimous',
          body: "Unanimous kills momentum — one hold-out stalls the whole group. 80% keeps the trip moving while still feeling fair. That threshold was the design insight, not the code.",
        },
        {
          title: 'Invite-via-link, no auth',
          body: 'Zero friction for collaborators. The person planning the trip is the only one who needs an account; everyone else joins in one click.',
        },
        {
          title: 'In-memory store (for now)',
          body: 'Intentionally simple for hackathon speed — a clean module boundary so swapping to Supabase is a one-file change when usage justifies it.',
        },
      ],
      metrics: [
        { number: '7', suffix: '', label: 'core modules shipped' },
        { number: '80', suffix: '%', label: 'consensus threshold' },
        { number: '1', suffix: '', label: 'hackathon MVP' },
      ],
      lessons:
        "The hardest product problem wasn't the tech — it was deciding what \"agreement\" means for a group. The 80% rule was the design insight that made everything else feel fair.",
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
        'Wearable ASL translators typically route data through a phone server, adding round-trip latency that kills the real-time feel. Bridge moves classification onto the glove itself so gestures become text in under 100 ms.',
      pullQuote:
        'The glove does the inference; the phone is just a screen. That\'s what makes it feel alive.',
      decisions: [
        {
          title: 'On-device classification, not cloud inference',
          body: 'A compact classifier fits comfortably in ESP32 SRAM and keeps end-to-end latency under 100 ms even with BLE overhead.',
        },
        {
          title: 'React Native over native for cross-platform parity',
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
        "Embedded work is a latency budget. Every stage — sensor → ADC → classifier → BLE → UI — eats milliseconds you don't get back. Profile early, trim ruthlessly.",
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
    line: "Incoming software developer co-op in the TrendAI division, working on ML pipelines behind AI-driven cybersecurity threat detection. Role starts May 2026 — expected to sit at the intersection of Python, modern ML tooling, and cloud infrastructure.",
    tags: ['Python', 'ML pipelines', 'Cloud infra', 'Security ML'],
  },
  {
    id: 'solace',
    tab: 'experience',
    company: 'Solace',
    sub: null,
    title: 'Support Engineer Intern',
    dates: 'Sep – Dec 2025',
    line: 'Debugged production issues in distributed event broker systems (PubSub+) for enterprise clients. Advised customers on cloud architecture across AWS, Azure, and GCP; built strong intuition for pub/sub + event-driven systems at scale.',
    tags: ['PubSub+', 'Event brokers', 'AWS', 'Azure', 'GCP'],
  },
  {
    id: 'nrcan',
    tab: 'experience',
    company: 'Natural Resources Canada',
    sub: null,
    title: 'Software Engineering Intern',
    dates: 'May 2024 – Aug 2025 · 3 terms',
    line: 'Three co-op terms building internal tooling for a federal science organization. Shipped Salesforce automation workflows that cut manual processing time, optimized Oracle DB queries, and wrote C# + Apex data pipelines tying the two worlds together.',
    tags: ['Salesforce', 'Apex', 'C#', 'Oracle SQL', 'SQL Server'],
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
    if (e.tags?.length) lines.push(`Stack: ${e.tags.join(', ')}`)
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
  trippy: { tab: 'projects', label: 'Trippy' },
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
  'What did she build at Trippy?',
  "What's her hardware experience?",
  'Is she available for new grad?',
]
