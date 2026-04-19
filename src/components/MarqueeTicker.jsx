const DEFAULT_ITEMS = [
  'Computer Engineering @ uOttawa',
  'IEEE WIE Chair',
  'AI / ML',
  'Full Stack',
  'Embedded Systems',
  'Co-op @ TrendAI',
]

export default function MarqueeTicker({ items = DEFAULT_ITEMS }) {
  const content = [...items, ...items]

  return (
    <div
      className="relative w-full overflow-hidden bg-ink py-4"
      aria-label="About at a glance"
    >
      <div className="marquee-track flex w-max whitespace-nowrap">
        {content.map((item, i) => (
          <div key={`${item}-${i}`} className="flex items-center">
            <span className="eyebrow px-7 text-bg">{item}</span>
            <span className="text-terracotta" aria-hidden>
              ✦
            </span>
          </div>
        ))}
      </div>

      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-ink to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-ink to-transparent" />
    </div>
  )
}
