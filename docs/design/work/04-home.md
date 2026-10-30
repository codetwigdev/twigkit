---
files:
  - src/pages/Home.jsx
  - src/pages/Home.css
---

# 04 — Home page

You own the home page: hero, "jump to a tool" search, the collection of nine tool cards,
a short "how it's built" teaser, and the footer slot. Route `#/`.

Other packages provide `SiteHeader`, `Footer`, `ToolTile` (`src/ui/chrome/*.jsx`), the
global tokens and base styles. Import them by path even if they do not exist yet.
`src/registry.js` exports `tools` (sorted by name; items `{ id, name, description, icon }`).

Visual idea: a sheet of warm paper with faint horizontal rules behind the hero, a very
large serif headline, one green accent ("moss"), and a grid of "specimen cards": each tool
is a glyph tile, an index number, a serif name and a one-line description.

## File 1: `src/pages/Home.jsx`

```jsx
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
```

The count on the right of "Pick a tool." reads `09` normally and `03 of 09` while
filtering (`00 of 09` when nothing matches, next to the empty state).

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

/* ----- collection ----- */
.collection {
  max-width: var(--page-max);
  margin: 0 auto;
  padding: 56px 32px 32px;
}
.section-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  margin: 0 0 24px;
}
.section-head .eyebrow {
  margin: 0;
}
.section-title {
  font-size: clamp(26px, 3vw, 34px);
  line-height: 1.1;
  margin: 8px 0 0;
}
.section-count {
  margin: 0;
  font: 400 34px/1 var(--font-display);
  font-variant-numeric: tabular-nums;
  color: var(--muted);
}
.cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  list-style: none;
  margin: 0;
  padding: 0;
}
.card {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 184px;
  height: 100%;
  padding: 20px;
  border: 1px solid var(--line);
  border-radius: var(--r-3);
  background: var(--panel);
  color: var(--ink);
  text-decoration: none;
  transition: transform var(--t-base) var(--ease-out), border-color var(--t-base) var(--ease-out), box-shadow var(--t-base) var(--ease-out);
}
.card:hover {
  transform: translateY(-2px);
  border-color: var(--line-strong);
  box-shadow: var(--shadow-card);
}
.card:hover .tile,
.card:focus-visible .tile {
  background: var(--moss);
  border-color: var(--moss);
  color: var(--on-moss);
}
.card:focus-visible {
  outline: 2px solid var(--moss);
  outline-offset: 2px;
}
.card-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}
.card-num {
  font: 500 11px/1 var(--font-mono);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--muted);
}
.card-name {
  font-size: 22px;
  line-height: 1.15;
  margin: 6px 0 0;
}
.card-desc {
  flex: 1;
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
  color: var(--ink-2);
}
.card-cta {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 500;
  color: var(--moss-ink);
  opacity: 0;
  transform: translateX(-4px);
  transition: opacity var(--t-base) var(--ease-out), transform var(--t-base) var(--ease-out);
}
.card:hover .card-cta,
.card:focus-visible .card-cta {
  opacity: 1;
  transform: none;
}
@media (hover: none) {
  .card-cta {
    opacity: 1;
    transform: none;
  }
}
.collection-empty {
  margin: 0;
  padding: 40px 20px;
  border: 1px dashed var(--line-strong);
  border-radius: var(--r-3);
  text-align: center;
  color: var(--muted);
}

/* ----- teaser ----- */
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
  .cards {
    grid-template-columns: repeat(2, 1fr);
  }
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
  .collection {
    padding: 40px 16px 24px;
  }
  .cards {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  .card {
    min-height: 0;
  }
  .teaser-inner {
    padding: 40px 16px 48px;
  }
}
```

## How to tell it is right

- At 1280px: header (logo left, "Tools" underlined green, "How it's built", theme pill
  right), then a hero on faintly ruled paper with a tiny green uppercase line, a huge
  serif "Tiny tools," over an italic green "done beautifully.", a grey lead paragraph,
  a 52px search box with a magnifier and a `/ to focus · ↵ to open` hint, and three
  green-check trust items.
- "THE COLLECTION / Pick a tool." with a big serif "09" on the right, then nine cards in
  three columns: glyph tile top-left, "NO. 01" top-right, serif name, grey description.
  Hovering a card lifts it 2px, turns the tile solid green and reveals "Open →".
- Typing "uuid" in the search box leaves one card and the count reads "01 of 09";
  pressing Enter opens `#/random`. Typing "zzz" shows a dashed box "No tool matches
  “zzz”. Build your own". Pressing `/` anywhere on the page focuses the box; Escape
  clears it.
- The teaser: eyebrow, serif heading "Architected by Claude. Typed by Qwen. Checked by
  89 tests.", paragraph, green "Read how it's built →" link; on the right a 2×2 grid of
  small cards 01 Specify … 04 Review.
- At 375px everything is one column with 16px side gutters and no horizontal scroll;
  the search hint is hidden; the "Open →" label is always visible on touch devices.
- Dark mode: green-black paper, the ruled lines are barely visible, cards are a slightly
  lighter green-black.
