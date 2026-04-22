import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Command } from 'cmdk'
import { projects, bio } from '../data/knowledge'

// Tabs list is intentionally hard-coded here (rather than imported from App)
// so the palette stays decoupled — it talks to App via the same
// 'portfolio:navigate' event bus that AskMeChat uses.
const tabs = [
  { id: 'home', label: 'Home', hint: 'Hero + Ask me anything' },
  { id: 'about', label: 'About', hint: 'Bio + currently' },
  { id: 'beyond', label: 'Beyond the Code', hint: 'Interests, photos' },
  { id: 'projects', label: 'Projects', hint: 'Things shipped' },
  { id: 'experience', label: 'Experience', hint: 'Work timeline' },
  { id: 'wie', label: 'WIE', hint: 'IEEE Women in Engineering' },
  { id: 'contact', label: 'Contact', hint: 'Email' },
]

function navigate(tabId) {
  window.dispatchEvent(new CustomEvent('portfolio:navigate', { detail: tabId }))
}

function openProject(id) {
  window.dispatchEvent(new CustomEvent('portfolio:navigate', { detail: 'projects' }))
  // Also fire an "open-project" event so Phase B2 (case-study view) can pick it up.
  window.dispatchEvent(new CustomEvent('portfolio:open-project', { detail: id }))
}

function copy(text) {
  navigator.clipboard?.writeText(text).catch(() => {})
}

function ShortcutKey({ children }) {
  return (
    <kbd className="inline-flex min-w-[22px] items-center justify-center rounded bg-ink/10 px-1.5 py-0.5 text-[10px] font-semibold text-ink/70 ring-1 ring-ink/10">
      {children}
    </kbd>
  )
}

// Detect macOS for rendering the correct meta-key glyph in hints.
function getMetaGlyph() {
  if (typeof navigator === 'undefined') return 'Ctrl'
  return /mac/i.test(navigator.platform) ? '\u2318' : 'Ctrl'
}

