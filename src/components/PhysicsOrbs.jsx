import { useEffect, useRef } from 'react'

// Orb palette — each entry is a visual variant + initial position (as a
// fraction of the container size) and a mass. Radii are in px, doubled for
// the box dimensions (so r = 120 → 240px box).
const ORBS = [
  {
    id: 'orange',
    xPct: 0.82,
    yPct: 0.15,
    // Sized down ~22% so the name is the clear first read.
    r: 172,
    rMobile: 118,
    mass: 1.9,
    bg:
      'radial-gradient(circle at 32% 28%, rgba(255,222,196,0.95), rgba(241,118,56,1) 38%, rgba(176,52,12,1) 82%, rgba(120,28,0,1) 100%)',
    shadow:
      '0 60px 120px -20px rgba(232,82,26,0.4), inset -22px -32px 70px rgba(80,20,0,0.45)',
  },
  {
    id: 'blue',
    xPct: 0.08,
    yPct: 0.82,
    r: 155,
    rMobile: 110,
    mass: 1.9,
    bg:
      'radial-gradient(circle at 34% 30%, rgba(205,222,255,0.92), rgba(72,116,206,1) 42%, rgba(28,54,132,1) 88%, rgba(10,24,72,1) 100%)',
    shadow:
      '0 50px 110px -20px rgba(40,74,158,0.45), inset -18px -28px 60px rgba(0,10,40,0.4)',
  },
  {
    id: 'sun',
    xPct: 0.48,
    yPct: 0.5,
    r: 50,
    rMobile: 38,
    mass: 0.55,
    bg:
      'radial-gradient(circle at 34% 30%, rgba(255,245,210,0.95), rgba(240,201,58,1) 48%, rgba(188,140,20,1) 100%)',
    shadow:
      '0 20px 40px -10px rgba(240,201,58,0.55), inset -8px -12px 24px rgba(120,80,0,0.32)',
  },
  {
    id: 'peach',
    xPct: 0.2,
    yPct: 0.28,
    r: 85,
    rMobile: 60,
    mass: 1.0,
    bg:
      'radial-gradient(circle at 32% 28%, rgba(255,232,216,0.96), rgba(247,166,138,1) 44%, rgba(204,102,72,1) 100%)',
    shadow:
      '0 28px 60px -16px rgba(232,130,90,0.4), inset -10px -16px 36px rgba(120,40,20,0.32)',
  },
  {
    id: 'mint',
    xPct: 0.7,
    yPct: 0.88,
    r: 100,
    rMobile: 72,
    mass: 1.2,
    bg:
      'radial-gradient(circle at 34% 28%, rgba(224,250,232,0.95), rgba(120,196,156,1) 42%, rgba(40,108,76,1) 100%)',
    shadow:
      '0 32px 70px -18px rgba(60,140,100,0.4), inset -12px -18px 40px rgba(10,48,30,0.32)',
  },
]

// Circle-vs-AABB collision. `rect` is container-local {left,top,right,bottom}.
// Handles the rare "circle center landed inside rect" case by ejecting out the
// nearest edge so orbs never get permanently trapped inside the name bubble.
function resolveObstacle(o, rect, restitution) {
  if (!rect) return
  const closestX = Math.max(rect.left, Math.min(o.x, rect.right))
  const closestY = Math.max(rect.top, Math.min(o.y, rect.bottom))
  const dx = o.x - closestX
  const dy = o.y - closestY
  const distSq = dx * dx + dy * dy
  if (distSq >= o.r * o.r) return
  if (distSq === 0) {
    // Center inside — push out the nearest side
    const leftD = o.x - rect.left
    const rightD = rect.right - o.x
    const topD = o.y - rect.top
    const bottomD = rect.bottom - o.y
    const minD = Math.min(leftD, rightD, topD, bottomD)
    if (minD === leftD) {
      o.x = rect.left - o.r
      o.vx = -Math.abs(o.vx) * restitution
    } else if (minD === rightD) {
      o.x = rect.right + o.r
      o.vx = Math.abs(o.vx) * restitution
    } else if (minD === topD) {
      o.y = rect.top - o.r
      o.vy = -Math.abs(o.vy) * restitution
    } else {
      o.y = rect.bottom + o.r
      o.vy = Math.abs(o.vy) * restitution
    }
    return
  }
  const dist = Math.sqrt(distSq)
  const nx = dx / dist
  const ny = dy / dist
  const overlap = o.r - dist
  if (!o.dragging) {
    o.x += nx * overlap
    o.y += ny * overlap
    const vn = o.vx * nx + o.vy * ny
    if (vn < 0) {
      o.vx -= (1 + restitution) * vn * nx
      o.vy -= (1 + restitution) * vn * ny
    }
  }
}

