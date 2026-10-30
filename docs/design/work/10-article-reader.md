---
files:
  - src/pages/Article.jsx
  - src/pages/Article.css
---

# 10 — Article reading page

You own the page that shows one article (route `#/articles/<slug>`) and the CSS for the
article body (the block renderer `ArticleBody` is another package; you style what it
renders). This is a long-form reading page: one calm column, a generous measure, serif
headings, body text slightly larger than the rest of the site, code blocks in a well with
a copy button, a quiet callout, a "Try the tool" card at the end, and previous/next
links.

Other packages provide `SiteHeader`, `Footer`, `ToolTile` (`src/ui/chrome/*.jsx`),
`ArticleBody` (`src/articles/ArticleBody.jsx`), the articles registry
(`src/articles/registry.js`: `articles`, `readingTime`, `formatDate`) and `src/registry.js`
(`tools`). Import them by path even if they do not exist yet.

`ArticleBody` renders `<div class="art-body">` containing bare `p`, `h2`, `h3`, `ul`,
`ol`, inline `code`, `strong`, `em`, `a`, and these structures:

```html
<figure class="art-code">
  <div class="art-code-head"><span class="art-code-lang">js</span><button class="btn">Copy</button></div>
  <pre><code>…</code></pre>
</figure>
<blockquote class="art-quote"><p>…</p><cite>Someone</cite></blockquote>
<aside class="art-callout"><p class="art-callout-title">Note</p><p>…</p></aside>
```

## File 1: `src/pages/Article.jsx`

Props: `article` — an article object `{ slug, title, summary, date, tags, tool, blocks }`.

```jsx
import { tools } from '../registry.js'
import { articles, formatDate, readingTime } from '../articles/registry.js'
import ArticleBody from '../articles/ArticleBody.jsx'
import SiteHeader from '../ui/chrome/SiteHeader.jsx'
import Footer from '../ui/chrome/Footer.jsx'
import ToolTile from '../ui/chrome/ToolTile.jsx'
import './Article.css'

function Arrow() {
  return (
    <svg className="icon-arrow" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  )
}

function ArrowLeft() {
  return (
    <svg className="icon-arrow-left" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M13 8H3M7 4L3 8l4 4" />
    </svg>
  )
}

export default function Article({ article }) {
  const index = articles.findIndex((a) => a.slug === article.slug)
  const prev = index > 0 ? articles[index - 1] : null
  const next = index >= 0 && index < articles.length - 1 ? articles[index + 1] : null
  const tool = article.tool ? tools.find((t) => t.id === article.tool) : null
  const tags = article.tags || []

  return (
    <div className="art">
      <SiteHeader current="articles" />
      <main id="main" tabIndex={-1}>
        <article className="art-inner">
          <a className="art-back" href="#/articles">
            <ArrowLeft /> All articles
          </a>
          <header className="art-head">
            <p className="art-meta">
              <time dateTime={article.date}>{formatDate(article.date)}</time>
              <span aria-hidden="true"> · </span>
              <span>{readingTime(article)}</span>
            </p>
            <h1 className="art-title">{article.title}</h1>
            <p className="art-summary">{article.summary}</p>
            {tags.length > 0 && (
              <ul className="tags" aria-label="Tags">
                {tags.map((t) => (
                  <li key={t} className="tag">
                    {t}
                  </li>
                ))}
              </ul>
            )}
          </header>

          <ArticleBody blocks={article.blocks} />

          {tool && (
            <aside className="art-try" aria-label="Try the tool">
              <ToolTile glyph={tool.icon} size="md" />
              <div className="art-try-text">
                <p className="eyebrow">Try the tool</p>
                <p className="art-try-name">{tool.name}</p>
                <p className="art-try-desc">{tool.description}</p>
              </div>
              <a className="btn primary art-try-btn" href={`#/${tool.id}`}>
                Open {tool.name} <Arrow />
              </a>
            </aside>
          )}

          {(prev || next) && (
            <nav className="art-nav" aria-label="More articles">
              {prev ? (
                <a className="art-nav-link art-nav-prev" href={`#/articles/${prev.slug}`}>
                  <span className="eyebrow">Previous</span>
                  <span className="art-nav-title">{prev.title}</span>
                </a>
              ) : (
                <span />
              )}
              {next ? (
                <a className="art-nav-link art-nav-next" href={`#/articles/${next.slug}`}>
                  <span className="eyebrow">Next</span>
                  <span className="art-nav-title">{next.title}</span>
                </a>
              ) : (
                <span />
              )}
            </nav>
          )}
        </article>
      </main>
      <Footer />
    </div>
  )
}
```

"Previous" is the article above this one in the index (newer); "Next" is the one below
(older). The "Try the tool" card only appears when `article.tool` names an existing tool.

## File 2: `src/pages/Article.css`

Write exactly:

```css
.art main:focus {
  outline: none;
}
.art-inner {
  max-width: calc(680px + 64px);
  margin: 0 auto;
  padding: 40px 32px 72px;
}