export default function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    const onKey = (e) => {
      const mod = e.metaKey || e.ctrlKey
      if (mod && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault()
        setOpen((v) => !v)
      } else if (e.key === 'Escape') {
        setOpen(false)
      }
    }
    const onToggle = () => setOpen((v) => !v)
    window.addEventListener('keydown', onKey)
    window.addEventListener('portfolio:toggle-cmdk', onToggle)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('portfolio:toggle-cmdk', onToggle)
    }
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    if (!toast) return undefined
    const id = window.setTimeout(() => setToast(null), 1800)
    return () => window.clearTimeout(id)
  }, [toast])

  function run(action) {
    setOpen(false)
    // Give the modal a tick to close before firing navigation so the
    // tab-transition curtain doesn't fight the exit animation.
    window.setTimeout(action, 30)
  }

  return (
    <>
      <AnimatePresence>
        {open ? (
          <motion.div
            key="cmdk"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="fixed inset-0 z-[100] flex items-start justify-center bg-ink/40 px-4 pt-24 backdrop-blur-[3px]"
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) setOpen(false)
            }}
          >
            <motion.div
              initial={{ y: -12, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -8, opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-xl overflow-hidden rounded-2xl bg-bg shadow-[0_40px_100px_-30px_rgba(0,0,0,0.5)] ring-1 ring-ink/15"
            >
              <Command
                label="Command palette"
                className="flex flex-col"
                filter={(value, search) => {
                  if (!search) return 1
                  return value.toLowerCase().includes(search.toLowerCase()) ? 1 : 0
                }}
              >
                <div className="flex items-center gap-3 border-b border-ink/10 px-4 py-3">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="shrink-0 text-muted"
                    aria-hidden
                  >
                    <circle cx="11" cy="11" r="7" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                  <Command.Input
                    autoFocus
                    placeholder="Search tabs, projects, actions…"
                    className="f-body flex-1 bg-transparent text-[15px] text-ink placeholder:text-muted/90 outline-none"
                  />
                  <span className="hidden items-center gap-1 text-[11px] text-muted sm:inline-flex">
                    <ShortcutKey>esc</ShortcutKey>
                  </span>
                </div>

                <Command.List className="max-h-[52vh] overflow-y-auto p-2">
                  <Command.Empty className="px-3 py-6 text-center text-sm text-muted">
                    No results.
                  </Command.Empty>

                  <Command.Group
                    heading="Tabs"
                    className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:pb-1.5 [&_[cmdk-group-heading]]:pt-2 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.16em] [&_[cmdk-group-heading]]:text-muted"
                  >
                    {tabs.map((t) => (
                      <Command.Item
                        key={t.id}
                        value={`tab ${t.label} ${t.hint}`}
                        onSelect={() => run(() => navigate(t.id))}
                        className="group flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm text-ink transition-colors data-[selected=true]:bg-terracotta data-[selected=true]:text-bg"
                      >
                        <span
                          aria-hidden
                          className="text-[13px] text-muted group-data-[selected=true]:text-bg"
                        >
                          →
                        </span>
                        <span className="font-medium">{t.label}</span>
                        <span className="ml-auto text-[12px] text-muted group-data-[selected=true]:text-bg/80">
                          {t.hint}
                        </span>
                      </Command.Item>
                    ))}
                  </Command.Group>

                  <Command.Group
                    heading="Projects"
                    className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:pb-1.5 [&_[cmdk-group-heading]]:pt-2 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.16em] [&_[cmdk-group-heading]]:text-muted"
                  >
                    {projects.map((p) => (
                      <Command.Item
                        key={p.id}
                        value={`project ${p.title} ${p.tagline} ${p.stack.join(' ')}`}
                        onSelect={() => run(() => openProject(p.id))}
                        className="group flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm text-ink transition-colors data-[selected=true]:bg-terracotta data-[selected=true]:text-bg"
                      >
                        <span
                          aria-hidden
                          className="text-[13px] text-muted group-data-[selected=true]:text-bg"
                        >
                          ◆
                        </span>
                        <span className="font-medium">{p.title}</span>
                        <span className="ml-auto text-[12px] text-muted group-data-[selected=true]:text-bg/80">
                          {p.tagline}
                        </span>
                      </Command.Item>
                    ))}
                  </Command.Group>

                  <Command.Group
                    heading="Actions"
                    className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:pb-1.5 [&_[cmdk-group-heading]]:pt-2 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.16em] [&_[cmdk-group-heading]]:text-muted"
                  >
                    <Command.Item
                      value="action copy email clipboard"
                      onSelect={() =>
                        run(() => {
                          copy(bio.email)
                          setToast('Email copied')
                        })
                      }
                      className="group flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm text-ink transition-colors data-[selected=true]:bg-terracotta data-[selected=true]:text-bg"
                    >
                      <span aria-hidden>⎘</span>
                      <span className="font-medium">Copy email</span>
                      <span className="ml-auto text-[12px] text-muted group-data-[selected=true]:text-bg/80">
                        {bio.email}
                      </span>
                    </Command.Item>

                    <Command.Item
                      value="action email mailto send"
                      onSelect={() => run(() => window.open(`mailto:${bio.email}`, '_self'))}
                      className="group flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm text-ink transition-colors data-[selected=true]:bg-terracotta data-[selected=true]:text-bg"
                    >
                      <span aria-hidden>✉</span>
                      <span className="font-medium">Email Stuti</span>
                    </Command.Item>

                    <Command.Item
                      value="action github profile open"
                      onSelect={() => run(() => window.open(bio.links.github, '_blank'))}
                      className="group flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm text-ink transition-colors data-[selected=true]:bg-terracotta data-[selected=true]:text-bg"
                    >
                      <span aria-hidden>↗</span>
                      <span className="font-medium">Open GitHub</span>
                      <span className="ml-auto text-[12px] text-muted group-data-[selected=true]:text-bg/80">
                        @{bio.links.githubHandle}
                      </span>
                    </Command.Item>

                    <Command.Item
                      value="action lil bytes instagram tech education"
                      onSelect={() => run(() => window.open(bio.links.lilBytes, '_blank'))}
                      className="group flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm text-ink transition-colors data-[selected=true]:bg-terracotta data-[selected=true]:text-bg"
                    >
                      <span aria-hidden>↗</span>
                      <span className="font-medium">Open Lil Bytes</span>
                      <span className="ml-auto text-[12px] text-muted group-data-[selected=true]:text-bg/80">
                        @lilbytes.tech
                      </span>
                    </Command.Item>

                    <Command.Item
                      value="action resume pdf download cv"
                      onSelect={() => run(() => window.open('/resume.pdf', '_blank'))}
                      className="group flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm text-ink transition-colors data-[selected=true]:bg-terracotta data-[selected=true]:text-bg"
                    >
                      <span aria-hidden>↓</span>
                      <span className="font-medium">Download resume</span>
                      <span className="ml-auto text-[12px] text-muted group-data-[selected=true]:text-bg/80">
                        /resume.pdf
                      </span>
                    </Command.Item>
                  </Command.Group>
                </Command.List>

                <div className="flex items-center justify-between border-t border-ink/10 bg-card/60 px-4 py-2 text-[11px] text-muted">
                  <div className="flex items-center gap-2">
                    <ShortcutKey>↑</ShortcutKey>
                    <ShortcutKey>↓</ShortcutKey>
                    <span>navigate</span>
                    <span className="mx-1 opacity-40">·</span>
                    <ShortcutKey>↵</ShortcutKey>
                    <span>select</span>
                  </div>
                  <span>
                    <ShortcutKey>{getMetaGlyph()}</ShortcutKey>
                    <span className="mx-1">+</span>
                    <ShortcutKey>K</ShortcutKey>
                  </span>
                </div>
              </Command>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {toast ? (
          <motion.div
            key="toast"
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 12, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="pointer-events-none fixed bottom-6 left-1/2 z-[110] -translate-x-1/2 rounded-full bg-ink px-4 py-2 text-sm text-bg shadow-lg ring-1 ring-ink/20"
          >
            {toast}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  )
}
