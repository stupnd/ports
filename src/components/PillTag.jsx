const TONES = {
  terracotta: {
    bg: 'bg-terracotta/10',
    text: 'text-terracotta',
    ring: 'ring-terracotta/20',
  },
  cobalt: {
    bg: 'bg-cobalt/10',
    text: 'text-cobalt',
    ring: 'ring-cobalt/20',
  },
  sun: {
    bg: 'bg-sun/20',
    text: 'text-ink',
    ring: 'ring-sun/40',
  },
  forest: {
    bg: 'bg-forest/10',
    text: 'text-forest',
    ring: 'ring-forest/25',
  },
  ink: {
    bg: 'bg-ink/5',
    text: 'text-ink/85',
    ring: 'ring-ink/15',
  },
  terracottaSolid: {
    bg: 'bg-terracotta',
    text: 'text-bg',
    ring: 'ring-terracotta/30',
  },
  cobaltSolid: {
    bg: 'bg-cobalt',
    text: 'text-bg',
    ring: 'ring-cobalt/30',
  },
  sunSolid: {
    bg: 'bg-sun',
    text: 'text-ink',
    ring: 'ring-sun/50',
  },
  forestSolid: {
    bg: 'bg-forest',
    text: 'text-bg',
    ring: 'ring-forest/30',
  },
}

export default function PillTag({
  children,
  tone = 'terracotta',
  rotate,
  size = 'sm',
  className = '',
}) {
  const t = TONES[tone] ?? TONES.terracotta
  const rotateStyle =
    rotate !== undefined ? { transform: `rotate(${rotate}deg)` } : undefined

  const sizing =
    size === 'md'
      ? 'px-4 py-1.5 text-xs'
      : size === 'lg'
        ? 'px-5 py-2 text-sm'
        : 'px-3 py-1 text-[0.7rem]'

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full ring-1 font-semibold uppercase tracking-[0.12em] ${sizing} ${t.bg} ${t.text} ${t.ring} ${className}`}
      style={rotateStyle}
    >
      {children}
    </span>
  )
}
