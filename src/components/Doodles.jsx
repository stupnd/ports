// Hand-drawn SVG doodles — pen-annotation style.
// All doodles: stroke #E8521A terracotta (overridable), stroke-width 2, fill none.

const baseProps = {
  fill: 'none',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
}

export function WavyUnderline({
  className = '',
  stroke = '#E8521A',
  strokeWidth = 2,
}) {
  return (
    <svg viewBox="0 0 200 14" {...baseProps} stroke={stroke} strokeWidth={strokeWidth} className={className}>
      <path d="M3 9 C 28 2, 52 14, 78 7 S 130 1, 156 9 S 188 4, 197 8" />
    </svg>
  )
}

export function HandCircle({
  className = '',
  stroke = '#E8521A',
  strokeWidth = 2,
}) {
  return (
    <svg viewBox="0 0 200 100" {...baseProps} stroke={stroke} strokeWidth={strokeWidth} className={className}>
      <path d="M170 18 C 110 2, 30 8, 16 40 C 6 72, 60 94, 130 90 C 184 86, 198 60, 186 36 C 176 18, 140 10, 96 14" />
    </svg>
  )
}

export function HandArrow({
  className = '',
  stroke = '#E8521A',
  strokeWidth = 2,
}) {
  return (
    <svg viewBox="0 0 140 80" {...baseProps} stroke={stroke} strokeWidth={strokeWidth} className={className}>
      <path d="M6 12 C 30 6, 70 14, 96 40 C 108 52, 118 62, 126 70" />
      <path d="M126 70 L 114 68" />
      <path d="M126 70 L 122 58" />
    </svg>
  )
}

export function HandStar({
  className = '',
  stroke = '#E8521A',
  strokeWidth = 2,
}) {
  return (
    <svg viewBox="0 0 48 48" {...baseProps} stroke={stroke} strokeWidth={strokeWidth} className={className}>
      <path d="M24 6 V42 M6 24 H42 M11 11 L37 37 M37 11 L11 37" />
    </svg>
  )
}

export function HandBracket({
  className = '',
  stroke = '#E8521A',
  strokeWidth = 2,
}) {
  return (
    <svg viewBox="0 0 200 24" {...baseProps} stroke={stroke} strokeWidth={strokeWidth} className={className}>
      <path d="M4 6 C 6 18, 14 20, 24 20 L 176 20 C 186 20, 194 18, 196 6" />
    </svg>
  )
}
