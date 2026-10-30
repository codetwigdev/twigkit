import { useEffect, useRef, useState } from 'react'
import { tools } from '../registry.js'
import SiteHeader from '../ui/chrome/SiteHeader.jsx'
import Footer from '../ui/chrome/Footer.jsx'
import ToolTile from '../ui/chrome/ToolTile.jsx'
import './Home.css'

const pad = (n) => String(n).padStart(2, '0')
const num = (i) => pad(i + 1)

const STEPS = [
  { n: '01', name: 'Specify', text: 'Claude writes the spec, the tests and the shell.' },
  { n: '02', name: 'Implement', text: 'Eight Qwen workers each build one tool, in parallel.' },
  { n: '03', name: 'Verify', text: 'Tests and lint run; failures go back to the worker.' },
  { n: '04', name: 'Review', text: 'Claude checks the result in a real browser.' },
]

function Arrow() {
  return (
    <svg className="icon-arrow" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  )
}

function Check() {
  return (
    <svg className="icon-check" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3.5 8.5l3 3 6-6.5" />
    </svg>
  )
}

export default function Home() {
  const [query, setQuery] = useState('')
  const inputRef = useRef(null)

  const q = query.trim().toLowerCase()
  const matches = q
    ? tools.filter((t) =>
        `${t.name} ${t.description} ${t.id}`.toLowerCase().includes(q),
      )
    : tools

  // "/" focuses the jump box from anywhere on the page
  useEffect(() => {
    function onKey(e) {
      const tag = e.target?.tagName
      if (e.key === '/' && tag !== 'INPUT' && tag !== 'TEXTAREA' && tag !== 'SELECT') {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  function onSubmit(e) {
    e.preventDefault()
    if (matches.length > 0) window.location.hash = `#/${matches[0].id}`
  }

  function onKeyDown(e) {
    if (e.key === 'Escape') setQuery('')
  }

  return (
    <div className="home">
      <SiteHeader current="home" />
      <main id="main" tabIndex={-1}>
        <section className="hero">
          <div className="hero-inner">
            <p className="eyebrow hero-eyebrow">TwigKit · Nine small tools · Zero uploads</p>
            <h1 className="hero-title">
              Tiny tools,
              <br />
              <em>done beautifully.</em>
            </h1>
            <p className="hero-lead">
              Format JSON, decode Base64, convert a timestamp, diff two texts. Each one is a
              20-second job, and each one runs entirely in this tab. Nothing is uploaded,
              nothing is stored, nobody is asked to sign in.
            </p>
            <form className="jump" role="search" onSubmit={onSubmit}>
              <label htmlFor="jump-input" className="visually-hidden">
                Jump to a tool
              </label>
              <svg className="jump-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden="true">
                <circle cx="11" cy="11" r="6.5" />
                <path d="M16 16l4.5 4.5" />
              </svg>
              <input
                id="jump-input"
                ref={inputRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Jump to a tool — try “json” or “uuid”"
                autoComplete="off"
                spellCheck="false"
              />
              <span className="jump-hint" aria-hidden="true">
                <kbd>/</kbd> to focus · <kbd>↵</kbd> to open
              </span>
            </form>
            <ul className="trust">
              <li>
                <Check /> Runs in your browser
              </li>
              <li>
                <Check /> No account, no cookies, no analytics
              </li>
              <li>
                <Check /> Open source, MIT licensed
              </li>
            </ul>
          </div>
        </section>

        <section className="collection" aria-labelledby="collection-title">
          <div className="section-head">
            <div>
              <p className="eyebrow">The collection</p>
              <h2 className="section-title" id="collection-title">
                Pick a tool.
              </h2>
            </div>
            <p className="section-count" aria-live="polite">
              {q ? `${pad(matches.length)} of ` : ''}
              {pad(tools.length)}
            </p>
          </div>
          {matches.length > 0 ? (
            <ul className="cards">
              {matches.map((t) => {
                const i = tools.indexOf(t)
                return (
                  <li key={t.id}>
                    <a className="card" href={`#/${t.id}`}>
                      <div className="card-top">
                        <ToolTile glyph={t.icon} size="md" />
                        <span className="card-num">No. {num(i)}</span>
                      </div>
                      <h3 className="card-name">{t.name}</h3>
                      <p className="card-desc">{t.description}</p>
                      <span className="card-cta">
                        Open <Arrow />
                      </span>
                    </a>
                  </li>
                )
              })}
            </ul>
          ) : (
            <p className="collection-empty">
              No tool matches “{query.trim()}”.{' '}
              <a href="#/about">Build your own</a>
            </p>
          )}
        </section>

        <section className="teaser" aria-labelledby="teaser-title">
          <div className="teaser-inner">
            <div>
              <p className="eyebrow">How it's built</p>
              <h2 className="teaser-title" id="teaser-title">
                Architected by Claude. Typed by Qwen. Checked by 89 tests.
              </h2>
              <p className="teaser-text">
                TwigKit is also a demonstration: one strong model writes the specs and the
                tests, eight small local models implement the tools in parallel, and nothing
                ships until the tests say so.
              </p>
              <a className="teaser-link" href="#/about">
                Read how it's built <Arrow />
              </a>
            </div>
            <ol className="steps">
              {STEPS.map((s) => (
                <li key={s.n} className="step">
                  <span className="step-num">{s.n}</span>
                  <h3 className="step-name">{s.name}</h3>
                  <p className="step-text">{s.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
