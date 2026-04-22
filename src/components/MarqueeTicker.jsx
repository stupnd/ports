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
  direction = 'left',
  speed = 25,
  className = '',
}) {
  // Duplicate items so the CSS `translateX(-50%)` loop is seamless.
  const content = [...items, ...items]
  const isLight = tone === 'light'
  const isReverse = direction === 'right'

  // Light tone: no painted band — text + mask only so Hero blobs / page bg show
  // through (including on mobile). Dark tone keeps the ink bar + edge fades.
  const surface = isLight ? 'bg-transparent' : 'bg-ink'
  const textColor = isLight ? 'text-ink/70' : 'text-bg'
  const maskStyle = isLight
    ? {
        WebkitMaskImage:
          'linear-gradient(to right, transparent 0, #000 64px, #000 calc(100% - 64px), transparent 100%)',
        maskImage:
          'linear-gradient(to right, transparent 0, #000 64px, #000 calc(100% - 64px), transparent 100%)',
      }
    : undefined

  return (
    <div
      className={`relative w-full py-3 ${surface} ${className}`}
      aria-label="About at a glance"
    >
      <div className="relative overflow-hidden" style={isLight ? maskStyle : undefined}>
        <div
          className={`marquee-track flex w-max whitespace-nowrap${
            isReverse ? ' is-reverse' : ''
          }`}
          style={{ animationDuration: `${speed}s` }}
        >
          {content.map((item, i) => (
            <div key={`${item}-${i}`} className="flex items-center">
              <span className={`eyebrow px-7 ${textColor}`}>{item}</span>
              <span className="text-terracotta" aria-hidden>
                ✦
              </span>
            </div>
          ))}
        </div>
      </div>

      {!isLight ? (
        <>
          <div
            className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-ink to-transparent"
          />
          <div
            className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-ink to-transparent"
          />
        </>
      ) : null}
    </div>
  )
}
