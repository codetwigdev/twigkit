---
files:
  - src/theme.js
  - src/ui/chrome/Brand.jsx
  - src/ui/chrome/ToolTile.jsx
  - src/ui/chrome/ThemeToggle.jsx
  - src/ui/chrome/SiteHeader.jsx
  - src/ui/chrome/Footer.jsx
  - src/ui/chrome/chrome.css
  - index.html
  - public/favicon.svg
---

# 06 — Chrome: brand, tool tile, theme toggle, site header, footer, favicon

You own the small shared pieces every page uses: the logo (`Brand`), the glyph tile that
represents a tool (`ToolTile`), the theme toggle and the theme store behind it, the site
header used by Home and About, the footer, the HTML entry file and the favicon.

Visual idea: warm paper, ink text, one green accent ("moss"), serif wordmark, monospace
glyph tiles, hairlines. All CSS values are given below; the colour tokens
(`--paper`, `--panel`, `--well`, `--ink`, `--ink-2`, `--muted`, `--line`, `--line-strong`,
`--moss`, `--moss-ink`, `--moss-soft`, `--on-moss`, `--font-display`, `--font-mono`,
`--r-1`, `--r-2`, `--r-3`, `--r-pill`, `--t-fast`, `--t-base`, `--ease-out`, `--page-max`)
are defined by another package.

## File 1: `src/theme.js`

```js
import { useEffect, useState } from 'react'

export const THEME_KEY = 'twigkit-theme'
export const THEMES = ['auto', 'light', 'dark']

export function getTheme() {
  try {
    const v = localStorage.getItem(THEME_KEY)
    return v === 'light' || v === 'dark' ? v : 'auto'
  } catch {
    return 'auto'
  }
}

export function applyTheme(theme) {
  const el = document.documentElement
  if (theme === 'light' || theme === 'dark') el.dataset.theme = theme
  else delete el.dataset.theme
}

export function setTheme(theme) {
  try {
    if (theme === 'auto') localStorage.removeItem(THEME_KEY)
    else localStorage.setItem(THEME_KEY, theme)
  } catch {
    // storage unavailable; the theme still applies for this page view
  }
  applyTheme(theme)
  window.dispatchEvent(new CustomEvent('twigkit:theme', { detail: theme }))
}

export function nextTheme(theme) {
  return theme === 'auto' ? 'light' : theme === 'light' ? 'dark' : 'auto'
}

export function useTheme() {
  const [theme, set] = useState(getTheme)
  useEffect(() => {
    const onChange = (e) => set(e.detail)
    window.addEventListener('twigkit:theme', onChange)
    return () => window.removeEventListener('twigkit:theme', onChange)
  }, [])
  return [theme, setTheme]
}
```

## File 2: `src/ui/chrome/Brand.jsx`

```jsx
import './chrome.css'

export default function Brand() {
  return (
    <a className="brand" href="#/" aria-label="TwigKit home">
      <svg className="brand-mark" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 21.5V9" />
        <path d="M12 13.5c0-3.3 2.4-5.5 5.5-5.5 0 3.3-2.4 5.5-5.5 5.5z" />
        <path d="M12 18c0-3.3-2.4-5.5-5.5-5.5 0 3.3 2.4 5.5 5.5 5.5z" />
        <path d="M12 9c0-2.8 1-5 2.5-6.5" />
      </svg>
      <span className="brand-name">TwigKit</span>
    </a>
  )
}
```

## File 3: `src/ui/chrome/ToolTile.jsx`

```jsx
import './chrome.css'

// A tool's 1-2 character glyph in a small square. size: 'sm' (26px) | 'md' (44px) | 'lg' (56px)
export default function ToolTile({ glyph, size = 'md' }) {
  return (
    <span className={`tile tile-${size}`} aria-hidden="true">
      {glyph}
    </span>
  )
}
```

## File 4: `src/ui/chrome/ThemeToggle.jsx`

One button that cycles Auto → Light → Dark → Auto. It shows the icon of the **current**
mode and a short label.

