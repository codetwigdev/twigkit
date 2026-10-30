import { Suspense, useEffect, useRef } from 'react'
import { tools } from '../registry.js'
import Brand from '../ui/chrome/Brand.jsx'
import ToolTile from '../ui/chrome/ToolTile.jsx'
import ThemeToggle from '../ui/chrome/ThemeToggle.jsx'
import './Workspace.css'

const REPO_URL = 'https://github.com/codetwigdev/twigkit'

const pad = (n) => String(n).padStart(2, '0')
const num = (i) => pad(i + 1)

function Arrow() {
  return (
    <svg className="icon-arrow" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  )
}

export default function Workspace({ tool }) {
  const Tool = tool.component
  const index = tools.findIndex((t) => t.id === tool.id)
  const stripRef = useRef(null)

  // keep the active chip visible in the mobile strip
  useEffect(() => {
    const active = stripRef.current?.querySelector('.chip.is-active')
    if (active && typeof active.scrollIntoView === 'function') {
      active.scrollIntoView({ inline: 'center', block: 'nearest' })
    }
  }, [tool.id])

  return (
    <div className="ws">
      <aside className="rail">
        <div className="rail-top">
          <Brand />
        </div>
        <p className="eyebrow rail-label">Tools</p>
        <nav className="rail-nav" aria-label="Tools">
          <ol className="rail-list">
            {tools.map((t, i) => (
              <li key={t.id}>
                <a
                  className={t.id === tool.id ? 'rail-item is-active' : 'rail-item'}
                  href={`#/${t.id}`}
                  aria-current={t.id === tool.id ? 'page' : undefined}
                >
                  <span className="rail-num">{num(i)}</span>
                  <ToolTile glyph={t.icon} size="sm" />
                  <span className="rail-name">{t.name}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <div className="rail-foot">
          <a className="rail-link" href="#/about">
            How it's built <Arrow />
          </a>
          <a className="rail-link" href={REPO_URL}>
            Source on GitHub
          </a>
          <div className="rail-foot-row">
            <ThemeToggle />
            <span className="rail-note">Runs in your browser. Nothing is uploaded.</span>
          </div>
        </div>
      </aside>

      <div className="ws-mobile">
        <div className="ws-bar">
          <Brand />
          <ThemeToggle />
        </div>
        <nav className="strip" aria-label="Tools" ref={stripRef}>
          {tools.map((t) => (
            <a
              key={t.id}
              className={t.id === tool.id ? 'chip is-active' : 'chip'}
              href={`#/${t.id}`}
              aria-current={t.id === tool.id ? 'page' : undefined}
            >
              <ToolTile glyph={t.icon} size="sm" />
              {t.name}
            </a>
          ))}
        </nav>
      </div>

      <main id="main" tabIndex={-1} className="ws-main">
        <header className="tool-head">
          <p className="eyebrow">
            Tool {num(index)} of {pad(tools.length)}
          </p>
          <h1 className="tool-title">{tool.name}</h1>
          <p className="tool-desc">{tool.description}</p>
        </header>
        <div className="tool-body">
          <Suspense fallback={<p className="tool-loading">Loading…</p>}>
            <Tool key={tool.id} />
          </Suspense>
        </div>
        <p className="ws-foot">
          Nothing you type leaves this tab. <a href="#/">All tools</a> ·{' '}
          <a href="#/about">How it's built</a>
        </p>
      </main>
    </div>
  )
}
