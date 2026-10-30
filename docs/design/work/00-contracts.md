# 00 — Shared contracts (prepended to every package)

You are implementing one package of the TwigKit redesign. TwigKit is a React 19 + Vite app
of small browser-only developer tools. Several packages are built in parallel by different
workers; this file is what they all agree on. Follow it exactly. Do not edit files your
package does not own. Do not add npm dependencies. No external requests of any kind (no
Google Fonts, no CDN, no remote images). Icons are inline SVG. Plain CSS files only.

Code style: no semicolons, single quotes, 2-space indent, `export default function`.

## 1. File ownership

| Package | Owns |
| --- | --- |
| 01 tokens and base | `src/index.css`, `src/styles/tokens.css`, `src/styles/base.css` |
| 02 tool blocks | `src/styles/blocks.css` |
| 03 shell and workspace | `src/App.jsx`, `src/shell/useRoute.js`, `src/shell/Workspace.jsx`, `src/shell/Workspace.css` |
| 04 home | `src/pages/Home.jsx`, `src/pages/Home.css` |
| 05 about | `src/pages/About.jsx`, `src/pages/FlowDiagram.jsx`, `src/pages/About.css` |
| 06 chrome | `src/theme.js`, `src/ui/chrome/Brand.jsx`, `src/ui/chrome/ToolTile.jsx`, `src/ui/chrome/ThemeToggle.jsx`, `src/ui/chrome/SiteHeader.jsx`, `src/ui/chrome/Footer.jsx`, `src/ui/chrome/chrome.css`, `index.html`, `public/favicon.svg` |
| 07 tests | `src/App.test.jsx`, `src/theme.test.js` |

Never touched by anyone: `src/tools/**`, `src/ui/Field.jsx`, `src/ui/Output.jsx`,
`src/ui/CopyButton.jsx`, `src/registry.js`, `src/main.jsx`, `src/test-setup.js`.

`src/main.jsx` imports `./index.css` and renders `<App />`. `src/index.css` imports, in
this order: `./styles/tokens.css`, `./styles/base.css`, `./styles/blocks.css`. Every
component file imports its own CSS file (e.g. `import './Home.css'`).

## 2. Existing things you can rely on

`src/registry.js` exports `tools`: an array sorted by `name`, each item
`{ id, name, description, icon, component }`. `icon` is a 1–2 character text glyph
(`{}`, `64`, `t`, `#`, `?`, `.*`, `/`, `+-`, `Aa`). `component` is a `React.lazy`
component rendered inside `<Suspense>`. There are 9 tools. The tool's index number is
its position in `tools` plus one, zero-padded to two digits: `String(i + 1).padStart(2, '0')`.

`src/ui/CopyButton.jsx`: `<CopyButton text={string} />` renders
`<button class="btn" disabled={!text}>Copy</button>` (label becomes `Copied` for 1.2 s).

The nine tool components render only these class names and elements, which `blocks.css`
styles: `.field` (with a `label` or `.label` child; sometimes `.field` is itself a
`<label>` wrapping a checkbox), `.row`, `.grid-2`, `.btn`, `.btn.primary`,
`.btn[aria-pressed]`, `.out` (a `pre` or `div` with text, `mark` children, and usually a
`.btn` copy button), `.error`, `.stat-grid`, `.stat` (contains `b` or `strong`),
`.diff-line`, `.diff-add`, `.diff-remove`, `.swatch`, `.muted`, bare `textarea`,
`input[type=text|number|color|checkbox]`, `select`, `mark`, `h2`, `ul`/`li`, `p`.

## 3. Routing contract (`src/shell/useRoute.js`, package 03)

Hash based. `useRoute()` returns `{ kind: 'home' | 'about' | 'tool', tool }`:

- `#/`, `#`, empty hash, or anything unknown → `{ kind: 'home', tool: null }`
- `#/about` → `{ kind: 'about', tool: null }`
- `#/<id>` where `<id>` matches a tool id → `{ kind: 'tool', tool }`

Links to pages are plain `<a href="#/">`, `<a href="#/about">`, `<a href="#/<id>">`.
Because hashes are routes, **never** use `href="#section"` for in-page anchors.

## 4. Theme contract (`src/theme.js`, package 06)

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

## 5. Component contracts (import paths are relative to `src/`)