```jsx
import { useTheme, nextTheme } from '../../theme.js'
import './chrome.css'

const LABEL = { auto: 'Auto', light: 'Light', dark: 'Dark' }

function Icon({ theme }) {
  const common = {
    width: 16,
    height: 16,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.75,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': 'true',
  }
  if (theme === 'light') {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2.5V5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8" />
      </svg>
    )
  }
  if (theme === 'dark') {
    return (
      <svg {...common}>
        <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" />
      </svg>
    )
  }
  return (
    <svg {...common}>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 4a8 8 0 0 1 0 16z" fill="currentColor" stroke="none" />
    </svg>
  )
}

export default function ThemeToggle() {
  const [theme, setTheme] = useTheme()
  const next = nextTheme(theme)
  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={() => setTheme(next)}
      aria-label={`Theme: ${LABEL[theme]}. Switch to ${LABEL[next]}`}
      title={`Theme: ${LABEL[theme]}`}
    >
      <Icon theme={theme} />
      <span className="theme-toggle-label">{LABEL[theme]}</span>
    </button>
  )
}
```

## File 5: `src/ui/chrome/SiteHeader.jsx`

Props: `current` = `'home' | 'about'`.

```jsx
import Brand from './Brand.jsx'
import ThemeToggle from './ThemeToggle.jsx'
import './chrome.css'

export default function SiteHeader({ current }) {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Brand />
        <nav className="site-nav" aria-label="Site">
          <a href="#/" aria-current={current === 'home' ? 'page' : undefined}>
            Tools
          </a>
          <a href="#/about" aria-current={current === 'about' ? 'page' : undefined}>
            How it's built
          </a>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}
```

## File 6: `src/ui/chrome/Footer.jsx`

```jsx
import Brand from './Brand.jsx'
import './chrome.css'

const REPO_URL = 'https://github.com/codetwigdev/twigkit'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="site-footer-brand">
          <Brand />
          <p className="site-footer-tag">Tiny tools, done beautifully.</p>
        </div>
        <nav className="site-footer-nav" aria-label="Footer">
          <a href="#/">Tools</a>
          <a href="#/about">How it's built</a>
          <a href={REPO_URL}>Source on GitHub</a>
        </nav>
        <p className="site-footer-note">
          A free, open-source test project by CodeTwig. MIT licensed. Nothing you type
          leaves this tab: there is no server to send it to.
        </p>
      </div>
    </footer>
  )
}
```

## File 7: `src/ui/chrome/chrome.css`

Write exactly:

```css
/* ----- brand ----- */
.brand {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--ink);
  text-decoration: none;
}
.brand-mark {
  flex: 0 0 24px;
  color: var(--moss);
  transition: transform var(--t-base) var(--ease-out);
}
.brand:hover .brand-mark {
  transform: rotate(-10deg);
}
.brand-name {
  font: 500 20px/1 var(--font-display);
  letter-spacing: -0.01em;
}
.brand:focus-visible {
  outline: 2px solid var(--moss);
  outline-offset: 4px;
  border-radius: 2px;
}

/* ----- tool tile ----- */
.tile {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  border: 1px solid var(--line);
  background: var(--well);
  color: var(--ink-2);
  font-family: var(--font-mono);
  font-weight: 600;
  letter-spacing: -0.02em;
  line-height: 1;
  user-select: none;
  transition: background-color var(--t-fast) var(--ease-out), border-color var(--t-fast) var(--ease-out), color var(--t-fast) var(--ease-out);
}
.tile-sm {
  width: 26px;
  height: 26px;
  border-radius: var(--r-1);
  font-size: 11px;
}
.tile-md {
  width: 44px;
  height: 44px;
  border-radius: var(--r-2);
  font-size: 17px;
}
.tile-lg {
  width: 56px;
  height: 56px;
  border-radius: var(--r-3);
  font-size: 22px;
}

/* ----- theme toggle ----- */
.theme-toggle {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 32px;
  padding: 0 10px;
  border: 1px solid var(--line);
  border-radius: var(--r-pill);
  background: var(--panel);
  color: var(--ink-2);
  font: 500 12px/1 var(--font-mono);
  letter-spacing: 0.04em;
  cursor: pointer;
  transition: background-color var(--t-fast) var(--ease-out), border-color var(--t-fast) var(--ease-out), color var(--t-fast) var(--ease-out);
}
.theme-toggle svg {
  flex: 0 0 16px;
  width: 16px;
  height: 16px;
}
.theme-toggle:hover {
  border-color: var(--moss);
  color: var(--moss-ink);
  background: var(--moss-soft);
}
.theme-toggle:focus-visible {
  outline: 2px solid var(--moss);
  outline-offset: 2px;
}
.ws-bar .theme-toggle-label {
  display: none;
}

/* ----- site header (Home, About) ----- */
.site-header {
  border-bottom: 1px solid var(--line);
  background: var(--paper);
}
.site-header-inner {
  max-width: var(--page-max);
  margin: 0 auto;
  height: 64px;
  padding: 0 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.site-nav {
  display: flex;
  align-items: center;
  gap: 20px;
}
.site-nav a {
  padding: 6px 0;
  border-bottom: 1px solid transparent;
  font-size: 14px;
  color: var(--ink-2);
  text-decoration: none;
  transition: color var(--t-fast) var(--ease-out), border-color var(--t-fast) var(--ease-out);
}
.site-nav a:hover {
  color: var(--ink);
}
.site-nav a[aria-current='page'] {
  color: var(--ink);
  border-bottom-color: var(--moss);
}

/* ----- footer ----- */
.site-footer {
  border-top: 1px solid var(--line);
  background: var(--paper);
}
.site-footer-inner {
  max-width: var(--page-max);
  margin: 0 auto;
  padding: 40px 32px 48px;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 24px 48px;
  align-items: start;
}
.site-footer-tag {
  margin: 10px 0 0;
  font: italic 400 15px/1.4 var(--font-display);
  color: var(--muted);
}
.site-footer-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 20px;
  padding-top: 4px;
}
.site-footer-nav a {
  font-size: 14px;
  color: var(--ink-2);
  text-decoration: none;
}
.site-footer-nav a:hover {
  color: var(--moss-ink);
  text-decoration: underline;
  text-underline-offset: 3px;
}
.site-footer-note {
  grid-column: 1 / -1;
  margin: 8px 0 0;
  padding-top: 20px;
  border-top: 1px solid var(--line);
  font-size: 13px;
  line-height: 1.5;
  color: var(--muted);
  max-width: 64ch;
}

@media (max-width: 599px) {
  .site-header-inner {
    height: 56px;
    padding: 0 16px;
  }
  .site-nav {
    gap: 14px;
  }
  .site-nav a {
    font-size: 13px;
  }
  .site-header .theme-toggle-label {
    display: none;
  }
  .site-footer-inner {
    grid-template-columns: 1fr;
    padding: 32px 16px 40px;
  }
}
```

