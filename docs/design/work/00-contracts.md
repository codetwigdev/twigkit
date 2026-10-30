# 00 — Shared contracts (prepended to every package)

You are implementing one package of the TwigKit website. TwigKit is a React 19 + Vite app
of small browser-only developer tools, plus a small set of articles. Several packages are
built in parallel by different workers; this file is what they all agree on. Follow it
exactly. Do not edit files your package does not own. Do not add npm dependencies. No
external requests of any kind (no Google Fonts, no CDN, no remote images). Icons are
inline SVG. Plain CSS files only. Never use `dangerouslySetInnerHTML`.

Code style: no semicolons, single quotes, 2-space indent, `export default function`.

## 1. File ownership

| Package | Owns |
| --- | --- |
| 01 tokens and base | `src/index.css`, `src/styles/tokens.css`, `src/styles/base.css` |
| 02 tool blocks | `src/styles/blocks.css` |
| 03 shell | `src/App.jsx`, `src/shell/useRoute.js`, `src/catalog.js`, `src/shell/Workspace.jsx`, `src/shell/Workspace.css` |
| 04 home | `src/pages/Home.jsx`, `src/pages/Home.css` |
| 05 about | `src/pages/About.jsx`, `src/pages/About.css` |
| 06 chrome | `src/theme.js`, `src/ui/chrome/Brand.jsx`, `src/ui/chrome/ToolTile.jsx`, `src/ui/chrome/ThemeToggle.jsx`, `src/ui/chrome/SiteHeader.jsx`, `src/ui/chrome/Footer.jsx`, `src/ui/chrome/chrome.css`, `index.html`, `public/favicon.svg` |
| 07 tests | `src/App.test.jsx`, `src/theme.test.js` |
| 08 articles registry | `src/articles/registry.js` |
| 09 inline parser and body | `src/articles/inline.js`, `src/articles/ArticleBody.jsx` |
| 10 article reader | `src/pages/Article.jsx`, `src/pages/Article.css` |
| 11 articles index | `src/pages/Articles.jsx`, `src/pages/Articles.css` |
| 12 article tests | `src/articles/inline.test.js`, `src/articles/registry.test.js`, `src/articles/ArticleBody.test.jsx` |
| 13 collection | `src/pages/Collection.jsx`, `src/pages/Collection.css` |
| 14 flow diagram | `src/pages/FlowDiagram.jsx`, `src/pages/FlowDiagram.css` |
| 15 rail | `src/shell/Rail.jsx`, `src/shell/Rail.css` |
| 16 notebook teaser | `src/pages/NotebookTeaser.jsx`, `src/pages/NotebookTeaser.css` |

Never touched by anyone: `src/tools/**`, `src/articles/<slug>.js` (the article modules),
`src/ui/Field.jsx`, `src/ui/Output.jsx`, `src/ui/CopyButton.jsx`, `src/registry.js`,
`src/registry.test.jsx`, `src/main.jsx`, `src/test-setup.js`.

`src/main.jsx` imports `./index.css` and renders `<App />`. `src/index.css` imports, in
this order: `./styles/tokens.css`, `./styles/base.css`, `./styles/blocks.css`. Every
component file imports its own CSS file (e.g. `import './Home.css'`).

## 2. Tools: registry, categories, numbers

`src/registry.js` exports `tools`: an array sorted by `name`, each item
`{ id, name, description, icon, category, component }`. `icon` is a 1–2 character text
glyph. `component` is a `React.lazy` component rendered inside `<Suspense>`. There are
17 tools; never hard-code that number, use `tools.length`.

`src/catalog.js` (package 03) is the only place that knows about categories and index
numbers. Everyone else imports from it:

```js
import { CATEGORIES, categoryOf, ordered, groups, pad, num, numberOf, total, matchTools, WORKER_TOOLS } from '../catalog.js'
```

