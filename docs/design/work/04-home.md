---
files:
  - src/pages/Home.jsx
  - src/pages/Home.css
---

# 04 — Home page

> Changed in v1.1: the tool collection moved into its own component (`Collection`,
> package 13), a "From the notebook" section (`NotebookTeaser`, package 16) sits between
> the collection and the build teaser, and every count is derived from the registry.

You own the home page: hero, "jump to a tool" search, the build teaser and the page
frame. Route `#/`. The grouped tool cards and the articles teaser are separate
components that you render.

Other packages provide `SiteHeader`, `Footer` (`src/ui/chrome/*.jsx`), `Collection`
(`src/pages/Collection.jsx`), `NotebookTeaser` (`src/pages/NotebookTeaser.jsx`),
`src/catalog.js` (`matchTools`, `WORKER_TOOLS`) and the global tokens and base styles.
`src/registry.js` exports `tools`. Import everything by path even if it does not exist
yet.

Visual idea: a sheet of warm paper with faint horizontal rules behind the hero, a very
large serif headline, one green accent ("moss"), hairlines between sections.

## File 1: `src/pages/Home.jsx`

```jsx
import { useEffect, useRef, useState } from 'react'
import { tools } from '../registry.js'
import { matchTools, WORKER_TOOLS } from '../catalog.js'
import SiteHeader from '../ui/chrome/SiteHeader.jsx'
import Footer from '../ui/chrome/Footer.jsx'
import Collection from './Collection.jsx'
import NotebookTeaser from './NotebookTeaser.jsx'
import './Home.css'

const STEPS = [
  { n: '01', name: 'Specify', text: 'Claude writes the spec, the tests and the shell.' },
  { n: '02', name: 'Implement', text: 'Qwen workers each build one tool, in parallel.' },
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
    const first = matchTools(query)[0]
    if (first) window.location.hash = `#/${first.id}`
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
            <p className="eyebrow hero-eyebrow">
              TwigKit · {tools.length} small tools · Zero uploads
            </p>
            <h1 className="hero-title">
              Tiny tools,
              <br />
              <em>done beautifully.</em>
            </h1>
            <p className="hero-lead">
              Format JSON, decode a token, read a cron line, diff two texts. Each one is a
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
                placeholder="Jump to a tool — try “json” or “cron”"
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

        <Collection query={query} />

        <NotebookTeaser />

        <section className="teaser" aria-labelledby="teaser-title">
          <div className="teaser-inner">
            <div>
              <p className="eyebrow">How it's built</p>
              <h2 className="teaser-title" id="teaser-title">
                Architected by Claude. Typed by Qwen. Checked by tests.
              </h2>
              <p className="teaser-text">
                TwigKit is also a demonstration: one strong model writes the specs and the
                tests, small local models implement the tools in parallel, and nothing
                ships until the tests say so. {WORKER_TOOLS.length} of the {tools.length}{' '}
                tools here were typed by a worker; so were the articles.
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
```

Pressing Enter in the jump box opens the first tool matching the typed text (category
order), ignoring any category pill selected in the collection.

## File 2: `src/pages/Home.css`

Write exactly:

```css
.home main:focus {
  outline: none;
}

/* ----- hero ----- */
.hero {
  border-bottom: 1px solid var(--line);
  background-image: repeating-linear-gradient(to bottom, transparent 0 31px, var(--rule) 31px 32px);
}
.hero-inner {
  max-width: var(--page-max);
  margin: 0 auto;
  padding: 88px 32px 56px;
}
.hero-eyebrow {
  color: var(--moss);
  margin: 0 0 20px;
}
.hero-title {
  font-size: clamp(44px, 7vw, 84px);
  line-height: 1;
  letter-spacing: -0.025em;
  margin: 0 0 24px;
}
.hero-title em {
  font-style: italic;
  color: var(--moss-ink);
}
.hero-lead {
  font-size: clamp(17px, 1.6vw, 20px);
  line-height: 1.5;
  color: var(--ink-2);
  max-width: 58ch;
  margin: 0 0 32px;
}

