---
files:
  - src/App.jsx
  - src/shell/useRoute.js
  - src/shell/Workspace.jsx
  - src/shell/Workspace.css
---

# 03 — App shell, router and tool workspace

You own the router and the tool page (the "workspace"): the chrome around every tool. On
desktop it is a 248px left rail listing the nine tools as a numbered index, with the tool
in a calm, generous content column. Below 900px the rail becomes a sticky top bar with a
horizontally scrolling strip of tool chips.

Other packages provide: `Home` (`src/pages/Home.jsx`), `About` (`src/pages/About.jsx`),
`Brand`, `ToolTile`, `ThemeToggle` (`src/ui/chrome/*.jsx`), and the global CSS. Import
them by the paths below even if they do not exist yet in your checkout.

## File 1: `src/shell/useRoute.js`

```js
import { useEffect, useState } from 'react'
import { tools } from '../registry.js'

// '#/json-formatter' -> { kind: 'tool', tool }, '#/about' -> about, anything else -> home
export function parseHash(hash) {
  const path = (hash || '').replace(/^#\/?/, '').replace(/\/+$/, '')
  if (path === '') return { kind: 'home', tool: null }
  if (path === 'about') return { kind: 'about', tool: null }
  const tool = tools.find((t) => t.id === path)
  return tool ? { kind: 'tool', tool } : { kind: 'home', tool: null }
}

export default function useRoute() {
  const [route, setRoute] = useState(() => parseHash(window.location.hash))

  useEffect(() => {
    const onHash = () => setRoute(parseHash(window.location.hash))
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  return route
}
```

## File 2: `src/App.jsx`

Replace the whole file:

```jsx
import { useEffect } from 'react'
import useRoute from './shell/useRoute.js'
import Workspace from './shell/Workspace.jsx'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'

const HOME_TITLE = 'TwigKit — Tiny tools, done beautifully'

function focusMain(e) {
  e.preventDefault()
  const main = document.getElementById('main')
  if (!main) return
  main.focus()
  if (typeof main.scrollIntoView === 'function') main.scrollIntoView()
}

export default function App() {
  const route = useRoute()

  useEffect(() => {
    document.title =
      route.kind === 'tool'
        ? `${route.tool.name} · TwigKit`
        : route.kind === 'about'
          ? "How it's built · TwigKit"
          : HOME_TITLE
    if (typeof window.scrollTo === 'function') window.scrollTo(0, 0)
  }, [route.kind, route.tool])

  return (
    <>
      <a className="skip-link" href="#/" onClick={focusMain}>
        Skip to content
      </a>
      {route.kind === 'tool' ? (
        <Workspace tool={route.tool} />
      ) : route.kind === 'about' ? (
        <About />
      ) : (
        <Home />
      )}
    </>
  )
}
```

## File 3: `src/shell/Workspace.jsx`

Props: `tool` — a registry item `{ id, name, description, icon, component }`.

```jsx
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
```

The eyebrow reads `Tool 03 of 09`. The `key={tool.id}` resets tool state when switching
tools.

## File 4: `src/shell/Workspace.css`

Write exactly:

