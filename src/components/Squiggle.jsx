export default function Squiggle({ className = '', stroke = '#E8521A', strokeWidth = 2 }) {
  return (
    <svg
      viewBox="0 0 360 20"
      fill="none"
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      <path d="M4 14 C 50 4, 110 18, 170 10 S 270 2, 330 14 S 352 8, 356 12" />
    </svg>
  )
}
