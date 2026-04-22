import { useEffect, useRef } from 'react'
import { gsap } from '../lib/scroll'
import { prefersReducedMotion } from '../hooks/useReducedMotion'

// Reusable architecture diagram.
// Takes nodes on a (col, row) grid and edges between node ids, renders them
// as SVG rectangles and curved paths. On scroll, node boxes fade/lift in and
// edge paths draw themselves with stroke-dasharray. Color scheme comes from
// the `accent` prop so each project's diagram inherits its tab color.

// Node sizing — all coordinates are in SVG user units.
const NODE_W = 150
const NODE_H = 60
const COL_GAP = 60
const ROW_GAP = 80

// Given (col, row) grid coords return the center of that node in SVG space.
function nodeCenter({ col, row }) {
  return {
    x: col * (NODE_W + COL_GAP) + NODE_W / 2,
    y: row * (NODE_H + ROW_GAP) + NODE_H / 2,
  }
}

// Connector path between two nodes. If they share a row we draw a smooth
// horizontal bezier; otherwise a cubic bezier that bends through the midpoint.
function edgePath(from, to) {
  const a = nodeCenter(from)
  const b = nodeCenter(to)
  const sameRow = from.row === to.row
  const sameCol = from.col === to.col

  if (sameRow) {
    const y = a.y
    const x1 = a.x + (to.col > from.col ? NODE_W / 2 : -NODE_W / 2)
    const x2 = b.x + (to.col > from.col ? -NODE_W / 2 : NODE_W / 2)
    const mx = (x1 + x2) / 2
    return `M ${x1} ${y} C ${mx} ${y}, ${mx} ${y}, ${x2} ${y}`
  }
  if (sameCol) {
    const x = a.x
    const y1 = a.y + (to.row > from.row ? NODE_H / 2 : -NODE_H / 2)
    const y2 = b.y + (to.row > from.row ? -NODE_H / 2 : NODE_H / 2)
    const my = (y1 + y2) / 2
    return `M ${x} ${y1} C ${x} ${my}, ${x} ${my}, ${x} ${y2}`
  }
  const x1 = a.x + (to.col > from.col ? NODE_W / 2 : -NODE_W / 2)
  const y1 = a.y
  const x2 = b.x
  const y2 = b.y + (to.row > from.row ? -NODE_H / 2 : NODE_H / 2)
  const cx = x2
  const cy = y1
  return `M ${x1} ${y1} C ${cx} ${y1}, ${cx} ${cy}, ${x2} ${y2}`
}

export default function ArchDiagram({ nodes, edges, accent = '#E8521A' }) {
  const rootRef = useRef(null)

  const cols = Math.max(...nodes.map((n) => n.col)) + 1
  const rows = Math.max(...nodes.map((n) => n.row)) + 1
  const width = cols * NODE_W + (cols - 1) * COL_GAP
  const height = rows * NODE_H + (rows - 1) * ROW_GAP

  const byId = Object.fromEntries(nodes.map((n) => [n.id, n]))
  const resolvedEdges = edges.map((e) => ({
    ...e,
    fromNode: byId[e.from],
    toNode: byId[e.to],
    path: edgePath(byId[e.from], byId[e.to]),
  }))

  useEffect(() => {
    if (prefersReducedMotion()) return undefined
    const el = rootRef.current
    if (!el) return undefined

    const scrollerEl = document.querySelector('#tab-panel')
    const pathEls = el.querySelectorAll('[data-arch-edge]')
    const nodeEls = el.querySelectorAll('[data-arch-node]')

    pathEls.forEach((p) => {
      try {
        const len = p.getTotalLength()
        p.style.strokeDasharray = `${len}`
        p.style.strokeDashoffset = `${len}`
      } catch {
        /* path length unavailable in jsdom / SSR — ignore */
      }
    })

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        scroller: scrollerEl || undefined,
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },
    })

    tl.fromTo(
      nodeEls,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', stagger: 0.08 }
    )
    tl.to(
      pathEls,
      {
        strokeDashoffset: 0,
        duration: 0.7,
        ease: 'power2.out',
        stagger: 0.08,
      },
      '-=0.25'
    )

    return () => {
      tl.scrollTrigger?.kill()
      tl.kill()
    }
  }, [nodes, edges])

  return (
    <div ref={rootRef} className="w-full overflow-x-auto">
      <svg
        viewBox={`-20 -20 ${width + 40} ${height + 40}`}
        width={width + 40}
        height={height + 40}
        className="block max-w-full"
        style={{ color: accent }}
        role="img"
        aria-label="Architecture diagram"
      >
        <defs>
          <marker
            id={`arrow-${accent.replace('#', '')}`}
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill={accent} />
          </marker>
        </defs>

        {/* Edges (behind nodes) */}
        {resolvedEdges.map((e, i) => (
          <g key={`edge-${i}`} style={{ color: accent }}>
            <path
              d={e.path}
              data-arch-edge
              fill="none"
              stroke={accent}
              strokeWidth="1.5"
              strokeLinecap="round"
              markerEnd={`url(#arrow-${accent.replace('#', '')})`}
              opacity="0.75"
            />
            {e.label ? (
              <EdgeLabel path={e.path} label={e.label} accent={accent} index={i} />
            ) : null}
          </g>
        ))}

        {/* Nodes (on top) */}
        {nodes.map((n) => {
          const c = nodeCenter(n)
          return (
            <g
              key={n.id}
              data-arch-node
              transform={`translate(${c.x - NODE_W / 2}, ${c.y - NODE_H / 2})`}
            >
              <rect
                width={NODE_W}
                height={NODE_H}
                rx={10}
                ry={10}
                fill="rgba(255,255,255,0.75)"
                stroke={accent}
                strokeWidth="1.5"
                style={{
                  filter: 'drop-shadow(0 6px 14px rgba(0,0,0,0.08))',
                }}
              />
              <text
                x={NODE_W / 2}
                y={NODE_H / 2}
                textAnchor="middle"
                dominantBaseline="middle"
                fontFamily="Inter, system-ui, sans-serif"
                fontSize="13"
                fontWeight="600"
                fill="#111"
              >
                {n.label.includes('\n') ? (
                  n.label.split('\n').map((line, i, arr) => (
                    <tspan
                      key={i}
                      x={NODE_W / 2}
                      dy={i === 0 ? -((arr.length - 1) * 7) : 14}
                    >
                      {line}
                    </tspan>
                  ))
                ) : (
                  n.label
                )}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

function EdgeLabel({ path, label, accent }) {
  // Render as a small text perched near the path midpoint.
  // Since we don't have ref access to getPointAtLength here without an effect,
  // fall back to placing the label near the midpoint by re-parsing the path.
  const parts = path.match(/-?\d+(\.\d+)?/g)
  if (!parts || parts.length < 4) return null
  const nums = parts.map((p) => parseFloat(p))
  const x = (nums[0] + nums[nums.length - 2]) / 2
  const y = (nums[1] + nums[nums.length - 1]) / 2
  return (
    <text
      x={x}
      y={y - 6}
      textAnchor="middle"
      fontFamily="Inter, system-ui, sans-serif"
      fontSize="10"
      fontWeight="600"
      fill={accent}
      style={{ pointerEvents: 'none', letterSpacing: '0.04em' }}
    >
      {label}
    </text>
  )
}
