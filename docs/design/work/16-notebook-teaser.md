---
files:
  - src/pages/NotebookTeaser.jsx
  - src/pages/NotebookTeaser.css
---

# 16 — Home teaser: "From the notebook"

You own one small section of the Home page: three cards for the three most recent
articles, with a link to the full index. The Home page (another package) renders
`<NotebookTeaser />` between the tool collection and the "how it's built" teaser. When
there are no articles the component renders nothing.

Other packages provide `src/articles/registry.js`, which exports `articles` (sorted
newest first), `readingTime(article)` → `'4 min read'` and `formatDate(iso)` →
`'30 Oct 2026'`. Import it by path even if it does not exist yet.

Visual idea: warm paper, serif titles, one green accent, hairlines. Each card looks like
a notebook entry: a date in tiny monospace, a serif title, one sentence, a reading time.

## File 1: `src/pages/NotebookTeaser.jsx`

```jsx
import { articles, formatDate, readingTime } from '../articles/registry.js'
import './NotebookTeaser.css'

function Arrow() {
  return (
    <svg className="icon-arrow" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  )
}

export default function NotebookTeaser() {
  const recent = articles.slice(0, 3)
  if (recent.length === 0) return null

  return (
    <section className="notebook" aria-labelledby="notebook-title">
      <div className="notebook-inner">
        <div className="notebook-head">
          <div>
            <p className="eyebrow">From the notebook</p>
            <h2 className="notebook-title" id="notebook-title">
              Recent notes.
            </h2>
          </div>
          <a className="notebook-link" href="#/articles">
            All articles <Arrow />
          </a>
        </div>
        <ul className="notes">
          {recent.map((a) => (
            <li key={a.slug}>
              <a className="note" href={`#/articles/${a.slug}`}>
                <time className="note-date" dateTime={a.date}>
                  {formatDate(a.date)}
                </time>
                <h3 className="note-title">{a.title}</h3>
                <p className="note-summary">{a.summary}</p>
                <span className="note-meta">{readingTime(a)}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
```

## File 2: `src/pages/NotebookTeaser.css`

Write exactly:

```css
.notebook {
  border-top: 1px solid var(--line);
}
.notebook-inner {
  max-width: var(--page-max);
  margin: 0 auto;
  padding: 56px 32px 56px;
}
.notebook-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  margin: 0 0 24px;
}
.notebook-head .eyebrow {
  margin: 0;
}
.notebook-title {
  font-size: clamp(26px, 3vw, 34px);
  line-height: 1.1;
  margin: 8px 0 0;
}
.notebook-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding-bottom: 4px;
  font-size: 14px;
  font-weight: 500;
  color: var(--moss-ink);
  text-decoration: none;
  white-space: nowrap;
}
.notebook-link .icon-arrow {
  transition: transform var(--t-fast) var(--ease-out);
}
.notebook-link:hover .icon-arrow {
  transform: translateX(3px);
}

.notes {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  list-style: none;
  margin: 0;
  padding: 0;
}
.note {
  display: flex;
  flex-direction: column;
  gap: 8px;
  height: 100%;
  padding: 20px 20px 18px;
  border: 1px solid var(--line);
  border-top: 2px solid var(--line-strong);
  border-radius: var(--r-2);
  background: var(--panel);
  color: var(--ink);
  text-decoration: none;
  transition: border-color var(--t-base) var(--ease-out), transform var(--t-base) var(--ease-out);
}
.note:hover {
  transform: translateY(-2px);
  border-top-color: var(--moss);
}
.note:focus-visible {
  outline: 2px solid var(--moss);
  outline-offset: 2px;
}
.note-date {
  font: 500 11px/1 var(--font-mono);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--muted);
}
.note-title {
  font-size: 21px;
  line-height: 1.2;
  margin: 2px 0 0;
}
.note:hover .note-title {
  color: var(--moss-ink);
}
.note-summary {
  flex: 1;
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
  color: var(--ink-2);
}
.note-meta {
  font: 500 11px/1 var(--font-mono);
  letter-spacing: 0.04em;
  color: var(--muted);
}

@media (max-width: 899px) {
  .notes {
    grid-template-columns: 1fr;
    gap: 12px;
  }
}
@media (max-width: 599px) {
  .notebook-inner {
    padding: 40px 16px 40px;
  }
  .notebook-head {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}
```

## How to tell it is right

- With at least one article module present, `#/` shows, under the tool cards, a section
  "FROM THE NOTEBOOK / Recent notes." with a green "All articles →" link at the right and
  up to three cards in a row: tiny uppercase date, serif title, grey summary, `N MIN
  READ`. Hovering a card lifts it and turns its 2px top edge green. Clicking opens
  `#/articles/<slug>`.
- With `src/articles/` containing no article modules, the section is absent and nothing
  errors.
- At 375px the cards stack in one column; the link sits under the title.
- `npm test` passes.