/* ----- head ----- */
.art-back {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin: 0 0 32px;
  font-size: 13px;
  color: var(--ink-2);
  text-decoration: none;
}
.art-back:hover {
  color: var(--moss-ink);
}
.art-back .icon-arrow-left {
  transition: transform var(--t-fast) var(--ease-out);
}
.art-back:hover .icon-arrow-left {
  transform: translateX(-2px);
}
.art-head {
  margin: 0 0 36px;
  padding-bottom: 28px;
  border-bottom: 1px solid var(--line);
}
.art-meta {
  margin: 0 0 14px;
  font: 500 11px/1 var(--font-mono);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--moss);
}
.art-title {
  font-size: clamp(32px, 4.5vw, 48px);
  line-height: 1.1;
  letter-spacing: -0.02em;
  margin: 0 0 16px;
}
.art-summary {
  margin: 0;
  font-size: clamp(17px, 1.6vw, 20px);
  line-height: 1.5;
  color: var(--ink-2);
}
.art .tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  list-style: none;
  margin: 20px 0 0;
  padding: 0;
}
.art .tag {
  padding: 4px 9px;
  border: 1px solid var(--line);
  border-radius: var(--r-pill);
  background: var(--panel);
  font: 500 11px/1 var(--font-mono);
  letter-spacing: 0.04em;
  color: var(--ink-2);
}

/* ----- body ----- */
.art-body {
  font-size: 17px;
  line-height: 1.65;
  color: var(--ink);
}
.art-body > p {
  margin: 0 0 20px;
}
.art-body h2 {
  font-size: 26px;
  line-height: 1.2;
  margin: 44px 0 12px;
}
.art-body h3 {
  font-size: 20px;
  line-height: 1.25;
  margin: 32px 0 8px;
}
.art-body h2:first-child,
.art-body h3:first-child {
  margin-top: 0;
}
.art-body ul,
.art-body ol {
  margin: 0 0 20px;
  padding-left: 24px;
}
.art-body li {
  margin: 0 0 6px;
}
.art-body li::marker {
  color: var(--muted);
}
.art-body a {
  color: var(--moss-ink);
  text-decoration-color: var(--line-strong);
}
.art-body a:hover {
  text-decoration-color: currentColor;
}
.art-body strong {
  font-weight: 600;
}
.art-body code {
  font-size: 0.88em;
  padding: 1px 5px;
  border-radius: var(--r-1);
  background: var(--well);
  color: var(--ink);
}

/* code block */
.art-code {
  margin: 0 0 24px;
  border: 1px solid var(--line);
  border-radius: var(--r-2);
  background: var(--well);
  overflow: hidden;
}
.art-code-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 6px 8px 6px 14px;
  border-bottom: 1px solid var(--line);
}
.art-code-lang {
  font: 500 11px/1 var(--font-mono);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--muted);
}
.art-code .btn {
  min-height: 28px;
  padding: 3px 10px;
  font-size: 12px;
  background: var(--panel);
}
.art-code pre {
  margin: 0;
  padding: 14px 16px;
  overflow-x: auto;
  font: 13.5px/1.6 var(--font-mono);
  color: var(--ink);
  tab-size: 2;
}
.art-code pre code {
  font-size: inherit;
  padding: 0;
  background: transparent;
  border-radius: 0;
}

