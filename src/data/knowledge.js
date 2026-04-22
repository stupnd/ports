// Single source of truth for Stuti's portfolio content.
// Consumed by UI components (project case studies, experience cards, etc.).
// Keep entries small and factual.

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
  tagline: 'Computer engineering at uOttawa. AI, full stack, and embedded.',
  summary:
    'Fourth-year Computer Engineering at uOttawa, graduating December 2026. Work spans AI/ML apps, full-stack web, and embedded. IEEE WIE Chair 2026–27. Grace Hopper 2026. Co-runs Lil Bytes on Instagram with Krisha.',
  workingStyle:
    'Builds end to end. Uses Cursor + Claude for design notes and refactors. Prefers a working prototype over a long spec.',
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
      'Next.js + FastAPI app with Anthropic tool use, streaming tokens, and live market data in the chat.',
    stack: ['Next.js', 'FastAPI', 'Anthropic API', 'Supabase', 'Recharts'],
    github: 'https://github.com/stupnd/sage',
    live: 'https://pulse-ai-investing.vercel.app',
    highlights: [
      'Streaming Claude responses rendered into a Next.js chat UI.',
      'Agentic tool use: model calls live quote + chart tools, results stream back.',
      'FastAPI BFF keeps third-party API keys server-side and composes responses.',
      'Supabase auth + row-level security for per-user portfolios.',
    ],
    role: 'AI, full-stack',
    accent: 'cobalt',
    caseStudy: {
      problem:
        'Most investing tools dump raw tickers or give vague tips. I wanted a middle layer that can pull a live quote, explain it in plain language, and drop a chart in the thread without losing context.',
      pullQuote:
        'Streaming tokens turned out to be the trust layer. People relax when they can watch the model work instead of staring at a spinner.',
      decisions: [
        {
          title: 'Streaming responses, not batched',
          body: 'The UI stays warm during inference. Seeing tokens land answers “is this hung?” before the user has to ask.',
        },
        {
          title: 'Agentic tool use over RAG',
          body: 'Quotes and fundamentals are fetched mid-response from live APIs. Stale embeddings would lie about prices within minutes.',
        },
        {
          title: 'Supabase for auth + persistence',
          body: 'RLS and hosted auth in a small amount of SQL so the interesting work stayed in the app and the model layer.',
        },
      ],
      metrics: [
        { number: '2', suffix: 's', label: 'time to first token' },
        { number: '100', suffix: '%', label: 'answers grounded on live tools' },
      ],
      lessons:
        'Next step I care about: evals for tool-call accuracy and caching hot symbols so repeat questions stay cheap.',
    },
  },
  {
    id: 'glowmatch',
    tab: 'projects',
    title: 'GlowMatch',
    tagline: 'Real-time skin-tone analysis for makeup matching',
    blurb:
      'MediaPipe face mesh for skin-only pixels, plus Claude Vision for product names and short rationale.',
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
        'Online shade matching is either generic (“warm undertone”) or needs a human. Tools that auto-pick pixels often sample hair or the background.',
      pullQuote:
        'I prototyped a small classifier first. Claude Vision with tight prompts beat it on both quality and dev time, so I shipped the LLM path.',
      decisions: [
        {
          title: 'MediaPipe for landmarks',
          body: 'Sampling targets cheeks and forehead. The 468-point mesh runs locally at full frame rate.',
        },
        {
          title: 'Claude Vision over a custom classifier',
          body: 'Users get a sentence of reasoning with the shade name, not just a label from a softmax head.',
        },
        {
          title: 'Python backend for CV',
          body: 'OpenCV + MediaPipe + NumPy stay in one process I can read and profile. Browser CV would have split the stack for little gain here.',
        },
      ],
      metrics: [
        { number: '30', suffix: 'fps', label: 'live face detection' },
        { number: '1', suffix: 's', label: 'tone analysis latency' },
      ],
      lessons:
        'If I revisit it, I would log skin-tone stability across lighting and add a tiny calibration step up front.',
    },
  },
  {
    id: 'trippy',
    tab: 'projects',
    title: 'Trippy',
    tagline: 'Group trip planning, built around consensus',
    blurb:
      'Group trip planner: vote on flights and stays, rate activities with an 80% bar, export a shared itinerary.',
    stack: ['Next.js 14', 'TypeScript', 'Tailwind CSS', 'Local Storage'],
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
        'Group trips die in planning: someone books a flight the group hates, someone vetoes the Airbnb, the itinerary never ships. Solo planners are not built for group rules.',
      pullQuote:
        'The hard part was defining “agreed” for five people with different priorities. Fixing that threshold unlocked the rest of the UI.',
      decisions: [
        {
          title: '80% consensus, not unanimous',
          body: 'One holdout can stall a trip forever. Eighty percent kept momentum while still feeling fair in user tests.',
        },
        {
          title: 'Invite-via-link, no auth',
          body: 'Only the organizer needs an account. Everyone else lands from one URL.',
        },
        {
          title: 'In-memory store for the hackathon',
          body: 'One module boundary so swapping in Supabase later is a file swap, not a rewrite.',
        },
      ],
      metrics: [
        { number: '7', suffix: '', label: 'core modules' },
        { number: '80', suffix: '%', label: 'consensus threshold' },
      ],
      lessons:
        'When usage shows up, I would persist trips in Supabase and add light abuse checks on public invite links.',
    },
  },
  {
    id: 'bridge',
    tab: 'projects',
    title: 'Bridge',
    tagline: 'Capstone — real-time ASL translation glove',
    blurb:
      'Capstone: BLE flex sensors on an Arduino Nano ESP32, gesture frames to a React Native app for live ASL text.',
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
      caseStudyVariant: 'technical',
      problem:
        'Many glove prototypes bounce every frame to a phone or cloud for inference. That round trip reads sluggish on video. Bridge keeps classification on the MCU so text updates feel immediate.',
      pullQuote: null,
      systemNotes: [
        {
          title: 'Firmware path',
          body: '50 Hz sampling on flex + IMU, quantized features, small model in SRAM. BLE advertises a single GATT characteristic for packed int16 frames.',
        },
        {
          title: 'BLE framing',
          body: 'Hand-packed structs instead of JSON. Fewer bytes per gesture, simpler parser on both ends, easier to reason about under load.',
        },
        {
          title: 'React Native client',
          body: 'One codebase for iOS and Android. UI work stayed thin so most weeks went to sensors and the classifier.',
        },
      ],
      metrics: [
        { number: '50', suffix: 'Hz', label: 'sample rate' },
        { number: '95', suffix: '%', label: 'gesture accuracy (test set)' },
        { number: '80', suffix: 'ms', label: 'end-to-end latency' },
      ],
      lessons:
        'Every hop costs milliseconds: ADC, filter, classify, packetize, BLE, parse, render. I profiled each stage early instead of guessing where the budget went.',
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
    line: 'Incoming software developer co-op in the TrendAI division, on ML pipelines for AI-assisted threat detection. Starts May 2026. Expect Python services, model tooling, and cloud deploys once I am on the team.',
    tags: ['Python', 'ML pipelines', 'Cloud infra', 'Security ML'],
  },
  {
    id: 'solace',
    tab: 'experience',
    company: 'Solace',
    sub: null,
    title: 'Support Engineer Intern',
    dates: 'Sep – Dec 2025',
    line: 'Production debugging on distributed PubSub+ brokers for enterprise clients (trading, airlines, large SaaS backends). Helped customers pick AWS, Azure, or GCP layouts for event-driven systems.',
    tags: ['PubSub+', 'Event brokers', 'AWS', 'Azure', 'GCP'],
  },
  {
    id: 'nrcan',
    tab: 'experience',
    company: 'Natural Resources Canada',
    sub: null,
    title: 'Software Engineering Intern',
    dates: 'May 2024 – Aug 2025 · 3 terms',
    line: 'Three co-op terms building internal tooling for a federal science org. Salesforce apps in Apex and LWC, automation that cut manual processing, Oracle tuning, and C# + Apex pipelines between legacy and cloud.',
    tags: ['Salesforce', 'Apex', 'C#', 'Oracle SQL', 'SQL Server'],
  },
]

