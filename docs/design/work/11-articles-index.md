---
files:
  - src/pages/Articles.jsx
  - src/pages/Articles.css
---

# 11 — Articles index page

You own the articles index (route `#/articles`): a short hero on ruled paper and a list
of every article, newest first, each entry showing date, title, summary, reading time,
tags and the related tool. It must look right with eight articles and with none.

Other packages provide `SiteHeader`, `Footer`, `ToolTile` (`src/ui/chrome/*.jsx`), the
articles registry (`src/articles/registry.js`: `articles`, `readingTime`, `formatDate`)
and `src/registry.js` (`tools`). Import them by path even if they do not exist yet.

Visual idea: the contents page of a notebook. Warm paper, faint horizontal rules behind
the hero, a serif headline, a hairline-ruled list with the date in a narrow monospace
column on the left.

## File 1: `src/pages/Articles.jsx`

```jsx
import { tools } from '../registry.js'
import { articles, formatDate, readingTime } from '../articles/registry.js'
import SiteHeader from '../ui/chrome/SiteHeader.jsx'
import Footer from '../ui/chrome/Footer.jsx'
import ToolTile from '../ui/chrome/ToolTile.jsx'
import './Articles.css'

const REPO_URL = 'https://github.com/codetwigdev/twigkit'

export default function Articles() {
  return (
    <div className="arts">
      <SiteHeader current="articles" />
      <main id="main" tabIndex={-1}>
        <section className="arts-hero">
          <div className="arts-hero-inner">
            <p className="eyebrow">Articles</p>
            <h1 className="arts-title">From the notebook.</h1>
            <p className="arts-lead">
              Short, practical notes on the ideas behind the tools: what Base64 actually
              is, how to read a token, why cron has five fields. Each note links to the
              tool it explains, and each tool links back.
            </p>
          </div>
        </section>

        <section className="arts-list-wrap" aria-label="All articles">
          {articles.length > 0 ? (
            <ol className="arts-list">
              {articles.map((a) => {
                const tool = a.tool ? tools.find((t) => t.id === a.tool) : null
                return (
                  <li key={a.slug} className="arts-item">
                    <time className="arts-date" dateTime={a.date}>
                      {formatDate(a.date)}
                    </time>
                    <div className="arts-main">
                      <h2 className="arts-item-title">
                        <a href={`#/articles/${a.slug}`}>{a.title}</a>
                      </h2>
                      <p className="arts-summary">{a.summary}</p>
                      <div className="arts-meta">
                        <span className="arts-time">{readingTime(a)}</span>
                        {(a.tags || []).length > 0 && (
                          <ul className="tags" aria-label="Tags">
                            {a.tags.map((t) => (
                              <li key={t} className="tag">
                                {t}
                              </li>
                            ))}
                          </ul>
                        )}
                        {tool && (
                          <a className="arts-tool" href={`#/${tool.id}`}>
                            <ToolTile glyph={tool.icon} size="sm" />
                            {tool.name}
                          </a>
                        )}
                      </div>
                    </div>
                  </li>
                )
              })}
            </ol>
          ) : (
            <p className="arts-empty">
              No articles yet. The first notes are being written; the tools are{' '}
              <a href="#/">already here</a>.
            </p>
          )}
          <p className="arts-foot">
            Articles are data files in the repository, rendered without any HTML
            injection. <a href={REPO_URL}>Read them on GitHub</a>.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  )
}
```

## File 2: `src/pages/Articles.css`

Write exactly:

```css
.arts main:focus {
  outline: none;
}

/* ----- hero ----- */
.arts-hero {
  border-bottom: 1px solid var(--line);
  background-image: repeating-linear-gradient(to bottom, transparent 0 31px, var(--rule) 31px 32px);
}
.arts-hero-inner {
  max-width: var(--page-max);
  margin: 0 auto;
  padding: 72px 32px 48px;
}
.arts-hero .eyebrow {
  color: var(--moss);
  margin: 0 0 16px;
}
.arts-title {
  font-size: clamp(34px, 5vw, 60px);
  line-height: 1.05;
  letter-spacing: -0.02em;
  margin: 0 0 20px;
}
.arts-lead {
  font-size: clamp(16px, 1.5vw, 19px);
  line-height: 1.5;
  color: var(--ink-2);
  max-width: 60ch;
  margin: 0;
}

