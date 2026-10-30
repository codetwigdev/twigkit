---
files:
  - src/App.jsx
  - src/shell/useRoute.js
  - src/catalog.js
  - src/shell/Workspace.jsx
  - src/shell/Workspace.css
---

# 03 — App shell, router, catalog and tool workspace

> Changed in v1.1: routes for articles, the new `src/catalog.js` (categories and index
> numbers), the rail moved out to package 15 (`Rail.jsx`), a "related article" block on
> the tool page, and the eyebrow now names the category.

You own the router, the catalog (the one place that knows about tool categories and index
numbers), the `App` component and the tool page ("workspace"): the chrome around every
tool. The rail on the left and the mobile chip strip are a separate component, `Rail`,
written by another package; you render it.

Other packages provide: `Home`, `About`, `Articles`, `Article` (`src/pages/*.jsx`),
`Rail` (`src/shell/Rail.jsx`), the articles registry (`src/articles/registry.js`) and the
global CSS. Import them by the paths below even if they do not exist yet in your checkout.

## File 1: `src/catalog.js`

```js
import { tools } from './registry.js'

// Display order of the categories. A tool's index number (01, 02, …) is its position
// in `ordered`: category order first, then name. Numbers are global, never per category.
export const CATEGORIES = [
  { id: 'encode', name: 'Encode & decode', blurb: 'Base64, entities, tokens and hashes.' },
  { id: 'data', name: 'Data', blurb: 'JSON, CSV and URLs, taken apart and put back.' },
  { id: 'text', name: 'Text', blurb: 'Count, compare, sort, slug and match.' },
  { id: 'numbers', name: 'Numbers & time', blurb: 'Bases, timestamps and schedules.' },
  { id: 'pick', name: 'Colour & random', blurb: 'Pick a colour or ask for an ID.' },
]

const OTHER = { id: 'other', name: 'Other', blurb: '' }

export function categoryOf(tool) {
  return CATEGORIES.find((c) => c.id === tool.category) || OTHER
}

function rank(tool) {
  const i = CATEGORIES.findIndex((c) => c.id === tool.category)
  return i === -1 ? CATEGORIES.length : i
}

export const ordered = [...tools].sort(
  (a, b) => rank(a) - rank(b) || a.name.localeCompare(b.name),
)

export const groups = [...CATEGORIES, OTHER]
  .map((category) => ({
    category,
    tools: ordered.filter((t) => categoryOf(t).id === category.id),
  }))
  .filter((g) => g.tools.length > 0)

export const pad = (n) => String(n).padStart(2, '0')
export const num = (i) => pad(i + 1)
export const numberOf = (tool) => num(ordered.findIndex((t) => t.id === tool.id))
export const total = pad(ordered.length)

// Case-insensitive substring match over name, description, id and category name.
export function matchTools(query) {
  const q = (query || '').trim().toLowerCase()
  if (!q) return ordered
  return ordered.filter((t) =>
    `${t.name} ${t.description} ${t.id} ${categoryOf(t).name}`.toLowerCase().includes(q),
  )
}

// The architect wrote Slugify as the reference tool; every other tool was built by a worker.
export const WORKER_TOOLS = ordered.filter((t) => t.id !== 'slugify')
```

## File 2: `src/shell/useRoute.js`

```js
import { useEffect, useState } from 'react'
import { tools } from '../registry.js'
import { articleBySlug } from '../articles/registry.js'

const HOME = { kind: 'home', tool: null, article: null }

// '#/json-formatter' -> tool, '#/about' -> about, '#/articles' -> articles,
// '#/articles/<slug>' -> article (or articles when the slug is unknown), else home
export function parseHash(hash) {
  const path = (hash || '').replace(/^#\/?/, '').replace(/\/+$/, '')
  if (path === '') return HOME
  if (path === 'about') return { kind: 'about', tool: null, article: null }
  if (path === 'articles') return { kind: 'articles', tool: null, article: null }
  if (path.startsWith('articles/')) {
    const article = articleBySlug(path.slice('articles/'.length))
    return article
      ? { kind: 'article', tool: null, article }
      : { kind: 'articles', tool: null, article: null }
  }
  const tool = tools.find((t) => t.id === path)
  return tool ? { kind: 'tool', tool, article: null } : HOME
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

## File 3: `src/App.jsx`

Replace the whole file:

```jsx
import { useEffect } from 'react'
import useRoute from './shell/useRoute.js'
import Workspace from './shell/Workspace.jsx'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Articles from './pages/Articles.jsx'
import Article from './pages/Article.jsx'

const HOME_TITLE = 'TwigKit — Tiny tools, done beautifully'