- `CATEGORIES`: display order, exactly these five:

  | id | name | blurb |
  | --- | --- | --- |
  | `encode` | Encode & decode | Base64, entities, tokens and hashes. |
  | `data` | Data | JSON, CSV and URLs, taken apart and put back. |
  | `text` | Text | Count, compare, sort, slug and match. |
  | `numbers` | Numbers & time | Bases, timestamps and schedules. |
  | `pick` | Colour & random | Pick a colour or ask for an ID. |

  Tool → category mapping (set by the PM in each tool's `index.js`):
  `encode-decode`, `hash`, `html-entities`, `jwt-decoder` → `encode`;
  `csv-json`, `json-formatter`, `url-parser` → `data`;
  `line-tools`, `regex-tester`, `slugify`, `text-diff`, `text-stats` → `text`;
  `cron`, `number-base`, `timestamp` → `numbers`;
  `color`, `random` → `pick`.
  A tool with an unknown or missing category lands in a trailing group
  `{ id: 'other', name: 'Other', blurb: '' }` that is only shown when non-empty.
- `categoryOf(tool)` → the category object (or the `other` object).
- `ordered`: all tools sorted by category order, then by `name`. **Index numbers come
  from this order**: a tool's number is its position in `ordered` plus one, zero-padded
  to two digits. Numbers are global (01–17), never restart per category, and are the
  same on Home, in the rail and on the tool page.
- `groups`: `[{ category, tools }]` in category order, empty groups removed.
- `pad(n)` = `String(n).padStart(2, '0')`; `num(i)` = `pad(i + 1)`;
  `numberOf(tool)` = `num(index of tool in ordered)`; `total` = `pad(ordered.length)`.
- `matchTools(query)`: case-insensitive substring over `name + description + id +
  category name`; empty query returns `ordered`.
- `WORKER_TOOLS`: `ordered` without `slugify` (the architect wrote Slugify as the
  reference tool; every other tool was built by a worker). Use `WORKER_TOOLS.length`
  wherever the site states how many tools workers built.

`src/ui/CopyButton.jsx`: `<CopyButton text={string} />` renders
`<button class="btn" disabled={!text}>Copy</button>` (label becomes `Copied` for 1.2 s).

Tool components render only these class names and elements, which `blocks.css` styles:
`.field` (with a `label` or `.label` child; sometimes `.field` is itself a `<label>`
wrapping a checkbox), `.row`, `.grid-2`, `.btn`, `.btn.primary`, `.btn[aria-pressed]`,
`.out` (a `pre` or `div` with text, `mark` children, and usually a `.btn` copy button),
`.error`, `.stat-grid`, `.stat` (contains `b` or `strong`), `.diff-line`, `.diff-add`,
`.diff-remove`, `.swatch`, `.muted`, `table.kv` (key/value table), `.list-mono`
(monospace list), bare `textarea`, `input[type=text|number|color|checkbox]`, `select`,
`mark`, `h2`, `ul`/`ol`/`li`, `p`.

## 3. Articles

Each article is a module `src/articles/<slug>.js` with a default export:

```js
export default {
  slug: 'base64-is-not-encryption',   // equals the file name
  title: 'Base64 is not encryption',
  summary: 'One sentence for the index card.',
  date: '2026-10-30',                 // ISO date
  tags: ['encoding', 'security'],
  tool: 'encode-decode',              // optional: id of a related tool
  blocks: [
    { type: 'p', text: 'Paragraph with `code`, **bold**, *italic* and [a link](#/encode-decode).' },
    { type: 'h2', text: 'A heading' },
    { type: 'h3', text: 'A smaller heading' },
    { type: 'ul', items: ['one', 'two'] },
    { type: 'ol', items: ['first', 'second'] },
    { type: 'code', lang: 'js', text: 'const x = 1' },
    { type: 'quote', text: 'A quotation.', cite: 'Someone' },
    { type: 'callout', title: 'Note', text: 'A short aside.' },
  ],
}
```

`src/articles/registry.js` (package 08) exports:

- `articles`: every article module's default export, sorted by `date` descending, then
  `title` ascending. May be empty.
- `articleBySlug(slug)` → the article or `undefined`.
- `articlesForTool(toolId)` → articles whose `tool === toolId`, in registry order.
- `wordCount(article)` → number; `readingTime(article)` → a string like `4 min read`
  (`Math.max(1, Math.round(words / 200))`).
- `formatDate(iso)` → `30 Oct 2026` (day without leading zero, three-letter English
  month, four-digit year).

Inline markup inside `text` and `items` (package 09, `src/articles/inline.js`):
`` `code` ``, `**bold**`, `*italic*`, `[label](href)`. `parseInline(text)` returns an
array of tokens `{ t: 'text' | 'code' | 'b' | 'i', s }` or `{ t: 'a', s, href }`. Only
hrefs starting with `http:`, `https:`, `mailto:` or `#/` are links; any other `[x](y)`
is returned as plain text. No nesting: the inside of bold, italic, link labels and code
is literal text. `renderInline(text)` (same file) turns the tokens into React elements:
`code` → `<code>`, `b` → `<strong>`, `i` → `<em>`, `a` → `<a href>` (external links get
`target="_blank" rel="noopener noreferrer"`), `text` → a string.

`ArticleBody` (package 09, `src/articles/ArticleBody.jsx`): props `blocks`. Renders
`<div class="art-body">` containing, per block: `p` → `<p>`; `h2` → `<h2>`; `h3` →
`<h3>`; `ul` → `<ul>`; `ol` → `<ol>`; `code` → `<figure class="art-code">` with
`<div class="art-code-head"><span class="art-code-lang">{lang or 'code'}</span><CopyButton text={text} /></div>` then `<pre><code>{text}</code></pre>`;
`quote` → `<blockquote class="art-quote"><p>…</p><cite>…</cite></blockquote>`;
`callout` → `<aside class="art-callout"><p class="art-callout-title">{title}</p><p>…</p></aside>`.
Unknown block types render nothing. Package 10 styles all of this in `Article.css`.

## 4. Routing contract (`src/shell/useRoute.js`, package 03)

Hash based. `useRoute()` returns
`{ kind: 'home' | 'about' | 'articles' | 'article' | 'tool', tool, article }`:

- `#/`, `#`, empty hash, or anything unknown → `{ kind: 'home' }`
- `#/about` → `{ kind: 'about' }`
- `#/articles` → `{ kind: 'articles' }`
- `#/articles/<slug>` → `{ kind: 'article', article }` when the slug exists, otherwise
  `{ kind: 'articles' }`
- `#/<id>` where `<id>` matches a tool id → `{ kind: 'tool', tool }`

`tool` and `article` are `null` when not applicable. Links to pages are plain
`<a href="#/">`, `<a href="#/about">`, `<a href="#/articles">`,
`<a href="#/articles/<slug>">`, `<a href="#/<id>">`. Because hashes are routes, **never**
use `href="#section"` for in-page anchors.

## 5. Theme contract (`src/theme.js`, package 06)

- Theme is `'auto' | 'light' | 'dark'`. Stored in `localStorage` under key `twigkit-theme`
  (`'auto'` is stored as no key).
- Applied as `document.documentElement.dataset.theme = 'light' | 'dark'`; for `auto` the
  attribute is removed. CSS: `:root` holds light tokens; dark tokens apply under
  `@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) }` and under
  `:root[data-theme="dark"]`.
- Exports: `THEME_KEY`, `getTheme()`, `applyTheme(theme)`, `setTheme(theme)`,
  `nextTheme(theme)` (auto → light → dark → auto), and the hook
  `useTheme()` returning `[theme, setTheme]`. `setTheme` dispatches
  `window.dispatchEvent(new CustomEvent('twigkit:theme', { detail: theme }))`.
- `index.html` contains a tiny inline script that applies the stored theme before paint.

## 6. Component contracts (import paths are relative to `src/`)

| Component | Import | Renders |
| --- | --- | --- |
| `Brand` | `ui/chrome/Brand.jsx` | `<a class="brand" href="#/"><svg class="brand-mark">…</svg><span class="brand-name">TwigKit</span></a>`. Props: none. |
| `ToolTile` | `ui/chrome/ToolTile.jsx` | `<span class="tile tile-{size}" aria-hidden="true">{glyph}</span>`. Props: `glyph` (string), `size` = `'sm' \| 'md' \| 'lg'` (default `'md'`). |
| `ThemeToggle` | `ui/chrome/ThemeToggle.jsx` | `<button type="button" class="theme-toggle">` with the current mode's icon and a `<span class="theme-toggle-label">`. Props: none. |
| `SiteHeader` | `ui/chrome/SiteHeader.jsx` | `<header class="site-header">` with Brand, nav links `Tools` (`#/`), `Articles` (`#/articles`), `How it's built` (`#/about`), and ThemeToggle. Props: `current` = `'home' \| 'articles' \| 'about'` (sets `aria-current="page"` on the matching link). |
| `Footer` | `ui/chrome/Footer.jsx` | `<footer class="site-footer">`. Props: none. |
| `Rail` | `shell/Rail.jsx` | The desktop rail (`<aside class="rail">`, grouped by category) and the mobile bar + chip strip (`<div class="ws-mobile">`). Props: `tool` (the active registry item). |
| `Workspace` | `shell/Workspace.jsx` | The whole tool page: `Rail`, title, tool, related article, footer line. Props: `tool`. Renders the tool inside `<div class="tool-body">`, which `blocks.css` uses to scope in-tool prose rules. |
| `Home` | `pages/Home.jsx` | The whole home page incl. SiteHeader, `Collection`, `NotebookTeaser` and Footer. Props: none. |
| `Collection` | `pages/Collection.jsx` | The "Pick a tool." section: category filter pills and grouped tool cards. Props: `query` (string; the text typed in Home's jump box). |
| `NotebookTeaser` | `pages/NotebookTeaser.jsx` | Home section "From the notebook" with the three most recent articles; renders `null` when there are no articles. Props: none. |
| `About` | `pages/About.jsx` | The whole about page incl. SiteHeader and Footer. Props: none. |
| `FlowDiagram` | `pages/FlowDiagram.jsx` | The build-flow diagram (HTML/CSS + inline SVG). Props: none. |
| `Articles` | `pages/Articles.jsx` | The articles index page incl. SiteHeader and Footer. Props: none. |
| `Article` | `pages/Article.jsx` | One article's reading page incl. SiteHeader and Footer. Props: `article`. |
| `ArticleBody` | `articles/ArticleBody.jsx` | Block renderer, see §3. Props: `blocks`. |

`App.jsx` renders `<a class="skip-link" href="#/" onClick={focusMain}>Skip to content</a>`
then one of `Home`, `About`, `Articles`, `Article`, `Workspace`. Every page's main
content element is `<main id="main" tabIndex={-1} …>`. On route change App calls
`window.scrollTo(0, 0)`.

Document titles (set by App): home `TwigKit — Tiny tools, done beautifully`; about
`How it's built · TwigKit`; articles `Articles · TwigKit`; article
`${article.title} · TwigKit`; tool `${tool.name} · TwigKit`.

## 7. Constants and copy the tests look for

- `REPO_URL = 'https://github.com/codetwigdev/twigkit'` (used by Footer, About, Rail and
  Articles; a single string literal in each file that needs it).
- Home `<h1>` contains `Tiny tools`; About `<h1>` contains `One architect`; Articles
  `<h1>` contains `From the notebook`; an article page's `<h1>` is exactly the article's
  `title`; a tool page's `<h1>` is exactly the tool's `name`.
- Every page's site navigation contains a link with text `Articles` and `href="#/articles"`.
- **No stale numbers.** Never write a count of tools, workers, tests, articles, or a
  timing, as a literal in copy. Use `tools.length`, `WORKER_TOOLS.length`,
  `articles.length`. Where a sentence needs a number, interpolate it as digits.

## 8. Design tokens (names). Values live in `src/styles/tokens.css` (package 01)

Surfaces `--paper`, `--panel`, `--well`. Ink `--ink`, `--ink-2`, `--muted`.
Lines `--line`, `--line-strong`, `--rule`. Accent `--moss`, `--moss-ink`, `--moss-soft`,
`--on-moss`. Error `--clay`, `--clay-soft`. Highlights `--marker`, `--diff-add`,
`--diff-remove`, `--selection`. `--chevron` (select arrow, a data-URI `url()`).
Fonts `--font-display`, `--font-body`, `--font-mono`. Radii `--r-1` 3px, `--r-2` 6px,
`--r-3` 10px, `--r-pill` 999px. Shadows `--shadow-card`, `--shadow-sheet`.
Motion `--t-fast` 120ms, `--t-base` 180ms, `--t-slow` 320ms, `--ease-out`, `--ease-in-out`.
Layout `--rail-w` 248px, `--content-max` 880px, `--page-max` 1120px. The reading
measure for articles is a literal `760px` in the article CSS.

Global helper classes from `base.css`: `.muted`, `.eyebrow` (mono uppercase label),
`.visually-hidden`, `.skip-link`.

Breakpoints: phone `max-width: 599px`, tablet-and-below `max-width: 899px`. The workspace
rail collapses at `max-width: 899px`.

## 9. Shared inline SVG (copy exactly where used)

Arrow (16px, inside links and buttons):

```html
<svg class="icon-arrow" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4"/></svg>
```

Arrow left (16px, "All articles" / "Previous"):

```html
<svg class="icon-arrow-left" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M13 8H3M7 4L3 8l4 4"/></svg>
```

Check (16px):

```html
<svg class="icon-check" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3.5 8.5l3 3 6-6.5"/></svg>
```

Twig mark (brand, 24px; the `Brand` component renders it, other files do not):

```html
<svg class="brand-mark" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21.5V9"/><path d="M12 13.5c0-3.3 2.4-5.5 5.5-5.5 0 3.3-2.4 5.5-5.5 5.5z"/><path d="M12 18c0-3.3-2.4-5.5-5.5-5.5 0 3.3 2.4 5.5 5.5 5.5z"/><path d="M12 9c0-2.8 1-5 2.5-6.5"/></svg>
```

In JSX, write attributes as `strokeWidth`, `strokeLinecap`, `strokeLinejoin`, `className`.