| Component | Import | Renders |
| --- | --- | --- |
| `Brand` | `ui/chrome/Brand.jsx` | `<a class="brand" href="#/"><svg class="brand-mark">…</svg><span class="brand-name">TwigKit</span></a>`. Props: none. |
| `ToolTile` | `ui/chrome/ToolTile.jsx` | `<span class="tile tile-{size}" aria-hidden="true">{glyph}</span>`. Props: `glyph` (string), `size` = `'sm' \| 'md' \| 'lg'` (default `'md'`). |
| `ThemeToggle` | `ui/chrome/ThemeToggle.jsx` | `<button type="button" class="theme-toggle">` with the current mode's icon. Props: none. |
| `SiteHeader` | `ui/chrome/SiteHeader.jsx` | `<header class="site-header">` with Brand, nav links `Tools` (`#/`) and `How it's built` (`#/about`), and ThemeToggle. Props: `current` = `'home' \| 'about'` (sets `aria-current="page"` on the matching link). |
| `Footer` | `ui/chrome/Footer.jsx` | `<footer class="site-footer">`. Props: none. |
| `Workspace` | `shell/Workspace.jsx` | The whole tool page (rail, title, tool, footer). Props: `tool` (registry item). Renders the tool inside `<div class="tool-body">`, which `blocks.css` uses to scope in-tool prose rules. |
| `Home` | `pages/Home.jsx` | The whole home page incl. SiteHeader and Footer. Props: none. |
| `About` | `pages/About.jsx` | The whole about page incl. SiteHeader and Footer. Props: none. |
| `FlowDiagram` | `pages/FlowDiagram.jsx` | The build-flow diagram (HTML/CSS + inline SVG). Props: none. |

`App.jsx` renders `<a class="skip-link" href="#/" onClick={focusMain}>Skip to content</a>`
then one of `Home`, `About`, `Workspace`. Every page's main content element is
`<main id="main" tabIndex={-1} …>`. On route change App calls `window.scrollTo(0, 0)`.

Document titles (set by App): home `TwigKit — Tiny tools, done beautifully`; about
`How it's built · TwigKit`; tool `${tool.name} · TwigKit`.

## 6. Constants

- `REPO_URL = 'https://github.com/codetwigdev/twigkit'` (used by Footer, About and
  Workspace; a single string literal in each file that needs it). The project manager
  confirms the real URL before the packages run; change it in those three files only.
- Index numbers: `const pad = (n) => String(n).padStart(2, '0')` and
  `const num = (i) => pad(i + 1)`; a tool's number is `num(tools.indexOf(tool))`, the
  total is `pad(tools.length)`.
- Text the tests look for: Home `<h1>` contains `Tiny tools`; About `<h1>` contains
  `One architect`; a tool page's `<h1>` is exactly the tool's `name`.
- Footer copy and links are defined in package 06 only.

## 7. Design tokens (names). Values live in `src/styles/tokens.css` (package 01)

Surfaces `--paper`, `--panel`, `--well`. Ink `--ink`, `--ink-2`, `--muted`.
Lines `--line`, `--line-strong`, `--rule`. Accent `--moss`, `--moss-ink`, `--moss-soft`,
`--on-moss`. Error `--clay`, `--clay-soft`. Highlights `--marker`, `--diff-add`,
`--diff-remove`, `--selection`. `--chevron` (select arrow, a data-URI `url()`).
Fonts `--font-display`, `--font-body`, `--font-mono`. Radii `--r-1` 3px, `--r-2` 6px,
`--r-3` 10px, `--r-pill` 999px. Shadows `--shadow-card`, `--shadow-sheet`.
Motion `--t-fast` 120ms, `--t-base` 180ms, `--t-slow` 320ms, `--ease-out`, `--ease-in-out`.
Layout `--rail-w` 248px, `--content-max` 880px, `--page-max` 1120px.

Global helper classes from `base.css`: `.muted`, `.eyebrow` (mono uppercase label),
`.visually-hidden`, `.skip-link`.

Breakpoints: phone `max-width: 599px`, tablet-and-below `max-width: 899px`. The workspace
rail collapses at `max-width: 899px`.

## 8. Shared inline SVG (copy exactly where used)

Arrow (16px, inside links and buttons):

```html
<svg class="icon-arrow" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4"/></svg>
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