function resolveCollision(a, b) {
  const dx = b.x - a.x
  const dy = b.y - a.y
  const distSq = dx * dx + dy * dy
  const minDist = a.r + b.r
  if (distSq >= minDist * minDist) return
  const dist = Math.sqrt(distSq) || 0.0001
  const nx = dx / dist
  const ny = dy / dist
  const overlap = minDist - dist
  // Positional correction proportional to mass ratio
  const totalMass = a.m + b.m
  if (!a.dragging) {
    a.x -= nx * overlap * (b.m / totalMass)
    a.y -= ny * overlap * (b.m / totalMass)
  }
  if (!b.dragging) {
    b.x += nx * overlap * (a.m / totalMass)
    b.y += ny * overlap * (a.m / totalMass)
  }
  // Velocity along normal
  const dvx = b.vx - a.vx
  const dvy = b.vy - a.vy
  const vn = dvx * nx + dvy * ny
  if (vn > 0) return // Already separating
  const restitution = 0.85
  const impulse = (-(1 + restitution) * vn) / (1 / a.m + 1 / b.m)
  const ix = impulse * nx
  const iy = impulse * ny
  if (!a.dragging) {
    a.vx -= ix / a.m
    a.vy -= iy / a.m
  }
  if (!b.dragging) {
    b.vx += ix / b.m
    b.vy += iy / b.m
  }
}