/* jump box */
.jump {
  position: relative;
  display: flex;
  align-items: center;
  max-width: 560px;
}
.jump-icon {
  position: absolute;
  left: 14px;
  color: var(--muted);
  pointer-events: none;
}
.jump input[type='search'] {
  width: 100%;
  height: 52px;
  min-height: 52px;
  padding: 0 150px 0 42px;
  border: 1px solid var(--line-strong);
  border-radius: var(--r-2);
  background: var(--panel);
  font: 16px/1 var(--font-body);
  appearance: none;
  -webkit-appearance: none;
}
.jump input[type='search']::-webkit-search-cancel-button {
  -webkit-appearance: none;
}
.jump input[type='search']:focus-visible {
  outline: 2px solid var(--moss);
  outline-offset: 0;
  border-color: var(--moss);
}
.jump-hint {
  position: absolute;
  right: 14px;
  display: flex;
  align-items: center;
  gap: 6px;
  font: 12px/1 var(--font-mono);
  color: var(--muted);
  pointer-events: none;
}
.jump kbd {
  display: inline-block;
  min-width: 20px;
  padding: 3px 5px;
  border: 1px solid var(--line-strong);
  border-bottom-width: 2px;
  border-radius: 4px;
  font: 11px/1 var(--font-mono);
  text-align: center;
  color: var(--ink-2);
}

.trust {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 24px;
  margin: 28px 0 0;
  padding: 0;
  list-style: none;
  font-size: 13px;
  color: var(--muted);
}
.trust li {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.trust .icon-check {
  color: var(--moss);
}

/* ----- build teaser ----- */
.teaser {
  border-top: 1px solid var(--line);
}
.teaser-inner {
  max-width: var(--page-max);
  margin: 0 auto;
  padding: 56px 32px 64px;
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: 48px;
  align-items: start;
}
.teaser .eyebrow {
  margin: 0;
}
.teaser-title {
  font-size: clamp(26px, 3vw, 34px);
  line-height: 1.15;
  margin: 8px 0 16px;
  max-width: 20ch;
}
.teaser-text {
  font-size: 16px;
  line-height: 1.55;
  color: var(--ink-2);
  max-width: 48ch;
  margin: 0 0 20px;
}
.teaser-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 15px;
  font-weight: 500;
  color: var(--moss-ink);
  text-decoration: none;
}
.teaser-link .icon-arrow {
  transition: transform var(--t-fast) var(--ease-out);
}
.teaser-link:hover .icon-arrow {
  transform: translateX(3px);
}
.steps {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.step {
  padding: 16px;
  border: 1px solid var(--line);
  border-radius: var(--r-2);
  background: var(--panel);
}
.step-num {
  display: block;
  margin: 0 0 8px;
  font: 500 11px/1 var(--font-mono);
  letter-spacing: 0.12em;
  color: var(--moss);
}
.step-name {
  font-size: 18px;
  line-height: 1.2;
  margin: 0 0 4px;
}
.step-text {
  margin: 0;
  font-size: 13px;
  line-height: 1.45;
  color: var(--muted);
}

/* ----- responsive ----- */
@media (max-width: 899px) {
  .teaser-inner {
    grid-template-columns: 1fr;
    gap: 32px;
  }
}
@media (max-width: 599px) {
  .hero-inner {
    padding: 48px 16px 40px;
  }
  .jump input[type='search'] {
    padding-right: 16px;
  }
  .jump-hint {
    display: none;
  }
  .teaser-inner {
    padding: 40px 16px 48px;
  }
}
```

## How to tell it is right

- At 1280px: header (logo left, "Tools" underlined green, "Articles", "How it's built",
  theme pill right), then a hero on faintly ruled paper with a tiny green uppercase line
  `TWIGKIT · 17 SMALL TOOLS · ZERO UPLOADS` (the number comes from the registry), a huge
  serif "Tiny tools," over an italic green "done beautifully.", a grey lead paragraph,
  a 52px search box with a magnifier and a `/ to focus · ↵ to open` hint, and three
  green-check trust items.
- Below: the grouped collection (package 13), then "From the notebook" (package 16, only
  when articles exist), then the build teaser: eyebrow, serif heading "Architected by
  Claude. Typed by Qwen. Checked by tests.", a paragraph ending "16 of the 17 tools here
  were typed by a worker; so were the articles." (numbers derived), a green "Read how
  it's built →" link; on the right a 2×2 grid of small cards 01 Specify … 04 Review.
- Typing "cron" in the search box and pressing Enter opens `#/cron`. Pressing `/`
  anywhere on the page focuses the box; Escape clears it.
- No literal number appears in `Home.jsx` other than the step numbers `01`–`04` and the
  phrase "20-second job".
- At 375px everything is one column with 16px side gutters and no horizontal scroll; the
  search hint is hidden.
- Dark mode: green-black paper, the ruled lines are barely visible.
