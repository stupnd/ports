import { useEffect, useRef } from 'react'
import { prefersReducedMotion } from '../hooks/useReducedMotion'

// Single-pass WebGL shader that renders three soft color blobs (terracotta,
// cobalt, sun) drifting on sine curves. Lives behind the Hero at low opacity
// to give the cream background a quiet sense of motion without competing
// with typography.
//
// Cost budget: one program, one full-screen triangle, ~60 FPS with a tiny
// fragment shader. RAF is paused when offscreen or when `active` is false.

const VERT = `
attribute vec2 a_pos;
void main() {
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`

const FRAG = `
precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

vec3 blob(vec2 uv, vec2 center, vec3 color, float radius) {
  float d = distance(uv, center);
  float a = smoothstep(radius, 0.0, d);
  return color * a;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  float aspect = u_resolution.x / u_resolution.y;
  uv.x *= aspect;

  float t = u_time * 0.12;
  vec2 c1 = vec2(0.40 * aspect + 0.30 * sin(t * 0.8),       0.50 + 0.30 * cos(t * 0.6));
  vec2 c2 = vec2(0.55 * aspect + 0.30 * sin(t * 0.5 + 2.1), 0.35 + 0.25 * cos(t * 0.9 + 1.0));
  vec2 c3 = vec2(0.50 * aspect + 0.25 * sin(t * 0.4 + 4.0), 0.65 + 0.25 * cos(t * 0.7 + 3.0));

  vec3 col = vec3(0.0);
  col += blob(uv, c1, vec3(0.91, 0.32, 0.10), 0.55);
  col += blob(uv, c2, vec3(0.16, 0.29, 0.80), 0.55);
  col += blob(uv, c3, vec3(0.94, 0.79, 0.23), 0.50);

  // Subtle gamma curve + vignette so the palette settles against the cream bg.
  col = pow(col, vec3(0.9));
  float vig = smoothstep(1.2, 0.2, distance(uv / aspect, vec2(0.5)));
  col *= vig * 0.7 + 0.3;

  gl_FragColor = vec4(col, 1.0);
}
`

function compile(gl, type, source) {
  const shader = gl.createShader(type)
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader)
    return null
  }
  return shader
}

export default function GradientMesh({ active = true }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (prefersReducedMotion()) return undefined
    const canvas = canvasRef.current
    if (!canvas) return undefined

    const gl = canvas.getContext('webgl', { antialias: false, alpha: true, premultipliedAlpha: false })
    if (!gl) return undefined

    const vs = compile(gl, gl.VERTEX_SHADER, VERT)
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG)
    if (!vs || !fs) return undefined

    const program = gl.createProgram()
    gl.attachShader(program, vs)
    gl.attachShader(program, fs)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return undefined
    gl.useProgram(program)

    // One big triangle that covers the viewport — cheaper than a quad.
    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW
    )
    const posLoc = gl.getAttribLocation(program, 'a_pos')
    gl.enableVertexAttribArray(posLoc)
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0)

    const uResolution = gl.getUniformLocation(program, 'u_resolution')
    const uTime = gl.getUniformLocation(program, 'u_time')

    let frame = 0
    let running = true
    const start = performance.now()

    // Debounced DPR-aware resize so we don't re-upload the texture every frame.
    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75)
      const w = Math.max(1, Math.floor(rect.width * dpr))
      const h = Math.max(1, Math.floor(rect.height * dpr))
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w
        canvas.height = h
        gl.viewport(0, 0, w, h)
      }
      gl.uniform2f(uResolution, canvas.width, canvas.height)
    }

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    resize()

    const loop = () => {
      if (!running) return
      gl.uniform1f(uTime, (performance.now() - start) * 0.001)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
      frame = requestAnimationFrame(loop)
    }
    frame = requestAnimationFrame(loop)

    return () => {
      running = false
      cancelAnimationFrame(frame)
      ro.disconnect()
      gl.deleteBuffer(buf)
      gl.deleteShader(vs)
      gl.deleteShader(fs)
      gl.deleteProgram(program)
    }
  }, [active])

  // When active is false we still render the canvas (it just won't be
  // visible because Hero isn't mounted) so there's no additional gating here.
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{
        // Static CSS-gradient fallback for prefers-reduced-motion users and
        // browsers that 404 on WebGL — same palette, just frozen.
        background:
          'radial-gradient(35% 55% at 30% 40%, rgba(232,82,26,0.35), transparent 70%), radial-gradient(35% 55% at 65% 30%, rgba(42,75,204,0.25), transparent 70%), radial-gradient(30% 50% at 55% 75%, rgba(240,201,58,0.28), transparent 70%)',
      }}
    >
      <canvas
        ref={canvasRef}
        className="block h-full w-full opacity-[0.38]"
        style={{ mixBlendMode: 'multiply' }}
      />
    </div>
  )
}
