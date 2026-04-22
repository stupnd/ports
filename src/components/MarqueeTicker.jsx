const DEFAULT_ITEMS = [
  'Computer Engineering @ uOttawa',
  'IEEE WIE Chair',
  'AI / ML engineer',
  'Full-stack + Embedded',
  'Incoming co-op @ TrendAI',
  'Next.js · FastAPI · Anthropic',
  'MediaPipe · Claude Vision',
  'React Native · Arduino · STM32',
  'Python · TypeScript · C/C++',
  'Supabase · Postgres · Docker',
  'Lil Bytes co-founder',
  'Grace Hopper 2026',
  'Available Jan 2027',
]

export default function MarqueeTicker({
  items = DEFAULT_ITEMS,
  tone = 'dark',
  className = '',
}) {
  // Duplicate items so the CSS `translateX(-50%)` loop is seamless.
  const content = [...items, ...items]
  const isLight = tone === 'light'

  // Light tone uses a fully transparent surface so the orbs behind can
  // show through. Edge fades use the hero's bg so text disappears against
  // the same color as the section.
  const surface = isLight ? 'bg-transparent' : 'bg-ink'
  const textColor = isLight ? 'text-ink/70' : 'text-bg'
  const fadeFrom = isLight ? 'from-bg' : 'from-ink'

  return (
    <div
      className={`relative w-full overflow-hidden py-3 ${surface} ${className}`}
      aria-label="About at a glance"
    >
      <div className="marquee-track flex w-max whitespace-nowrap">
        {content.map((item, i) => (
          <div key={`${item}-${i}`} className="flex items-center">
            <span className={`eyebrow px-7 ${textColor}`}>{item}</span>
            <span className="text-terracotta" aria-hidden>
              ✦
            </span>
          </div>
        ))}
      </div>

      <div
        className={`pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r ${fadeFrom} to-transparent`}
      />
      <div
        className={`pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l ${fadeFrom} to-transparent`}
      />
    </div>
  )
}