function titleFor(route) {
  if (route.kind === 'tool') return `${route.tool.name} · TwigKit`
  if (route.kind === 'about') return "How it's built · TwigKit"
  if (route.kind === 'articles') return 'Articles · TwigKit'
  if (route.kind === 'article') return `${route.article.title} · TwigKit`
  return HOME_TITLE
}

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
    document.title = titleFor(route)
    if (typeof window.scrollTo === 'function') window.scrollTo(0, 0)
  }, [route])

  let page
  if (route.kind === 'tool') page = <Workspace tool={route.tool} />
  else if (route.kind === 'about') page = <About />
  else if (route.kind === 'articles') page = <Articles />
  else if (route.kind === 'article') page = <Article article={route.article} />
  else page = <Home />

  return (
    <>
      <a className="skip-link" href="#/" onClick={focusMain}>
        Skip to content
      </a>
      {page}
    </>
  )
}
```

## File 4: `src/shell/Workspace.jsx`

Props: `tool` — a registry item `{ id, name, description, icon, category, component }`.

```jsx
import { Suspense } from 'react'
import { categoryOf, numberOf, total } from '../catalog.js'
import { articlesForTool, readingTime } from '../articles/registry.js'
import Rail from './Rail.jsx'
import './Workspace.css'

function Arrow() {
  return (
    <svg className="icon-arrow" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  )
}

export default function Workspace({ tool }) {
  const Tool = tool.component
  const related = articlesForTool(tool.id)[0]

  return (
    <div className="ws">
      <Rail tool={tool} />

      <main id="main" tabIndex={-1} className="ws-main">
        <header className="tool-head">
          <p className="eyebrow">
            Tool {numberOf(tool)} of {total} · {categoryOf(tool).name}
          </p>
          <h1 className="tool-title">{tool.name}</h1>
          <p className="tool-desc">{tool.description}</p>
        </header>
        <div className="tool-body">
          <Suspense fallback={<p className="tool-loading">Loading…</p>}>
            <Tool key={tool.id} />
          </Suspense>
        </div>
        {related && (
          <aside className="tool-related" aria-label="Related article">
            <p className="eyebrow">From the notebook</p>
            <a className="tool-related-link" href={`#/articles/${related.slug}`}>
              {related.title} <Arrow />
            </a>
            <p className="tool-related-meta">
              {related.summary} <span className="tool-related-time">{readingTime(related)}</span>
            </p>
          </aside>
        )}
        <p className="ws-foot">
          Nothing you type leaves this tab. <a href="#/">All tools</a> ·{' '}
          <a href="#/articles">Articles</a> · <a href="#/about">How it's built</a>
        </p>
      </main>
    </div>
  )
}
```

The eyebrow reads `Tool 09 of 17 · Encode & decode`. The `key={tool.id}` resets tool
state when switching tools. The related block only appears when an article names this
tool in its `tool` field.

## File 5: `src/shell/Workspace.css`

Write exactly:

```css
.ws {
  display: flex;
  min-height: 100vh;
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

/* ----- related article ----- */
.tool-related {
  margin: 40px 0 0;
  padding: 18px 20px;
  border: 1px solid var(--line);
  border-left: 3px solid var(--moss);
  border-radius: var(--r-2);
  background: var(--panel);
  max-width: 64ch;
}
.tool-related .eyebrow {
  margin: 0 0 8px;
}
.tool-related-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font: 400 20px/1.2 var(--font-display);
  color: var(--ink);
  text-decoration: none;
}
.tool-related-link:hover {
  color: var(--moss-ink);
}
.tool-related-link .icon-arrow {
  flex: 0 0 16px;
  color: var(--moss);
  transition: transform var(--t-fast) var(--ease-out);
}
.tool-related-link:hover .icon-arrow {
  transform: translateX(3px);
}
.tool-related-meta {
  margin: 6px 0 0;
  font-size: 14px;
  line-height: 1.5;
  color: var(--ink-2);
}
.tool-related-time {
  margin-left: 6px;
  font: 500 11px/1 var(--font-mono);
  letter-spacing: 0.04em;
  color: var(--muted);
  white-space: nowrap;
}

/* ----- footer line ----- */
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
  .ws-main {
    max-width: none;
    padding: 24px 16px 40px;
  }
  .tool-title {
    font-size: 28px;
  }
  .tool-related {
    margin-top: 32px;
    padding: 16px;
  }
}
```

## How to tell it is right

- `#/json-formatter` shows a left rail (built by package 15) and a content column with a
  green eyebrow `TOOL 06 OF 17 · DATA` (the number is JSON Formatter's position in the
  category-ordered list; it must match the number next to it in the rail and on Home), a
  large serif title, a grey description, a hairline, then the tool.
- `#/` shows Home, `#/about` About, `#/articles` the articles index, `#/articles/nonsense`
  the articles index, `#/nonsense` Home.
- Switching tools in the rail resets the previous tool's typed input.
- When an article has `tool: 'encode-decode'`, `#/encode-decode` shows, under the tool, a
  panel with a 3px green left edge: `FROM THE NOTEBOOK`, the article title in serif with
  a green arrow, the summary and a small `N MIN READ`. Tools without an article show no
  panel.
- The footer line reads `Nothing you type leaves this tab. All tools · Articles · How
  it's built`.
- Press Tab once on page load: a green "Skip to content" pill appears top-left; Enter
  moves focus to the content column without changing the URL hash.
- The browser tab title reads "JSON Formatter · TwigKit"; on `#/articles` it reads
  "Articles · TwigKit".
- `npm test` passes.
