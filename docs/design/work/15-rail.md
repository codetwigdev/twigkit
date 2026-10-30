---
files:
  - src/shell/Rail.jsx
  - src/shell/Rail.css
---

# 15 — Workspace rail (desktop) and chip strip (mobile)

You own the navigation that sits beside every tool: on desktop a sticky 248px left rail
listing all tools as a numbered index **grouped by category**; below 900px a sticky top
bar (logo + theme button) over a horizontally scrolling strip of tool chips. The tool page
itself (`Workspace.jsx`) is another package; it renders `<Rail tool={tool} />` as the
first child of `<div class="ws">`.

Other packages provide `Brand`, `ToolTile`, `ThemeToggle` (`src/ui/chrome/*.jsx`) and
`src/catalog.js` (`groups`, `numberOf`). Import them by path even if they do not exist
yet.

Visual idea: a notebook index. Tiny uppercase group headings, compact rows (number, glyph
tile, name), one green accent for the active row. Seventeen rows must fit comfortably on
a 768px-tall screen, so rows are 34px and the rail scrolls internally when it has to.

## File 1: `src/shell/Rail.jsx`

Props: `tool` — the active registry item.

```jsx
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

  // keep the active row and the active chip in view when the tool changes
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
```

## File 2: `src/shell/Rail.css`

Write exactly:

```css
/* ----- desktop rail ----- */
.rail {
  position: sticky;
  top: 0;
  height: 100vh;
  width: var(--rail-w);
  flex: 0 0 var(--rail-w);
  display: flex;
  flex-direction: column;
  padding: 16px 12px 16px;
  border-right: 1px solid var(--line);
  overflow-y: auto;
  scrollbar-width: thin;
}
.rail-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 0 8px 16px;
}
.rail-top .theme-toggle {
  height: 28px;
  padding: 0 7px;
}
.rail-top .theme-toggle-label {
  display: none;
}
.rail-nav {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.rail-group-label {
  margin: 0 0 4px;
  padding: 0 8px;
}
.rail-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 1px;
}
.rail-item {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 34px;
  padding: 4px 8px;
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
  margin-top: 20px;
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
.rail-note {
  margin: 4px 0 0;
  font-size: 12px;
  line-height: 1.4;
  color: var(--muted);
}

/* ----- mobile bar + strip (hidden on desktop) ----- */
.ws-mobile {
  display: none;
}

@media (max-width: 899px) {
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
  .ws-bar .theme-toggle-label {
    display: none;
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
}
```

## How to tell it is right

- `#/json-formatter` at 1280px: a left rail with the twig logo and an icon-only theme
  pill on one line, then five tiny uppercase group headings `ENCODE & DECODE`, `DATA`,
  `TEXT`, `NUMBERS & TIME`, `COLOUR & RANDOM`, each followed by its rows: number (`01`
  … `17`, running straight through all groups), a small glyph tile and the name. The
  current tool's row is pale green with a solid green tile and a green number.
- Rows are 34px tall; all seventeen plus headings and the footer links fit on a 900px
  tall window without scrolling; on a shorter window the rail scrolls by itself and the
  active row is scrolled into view on load.
- Footer links: `Articles →`, `How it's built →`, `Source on GitHub`, then the grey note.
- At 800px wide the rail disappears; a sticky bar with logo and theme button sits above
  one horizontal row of pill chips (all seventeen, in rail order); the active chip is
  solid green and scrolled into view.
- `npm test` passes.