/* ----- list ----- */
.arts-list-wrap {
  max-width: var(--page-max);
  margin: 0 auto;
  padding: 24px 32px 64px;
}
.arts-list {
  list-style: none;
  margin: 0;
  padding: 0;
}
.arts-item {
  display: grid;
  grid-template-columns: 140px 1fr;
  gap: 8px 32px;
  padding: 28px 0;
  border-bottom: 1px solid var(--line);
}
.arts-date {
  padding-top: 6px;
  font: 500 11px/1.6 var(--font-mono);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--muted);
  white-space: nowrap;
}
.arts-main {
  max-width: 68ch;
  min-width: 0;
}
.arts-item-title {
  margin: 0 0 8px;
  font-size: clamp(22px, 2.4vw, 28px);
  line-height: 1.2;
}
.arts-item-title a {
  color: var(--ink);
  text-decoration: none;
}
.arts-item-title a:hover {
  color: var(--moss-ink);
  text-decoration: underline;
  text-decoration-color: var(--line-strong);
  text-underline-offset: 4px;
}
.arts-summary {
  margin: 0 0 12px;
  font-size: 16px;
  line-height: 1.55;
  color: var(--ink-2);
}
.arts-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 16px;
}
.arts-time {
  font: 500 11px/1 var(--font-mono);
  letter-spacing: 0.04em;
  color: var(--muted);
  white-space: nowrap;
}
.arts .tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  list-style: none;
  margin: 0;
  padding: 0;
}
.arts .tag {
  padding: 4px 9px;
  border: 1px solid var(--line);
  border-radius: var(--r-pill);
  background: var(--panel);
  font: 500 11px/1 var(--font-mono);
  letter-spacing: 0.04em;
  color: var(--ink-2);
}
.arts-tool {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 2px 10px 2px 2px;
  border: 1px solid var(--line);
  border-radius: var(--r-pill);
  background: var(--panel);
  font-size: 13px;
  color: var(--ink-2);
  text-decoration: none;
  transition: border-color var(--t-fast) var(--ease-out), color var(--t-fast) var(--ease-out);
}
.arts-tool:hover {
  border-color: var(--moss);
  color: var(--moss-ink);
}
.arts-tool:hover .tile {
  background: var(--moss);
  border-color: var(--moss);
  color: var(--on-moss);
}
.arts-empty {
  margin: 24px 0 0;
  padding: 40px 20px;
  border: 1px dashed var(--line-strong);
  border-radius: var(--r-3);
  text-align: center;
  color: var(--muted);
}
.arts-foot {
  margin: 32px 0 0;
  font-size: 13px;
  line-height: 1.5;
  color: var(--muted);
  max-width: 64ch;
}

/* ----- responsive ----- */
@media (max-width: 699px) {
  .arts-item {
    grid-template-columns: 1fr;
    gap: 6px;
    padding: 24px 0;
  }
  .arts-date {
    padding-top: 0;
  }
}
@media (max-width: 599px) {
  .arts-hero-inner {
    padding: 48px 16px 36px;
  }
  .arts-list-wrap {
    padding: 8px 16px 48px;
  }
}
```

## How to tell it is right

- `#/articles` at 1280px: header with "Articles" underlined green; a hero on faintly
  ruled paper: green `ARTICLES`, serif "From the notebook.", grey lead. Below, each
  article is a hairline-separated row: a tiny uppercase date in a 140px column on the
  left; on the right a serif title (hover: green with an underline), a grey summary, then
  a meta row with `4 MIN READ`, small tag pills and, when the article names a tool, a
  pill with the tool's glyph tile and name that links to the tool. Newest article first.
- With no article modules present: a dashed box "No articles yet. …" and nothing errors.
- At 375px the date sits above the title in one column; 16px gutters; no horizontal
  scroll.
- The browser tab reads `Articles · TwigKit`.
- `npm test` passes.
