---
files:
  - src/pages/Collection.jsx
  - src/pages/Collection.css
---

# 13 — Home collection: category filter and grouped tool cards

You own the "Pick a tool." section of the Home page: a row of category filter pills and
the tool cards, grouped by category like the contents page of a notebook. The Home page
(another package) renders `<Collection query={query} />` and passes in whatever is typed
in its "jump to a tool" box.

Other packages provide `ToolTile` (`src/ui/chrome/ToolTile.jsx`) and `src/catalog.js`
(`CATEGORIES`, `groups`, `matchTools`, `numberOf`, `pad`, `total`). Import them by path
even if they do not exist yet.

Visual idea: warm paper, serif names, one green accent ("moss"), hairlines. Each tool is
a "specimen card": glyph tile, index number (`No. 06`), serif name, one-line description.
Groups are separated by a small uppercase heading on a hairline.

## File 1: `src/pages/Collection.jsx`

```jsx
import { useState } from 'react'
import { groups, matchTools, numberOf, pad, total } from '../catalog.js'
import ToolTile from '../ui/chrome/ToolTile.jsx'
import './Collection.css'

function Arrow() {
  return (
    <svg className="icon-arrow" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  )
}

export default function Collection({ query = '' }) {
  const [cat, setCat] = useState('all')
  const q = query.trim()
  const matched = new Set(matchTools(q).map((t) => t.id))

  const shown = groups
    .filter((g) => cat === 'all' || g.category.id === cat)
    .map((g) => ({ ...g, tools: g.tools.filter((t) => matched.has(t.id)) }))
    .filter((g) => g.tools.length > 0)
  const count = shown.reduce((n, g) => n + g.tools.length, 0)
  const filtering = q !== '' || cat !== 'all'

  const pills = [{ id: 'all', name: 'All', n: matchTools('').length }].concat(
    groups.map((g) => ({ id: g.category.id, name: g.category.name, n: g.tools.length })),
  )

  return (
    <section className="collection" aria-labelledby="collection-title">
      <div className="section-head">
        <div>
          <p className="eyebrow">The collection</p>
          <h2 className="section-title" id="collection-title">
            Pick a tool.
          </h2>
        </div>
        <p className="section-count" aria-live="polite">
          {filtering ? `${pad(count)} of ` : ''}
          {total}
        </p>
      </div>

      <div className="filters" role="group" aria-label="Filter by category">
        {pills.map((p) => (
          <button
            key={p.id}
            type="button"
            className={p.id === cat ? 'filter is-active' : 'filter'}
            aria-pressed={p.id === cat}
            onClick={() => setCat(p.id)}
          >
            {p.name} <span className="filter-n">{p.n}</span>
          </button>
        ))}
      </div>

      {shown.length > 0 ? (
        shown.map((g) => (
          <div key={g.category.id} className="group">
            <div className="group-head">
              <h3 className="group-name">{g.category.name}</h3>
              {g.category.blurb && <p className="group-blurb">{g.category.blurb}</p>}
              <span className="group-count">{pad(g.tools.length)}</span>
            </div>
            <ul className="cards">
              {g.tools.map((t) => (
                <li key={t.id}>
                  <a className="card" href={`#/${t.id}`}>
                    <div className="card-top">
                      <ToolTile glyph={t.icon} size="md" />
                      <span className="card-num">No. {numberOf(t)}</span>
                    </div>
                    <h4 className="card-name">{t.name}</h4>
                    <p className="card-desc">{t.description}</p>
                    <span className="card-cta">
                      Open <Arrow />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))
      ) : (
        <p className="collection-empty">
          No tool matches “{q}”{cat !== 'all' ? ' in this category' : ''}.{' '}
          <a href="#/about">Build your own</a>
        </p>
      )}
    </section>
  )
}
```

The count on the right of "Pick a tool." reads `17` normally and `03 of 17` while a
query or a category filter is active (`00 of 17` next to the empty state). The `All`
pill is selected on load.

## File 2: `src/pages/Collection.css`

Write exactly:

```css
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
  margin: 0 0 20px;
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

/* ----- filter pills ----- */
.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 0 0 32px;
}
.filter {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 34px;
  padding: 0 12px;
  border: 1px solid var(--line);
  border-radius: var(--r-pill);
  background: var(--panel);
  color: var(--ink-2);
  font: 500 13px/1 var(--font-body);
  cursor: pointer;
  transition: background-color var(--t-fast) var(--ease-out), border-color var(--t-fast) var(--ease-out), color var(--t-fast) var(--ease-out);
}
.filter:hover {
  border-color: var(--line-strong);
  color: var(--ink);
}
.filter.is-active {
  background: var(--moss);
  border-color: var(--moss);
  color: var(--on-moss);
}
.filter:focus-visible {
  outline: 2px solid var(--moss);
  outline-offset: 2px;
}
.filter-n {
  font: 500 11px/1 var(--font-mono);
  font-variant-numeric: tabular-nums;
  color: var(--muted);
}
.filter.is-active .filter-n {
  color: var(--on-moss);
  opacity: 0.8;
}

/* ----- groups ----- */
.group + .group {
  margin-top: 40px;
}
.group-head {
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin: 0 0 16px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--line);
}
.group-name {
  margin: 0;
  font: 500 11px/1 var(--font-mono);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--moss);
}
.group-blurb {
  flex: 1;
  margin: 0;
  font-size: 13px;
  color: var(--muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.group-count {
  margin-left: auto;
  font: 500 11px/1 var(--font-mono);
  font-variant-numeric: tabular-nums;
  color: var(--muted);
}

/* ----- cards ----- */
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

/* ----- responsive ----- */
@media (max-width: 899px) {
  .cards {
    grid-template-columns: repeat(2, 1fr);
  }
  .group-blurb {
    display: none;
  }
}
@media (max-width: 599px) {
  .collection {
    padding: 40px 16px 24px;
  }
  .filters {
    margin-bottom: 24px;
  }
  .group + .group {
    margin-top: 32px;
  }
  .cards {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  .card {
    min-height: 0;
  }
}
```

## How to tell it is right

- At 1280px on `#/`: "THE COLLECTION / Pick a tool." with a big serif `17` on the right,
  a row of six pills `All 17`, `Encode & decode 4`, `Data 3`, `Text 5`, `Numbers & time
  3`, `Colour & random 2` (`All` solid green), then five groups. Each group has a green
  uppercase name, a grey blurb, a grey two-digit count at the right, a hairline, and its
  cards in three columns. Card numbers run `No. 01` … `No. 17` straight through the
  groups.
- Clicking `Text` shows only the Text group; the count reads `05 of 17`. Clicking `All`
  restores everything.
- With `query="uuid"` (type it in Home's jump box) one card remains under `Colour &
  random` and the count reads `01 of 17`. With `query="zzz"` a dashed box reads
  `No tool matches “zzz”. Build your own`.
- Hovering a card lifts it 2px, turns the tile solid green and reveals "Open →"; on a
  touch device "Open →" is always visible.
- At 375px: one column, pills wrap onto two or three lines, blurbs hidden, no horizontal
  scroll.
- `npm test` passes.
