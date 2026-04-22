import { lazy, Suspense } from 'react'

// Map project id → lazy-loaded preview component. Each preview is lightweight
// (mostly SVG) and pauses itself when offscreen via useVisible.
const previews = {
  sage: lazy(() => import('./SagePreview')),
  glowmatch: lazy(() => import('./GlowMatchPreview')),
  bridge: lazy(() => import('./BridgePreview')),
}

export default function ProjectPreview({ id }) {
  const Preview = previews[id]
  if (!Preview) return null
  return (
    <Suspense fallback={null}>
      <Preview />
    </Suspense>
  )
}