/* quote */
.art-quote {
  margin: 28px 0;
  padding: 4px 0 4px 20px;
  border-left: 3px solid var(--line-strong);
}
.art-quote p {
  margin: 0;
  font: italic 400 20px/1.5 var(--font-display);
  color: var(--ink-2);
}
.art-quote cite {
  display: block;
  margin-top: 8px;
  font: 500 12px/1 var(--font-mono);
  letter-spacing: 0.04em;
  font-style: normal;
  color: var(--muted);
}
.art-quote cite::before {
  content: '— ';
}

/* callout */
.art-callout {
  margin: 28px 0;
  padding: 14px 18px;
  border: 1px solid var(--line);
  border-left: 3px solid var(--moss);
  border-radius: var(--r-2);
  background: var(--moss-soft);
}
.art-callout-title {
  margin: 0 0 6px;
  font: 500 11px/1 var(--font-mono);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--moss-ink);
}
.art-callout p:last-child {
  margin: 0;
  font-size: 15px;
  line-height: 1.55;
  color: var(--ink);
}

/* ----- try the tool ----- */
.art-try {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 16px 20px;
  align-items: center;
  margin: 48px 0 0;
  padding: 20px 24px;
  border: 1px solid var(--line);
  border-radius: var(--r-3);
  background: var(--panel);
}
.art-try .eyebrow {
  margin: 0 0 4px;
  color: var(--moss);
}
.art-try-name {
  margin: 0 0 2px;
  font: 400 22px/1.15 var(--font-display);
  color: var(--ink);
}
.art-try-desc {
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
  color: var(--ink-2);
}
.art-try-btn {
  text-decoration: none;
  white-space: nowrap;
}

/* ----- previous / next ----- */
.art-nav {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin: 40px 0 0;
  padding-top: 24px;
  border-top: 1px solid var(--line);
}
.art-nav-link {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 14px 16px;
  border: 1px solid var(--line);
  border-radius: var(--r-2);
  color: var(--ink);
  text-decoration: none;
  transition: border-color var(--t-fast) var(--ease-out);
}
.art-nav-link:hover {
  border-color: var(--line-strong);
}
.art-nav-link:hover .art-nav-title {
  color: var(--moss-ink);
}
.art-nav-next {
  text-align: right;
  align-items: flex-end;
}
.art-nav-title {
  font: 400 18px/1.25 var(--font-display);
}

/* ----- responsive ----- */
@media (max-width: 599px) {
  .art-inner {
    padding: 24px 16px 56px;
  }
  .art-back {
    margin-bottom: 24px;
  }
  .art-body {
    font-size: 16px;
  }
  .art-body h2 {
    font-size: 23px;
    margin-top: 36px;
  }
  .art-try {
    grid-template-columns: auto 1fr;
    padding: 16px;
  }
  .art-try-btn {
    grid-column: 1 / -1;
    justify-content: center;
  }
  .art-nav {
    grid-template-columns: 1fr;
  }
  .art-nav-next {
    text-align: left;
    align-items: flex-start;
  }
}
```

## How to tell it is right

- With at least one article module present, `#/articles/<slug>` shows: the site header
  with "Articles" underlined green; a small grey "← All articles" link; a green uppercase
  meta line `30 OCT 2026 · 4 MIN READ`; a large serif title; a grey lead sentence; small
  monospace tag pills; a hairline; then the body in a column at most 680px wide with
  17px text, serif headings, dark-beige inline code, code blocks in a well with a
  language label and a `Copy` button in a header strip, a serif italic block quote with a
  `— Someone` line, and a pale green callout with a green left edge and an uppercase
  title.
- When the article names a tool: a panel at the end with the tool's glyph tile, `TRY
  THE TOOL`, the tool name in serif, its description and a solid green `Open <Name> →`
  button that goes to `#/<id>`.
- Below, two boxed links "PREVIOUS / <title>" and "NEXT / <title>" when they exist; with a
  single article the nav is absent.
- At 375px: 16px gutters, 16px body text, code blocks scroll horizontally inside their
  box (the page does not), the try-the-tool button spans the full width, the nav stacks.
- The browser tab reads `<Title> · TwigKit`.
- `npm test` passes.
