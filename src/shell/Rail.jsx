import { useEffect, useRef } from 'react'
import { groups, numberOf } from '../catalog.js'
import Brand from '../ui/chrome/Brand.jsx'
import ToolTile from '../ui/chrome/ToolTile.jsx'
import ThemeToggle from '../ui/chrome/ThemeToggle.jsx'
import './Rail.css'

const REPO_URL = 'https://github.com/codetwigdev/twigkit'

function Arrow() {
  return (
    <svg className="icon-arrow" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  )
}

export default function Rail({ tool }) {
  const railRef = useRef(null)
  const stripRef = useRef(null)

  useEffect(() => {
    for (const ref of [railRef, stripRef]) {
      const active = ref.current?.querySelector('.is-active')
      if (active && typeof active.scrollIntoView === 'function') {
        active.scrollIntoView({ block: 'nearest', inline: 'center' })
      }
    }
  }, [tool.id])

  return (
    <>
      <aside className="rail" ref={railRef}>
        <div className="rail-top">
          <Brand />
          <ThemeToggle />
        </div>
        <nav className="rail-nav" aria-label="Tools">
          {groups.map((g) => (
            <section key={g.category.id} className="rail-group" aria-labelledby={`rail-${g.category.id}`}>
              <p className="eyebrow rail-group-label" id={`rail-${g.category.id}`}>
                {g.category.name}
              </p>
              <ol className="rail-list">
                {g.tools.map((t) => (
                  <li key={t.id}>
                    <a
                      className={t.id === tool.id ? 'rail-item is-active' : 'rail-item'}
                      href={`#/${t.id}`}
                      aria-current={t.id === tool.id ? 'page' : undefined}
                    >
                      <span className="rail-num">{numberOf(t)}</span>
                      <ToolTile glyph={t.icon} size="sm" />
                      <span className="rail-name">{t.name}</span>
                    </a>
                  </li>
                ))}
              </ol>
            </section>
          ))}
        </nav>
        <div className="rail-foot">
          <a className="rail-link" href="#/articles">
            Articles <Arrow />
          </a>
          <a className="rail-link" href="#/about">
            How it's built <Arrow />
          </a>
          <a className="rail-link" href={REPO_URL}>
            Source on GitHub
          </a>
          <p className="rail-note">Runs in your browser. Nothing is uploaded.</p>
        </div>
      </aside>

      <div className="ws-mobile">
        <div className="ws-bar">
          <Brand />
          <ThemeToggle />
        </div>
        <nav className="strip" aria-label="Tools" ref={stripRef}>
          {groups.map((g) =>
            g.tools.map((t) => (
              <a
                key={t.id}
                className={t.id === tool.id ? 'chip is-active' : 'chip'}
                href={`#/${t.id}`}
                aria-current={t.id === tool.id ? 'page' : undefined}
              >
                <ToolTile glyph={t.icon} size="sm" />
                {t.name}
              </a>
            )),
          )}
        </nav>
      </div>
    </>
  )
}