export default function PhysicsOrbs({ containerRef, obstacleRef, onFirstDrag }) {
  // Lazy-initialize orb states on first render so ref callbacks (which fire
  // during commit, BEFORE useEffect) can attach DOM elements directly. Without
  // this, in production (no StrictMode double-mount) orbs never get wired up
  // to the simulation and stay invisible off-screen.
  const orbStates = useRef(null)
  if (orbStates.current === null) {
    orbStates.current = ORBS.map((orb) => ({
      id: orb.id,
      r: orb.r,
      m: orb.mass,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      dragging: false,
      el: null,
      visible: false,
      seeded: false,
    }))
  }
  const dragRef = useRef(null)
  const onFirstDragRef = useRef(onFirstDrag)
  onFirstDragRef.current = onFirstDrag
  const firedFirstDragRef = useRef(false)
  const rectRef = useRef({ width: 0, height: 0 })

  useEffect(() => {
    const container = containerRef.current
    if (!container) return undefined

    const measure = () => {
      const r = container.getBoundingClientRect()
      rectRef.current = { width: r.width, height: r.height }
    }
    measure()

    const isMobile = window.matchMedia('(max-width: 767px)').matches
    const { width, height } = rectRef.current
    // Seed real positions/radii now that we have a measured container. We
    // preserve any refs + velocities already on the orb objects.
    for (let i = 0; i < orbStates.current.length; i++) {
      const orb = ORBS[i]
      const state = orbStates.current[i]
      if (!state.seeded) {
        state.r = isMobile ? orb.rMobile : orb.r
        state.x = orb.xPct * width
        state.y = orb.yPct * height
        state.seeded = true
      } else {
        // Container resized — clamp back into bounds
        state.x = Math.min(Math.max(state.r, state.x), width - state.r)
        state.y = Math.min(Math.max(state.r, state.y), height - state.r)
      }
    }

    const ro = new ResizeObserver(() => {
      measure()
      // Clamp orbs inside new bounds
      const { width: w, height: h } = rectRef.current
      for (const o of orbStates.current) {
        if (o.x < o.r) o.x = o.r
        if (o.x > w - o.r) o.x = w - o.r
        if (o.y < o.r) o.y = o.r
        if (o.y > h - o.r) o.y = h - o.r
      }
    })
    ro.observe(container)

    let last = performance.now()
    let rafId = 0
    const DAMPING = 0.994
    const WALL_RESTITUTION = 0.82
    const MIN_V = 0.5

    const step = (now) => {
      const dt = Math.min(0.032, (now - last) / 1000)
      last = now
      const { width: w, height: h } = rectRef.current
      const orbs = orbStates.current

      // Measure the name-bubble obstacle once per frame, in container-local
      // coords. Reading getBoundingClientRect twice is cheap for a single
      // element and keeps collisions accurate even as the card reflows.
      let obstacleRect = null
      const obstacleEl = obstacleRef?.current
      if (obstacleEl && container) {
        const cr = container.getBoundingClientRect()
        const orr = obstacleEl.getBoundingClientRect()
        obstacleRect = {
          left: orr.left - cr.left,
          top: orr.top - cr.top,
          right: orr.right - cr.left,
          bottom: orr.bottom - cr.top,
        }
      }

      // Integrate + wall collisions
      for (const o of orbs) {
        if (o.dragging) continue
        o.x += o.vx * dt
        o.y += o.vy * dt
        o.vx *= DAMPING
        o.vy *= DAMPING
        if (Math.abs(o.vx) < MIN_V) o.vx = 0
        if (Math.abs(o.vy) < MIN_V) o.vy = 0
        if (o.x < o.r) {
          o.x = o.r
          o.vx = Math.abs(o.vx) * WALL_RESTITUTION
        } else if (o.x > w - o.r) {
          o.x = w - o.r
          o.vx = -Math.abs(o.vx) * WALL_RESTITUTION
        }
        if (o.y < o.r) {
          o.y = o.r
          o.vy = Math.abs(o.vy) * WALL_RESTITUTION
        } else if (o.y > h - o.r) {
          o.y = h - o.r
          o.vy = -Math.abs(o.vy) * WALL_RESTITUTION
        }
      }

      // Bounce orbs off the name bubble
      if (obstacleRect) {
        for (const o of orbs) {
          resolveObstacle(o, obstacleRect, WALL_RESTITUTION)
        }
      }

      // Pairwise orb-orb collisions (O(n²), fine for ≤10 orbs)
      for (let i = 0; i < orbs.length; i++) {
        for (let j = i + 1; j < orbs.length; j++) {
          resolveCollision(orbs[i], orbs[j])
        }
      }

      // Write transforms. First paint also flips opacity → 1 so orbs never
      // flash at 0,0 before the container measure lands.
      for (const o of orbs) {
        if (o.el) {
          o.el.style.transform = `translate3d(${o.x - o.r}px, ${o.y - o.r}px, 0)`
          if (!o.visible) {
            o.el.style.opacity = '1'
            o.visible = true
          }
        }
      }

      rafId = requestAnimationFrame(step)
    }
    rafId = requestAnimationFrame(step)

    return () => {
      cancelAnimationFrame(rafId)
      ro.disconnect()
    }
  }, [containerRef, obstacleRef])

  // Global pointer handlers for drag follow + release
  useEffect(() => {
    const onMove = (e) => {
      const d = dragRef.current
      if (!d) return
      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect) return
      const px = e.clientX - rect.left
      const py = e.clientY - rect.top
      const orb = orbStates.current[d.index]
      if (!orb) return
      orb.x = px - d.offsetX
      orb.y = py - d.offsetY
      // Track velocity in px/sec using recent sample
      const now = performance.now()
      const dt = Math.max(0.004, (now - d.lastTime) / 1000)
      d.velX = (px - d.lastX) / dt
      d.velY = (py - d.lastY) / dt
      d.lastX = px
      d.lastY = py
      d.lastTime = now
    }
    const onUp = () => {
      const d = dragRef.current
      if (!d) return
      const orb = orbStates.current[d.index]
      if (orb) {
        orb.dragging = false
        const cap = 1800
        orb.vx = Math.max(-cap, Math.min(cap, d.velX || 0))
        orb.vy = Math.max(-cap, Math.min(cap, d.velY || 0))
      }
      dragRef.current = null
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
    }
  }, [containerRef])

  const handlePointerDown = (i) => (e) => {
    if (e.button !== undefined && e.button !== 0) return
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    const orb = orbStates.current[i]
    if (!orb) return
    const px = e.clientX - rect.left
    const py = e.clientY - rect.top
    orb.dragging = true
    orb.vx = 0
    orb.vy = 0
    dragRef.current = {
      index: i,
      offsetX: px - orb.x,
      offsetY: py - orb.y,
      lastX: px,
      lastY: py,
      lastTime: performance.now(),
      velX: 0,
      velY: 0,
    }
    try {
      e.currentTarget.setPointerCapture?.(e.pointerId)
    } catch {
      /* noop */
    }
    if (!firedFirstDragRef.current) {
      firedFirstDragRef.current = true
      onFirstDragRef.current?.()
    }
  }

  const isMobile =
    typeof window !== 'undefined'
      ? window.matchMedia('(max-width: 767px)').matches
      : false

  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      {ORBS.map((orb, i) => {
        const r = isMobile ? orb.rMobile : orb.r
        return (
          <div
            key={orb.id}
            ref={(el) => {
              const existing = orbStates.current[i]
              if (existing) existing.el = el
            }}
            onPointerDown={handlePointerDown(i)}
            className="pointer-events-auto absolute left-0 top-0 cursor-grab touch-none will-change-transform active:cursor-grabbing"
            style={{
              width: r * 2,
              height: r * 2,
              borderRadius: '50%',
              background: orb.bg,
              boxShadow: orb.shadow,
              opacity: 0,
              transition: 'opacity 280ms ease-out',
              transform: 'translate3d(-9999px,-9999px,0)',
            }}
          />
        )
      })}
    </div>
  )
}
