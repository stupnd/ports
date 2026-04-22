import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/** Absolute origin for Open Graph URLs (must match the URL people share). */
function openGraphOrigin() {
  const fromEnv = process.env.VITE_SITE_URL?.trim().replace(/\/$/, '')
  if (fromEnv) return fromEnv
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return 'https://stuti.tech'
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'html-open-graph-origin',
      transformIndexHtml(html) {
        const origin = openGraphOrigin()
        const image = `${origin}/og.png`
        return html
          .replaceAll('__OG_ORIGIN__', origin)
          .replaceAll('__OG_IMAGE__', image)
      },
    },
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/framer-motion') || id.includes('node_modules/motion')) {
            return 'motion'
          }
        },
      },
    },
  },
})