export const wie = {
  id: 'wie',
  tab: 'about',
  title: 'IEEE Women in Engineering — uOttawa',
  role: 'Vice Chair (2024–25) → Chair (2025–26 & 2026–27)',
  summary:
    'Two-year tenure chairing one of the most active IEEE student branches on campus. Organized the inaugural WIE hackathon (100+ students), led Git / React / Docker workshops, ran a mentorship program, and organized WIPS 2026 — a speed-networking and awards night.',
  highlights: [
    "Organized uOttawa WIE's first-ever hackathon — 100+ students.",
    'Ran technical workshops on Git, React, and Docker.',
    'Built a mentorship program pairing upper-years with first- and second-years.',
    'Organized WIPS 2026 — speed-networking + awards for IEEE WIE.',
  ],
}

export const beyond = {
  id: 'beyond',
  tab: 'about',
  title: 'Beyond the code',
  summary:
    'Fiction reader, digicam photographer, and always hunting a good meal in a new city. Co-runs Lil Bytes on Instagram with Krisha (short explainers on CS topics).',
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
    a: 'Mix of full-stack AI apps, computer vision / ML, and embedded C on microcontrollers. Ships deployed apps and hardware demos, not only coursework.',
  },
  { q: 'GitHub?', a: 'github.com/stupnd' },
  {
    q: 'Lil Bytes?',
    a: 'Tech-education Instagram she co-runs with Krisha: short posts that unpack CS and engineering ideas for a general audience.',
  },
]
