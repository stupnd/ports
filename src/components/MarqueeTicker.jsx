const DEFAULT_ITEMS = [
  'Computer Engineering @ uOttawa',
  'IEEE WIE Chair',
  'AI / ML',
  'Full Stack',
  'Embedded Systems',
  'Co-op @ TrendAI',
]

export default function MarqueeTicker({
  items = DEFAULT_ITEMS,
  tone = 'dark',
  className = '',
}) {
  const content = [...items, ...items]
  const isLight = tone === 'light'

  const surface = isLight
    ? 'bg-card ring-1 ring-ink/5'
    : 'bg-ink'
  const textColor = isLight ? 'text-ink/80' : 'text-bg'
  const fadeFrom = isLight ? 'from-card' : 'from-ink'

  return (
    <div
      className={`relative w-full overflow-hidden py-4 ${surface} ${className}`}
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