## File 8: `index.html`

Replace the whole file:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="TwigKit: tiny developer utilities that run entirely in your browser. JSON, Base64, timestamps, colours, UUIDs, diffs, regex, text stats and slugs. Free and open source." />
    <meta name="color-scheme" content="light dark" />
    <meta name="theme-color" content="#F5F2EA" media="(prefers-color-scheme: light)" />
    <meta name="theme-color" content="#141613" media="(prefers-color-scheme: dark)" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <title>TwigKit — Tiny tools, done beautifully</title>
    <script>
      try {
        var t = localStorage.getItem('twigkit-theme')
        if (t === 'light' || t === 'dark') document.documentElement.setAttribute('data-theme', t)
      } catch (e) {}
    </script>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

## File 9: `public/favicon.svg`

Replace the whole file with the twig mark on a moss square:

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#35623A"/><g fill="none" stroke="#F5F2EA" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" transform="translate(8 8) scale(2)"><path d="M12 21.5V9"/><path d="M12 13.5c0-3.3 2.4-5.5 5.5-5.5 0 3.3-2.4 5.5-5.5 5.5z"/><path d="M12 18c0-3.3-2.4-5.5-5.5-5.5 0 3.3 2.4 5.5 5.5 5.5z"/><path d="M12 9c0-2.8 1-5 2.5-6.5"/></g></svg>
```

## How to tell it is right

- The browser tab shows a green rounded square with a pale twig; the title reads
  "TwigKit — Tiny tools, done beautifully".
- The logo is a green twig with two leaves next to "TwigKit" in a serif; hovering tilts
  the twig slightly left.
- The theme button is a pill with an icon and "Auto"; clicking cycles Auto → Light →
  Dark → Auto, the page recolours immediately, and reloading keeps the choice (check
  `localStorage['twigkit-theme']`). In Auto the key is absent and `<html>` has no
  `data-theme` attribute.
- Set Dark, reload: no flash of the light theme before React mounts.
- Footer: logo and an italic serif tagline on the left, three links on the right, and a
  hairline-separated grey note below; on a phone it stacks in one column.
- Glyph tiles are square, monospace, bold, slightly darker than the page with a hairline
  border, in three sizes (26/44/56px).