```css
.ws {
  display: flex;
  min-height: 100vh;
}

/* ----- desktop rail ----- */
.rail {
  position: sticky;
  top: 0;
  height: 100vh;
  width: var(--rail-w);
  flex: 0 0 var(--rail-w);
  display: flex;
  flex-direction: column;
  padding: 20px 16px 16px;
  border-right: 1px solid var(--line);
  overflow-y: auto;
}
.rail-top {
  padding: 0 8px 20px;
}
.rail-label {
  padding: 0 8px;
  margin: 0 0 8px;
}
.rail-nav {
  flex: 1;
}
.rail-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.rail-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 8px;
  border-radius: var(--r-2);
  color: var(--ink-2);
  font-size: 14px;
  line-height: 1.3;
  text-decoration: none;
  transition: background-color var(--t-fast) var(--ease-out), color var(--t-fast) var(--ease-out);
}
.rail-item:hover {
  background: var(--well);
  color: var(--ink);
}
.rail-item:hover .tile {
  border-color: var(--line-strong);
  color: var(--ink);
}
.rail-item.is-active {
  background: var(--moss-soft);
  color: var(--moss-ink);
  font-weight: 500;
}
.rail-item.is-active .tile {
  background: var(--moss);
  border-color: var(--moss);
  color: var(--on-moss);
}
.rail-item:focus-visible {
  outline: 2px solid var(--moss);
  outline-offset: -2px;
}
.rail-num {
  flex: 0 0 18px;
  width: 18px;
  font: 500 11px/1 var(--font-mono);
  font-variant-numeric: tabular-nums;
  color: var(--muted);
}
.rail-item.is-active .rail-num {
  color: var(--moss);
}
.rail-name {
  flex: 1;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.rail-foot {
  margin-top: auto;
  padding: 16px 8px 0;
  border-top: 1px solid var(--line);
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.rail-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--ink-2);
  text-decoration: none;
}
.rail-link:hover {
  color: var(--moss-ink);
}
.rail-link .icon-arrow {
  transition: transform var(--t-fast) var(--ease-out);
}
.rail-link:hover .icon-arrow {
  transform: translateX(2px);
}
.rail-foot-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 8px;
}
.rail-note {
  font-size: 12px;
  line-height: 1.3;
  color: var(--muted);
}

/* ----- mobile bar + strip (hidden on desktop) ----- */
.ws-mobile {
  display: none;
}

/* ----- content column ----- */
.ws-main {
  flex: 1;
  min-width: 0;
  max-width: calc(var(--content-max) + 96px);
  padding: 40px 48px 48px;
}
.ws-main:focus {
  outline: none;
}
.tool-head {
  padding-bottom: 20px;
  margin-bottom: 24px;
  border-bottom: 1px solid var(--line);
}
.tool-head .eyebrow {
  color: var(--moss);
  margin: 0 0 10px;
}
.tool-title {
  font-size: clamp(28px, 3.2vw, 36px);
  line-height: 1.1;
  margin: 0 0 8px;
}
.tool-desc {
  font-size: 16px;
  line-height: 1.5;
  color: var(--ink-2);
  max-width: 60ch;
  margin: 0;
}
.tool-loading {
  font: 13px/1.5 var(--font-mono);
  color: var(--muted);
}
.ws-foot {
  margin: 48px 0 0;
  padding-top: 16px;
  border-top: 1px solid var(--line);
  font-size: 13px;
  color: var(--muted);
}

@media (max-width: 899px) {
  .ws {
    display: block;
  }
  .rail {
    display: none;
  }
  .ws-mobile {
    display: block;
    position: sticky;
    top: 0;
    z-index: 20;
    background: var(--paper);
    border-bottom: 1px solid var(--line);
  }
  .ws-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 56px;
    padding: 0 16px;
  }
  .strip {
    display: flex;
    gap: 8px;
    padding: 0 16px 12px;
    overflow-x: auto;
    scrollbar-width: none;
    -webkit-overflow-scrolling: touch;
  }
  .strip::-webkit-scrollbar {
    display: none;
  }
  .chip {
    flex: 0 0 auto;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    height: 36px;
    padding: 0 12px 0 5px;
    border: 1px solid var(--line);
    border-radius: var(--r-pill);
    background: var(--panel);
    color: var(--ink-2);
    font-size: 13px;
    white-space: nowrap;
    text-decoration: none;
  }
  .chip.is-active {
    background: var(--moss);
    border-color: var(--moss);
    color: var(--on-moss);
  }
  .chip.is-active .tile {
    background: transparent;
    border-color: color-mix(in srgb, currentColor 35%, transparent);
    color: var(--on-moss);
  }
  .chip:focus-visible {
    outline: 2px solid var(--moss);
    outline-offset: 2px;
  }
  .ws-main {
    max-width: none;
    padding: 24px 16px 40px;
  }
  .tool-title {
    font-size: 28px;
  }
}
```

## How to tell it is right

- `#/json-formatter` shows a left rail with the twig logo, "TOOLS" eyebrow, nine
  numbered rows (`01` … `09`, each with a small glyph tile and name); the current tool's
  row is pale green with a solid green tile. The rail stays put while the page scrolls.
- The content column shows a green eyebrow `TOOL 03 OF 09`, a large serif title, a grey
  description, a hairline, then the tool.
- `#/` shows the Home page, `#/about` the About page, `#/nonsense` the Home page.
- Switching tools in the rail resets the previous tool's typed input.
- At 800px wide the rail disappears; a sticky bar with logo and theme button sits above
  a horizontal row of pill chips; the active chip is solid green and scrolled into view.
- Press Tab once on page load: a green "Skip to content" pill appears top-left; Enter
  moves focus to the content column without changing the URL hash.
- The browser tab title reads "JSON Formatter · TwigKit".
- `npm test` passes.
