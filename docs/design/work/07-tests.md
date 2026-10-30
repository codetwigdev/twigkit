---
files:
  - src/App.test.jsx
  - src/theme.test.js
---

# 07 — Tests for routing and theme

> Changed in v1.1: routing tests cover `#/articles`, `#/articles/<slug>`, the `Articles`
> nav link, the derived tool count in the workspace eyebrow and the catalog's numbering.
> `theme.test.js` is unchanged.

You own two small test files. They check the shared contracts other packages implement:
hash routing in `src/App.jsx`, the catalog in `src/catalog.js`, and the theme store in
`src/theme.js`. Write only the tests below, nothing else. The project uses Vitest with
jsdom, `globals: true`, and `@testing-library/jest-dom` matchers (see `vite.config.js`
and `src/test-setup.js`).

Facts the tests rely on (from the contracts):

- `App` renders the Home page for `#/`, empty hash and unknown hashes; the About page
  for `#/about`; the articles index for `#/articles` and for `#/articles/<unknown>`; an
  article for `#/articles/<slug>`; the tool workspace for `#/<tool-id>`.
- Home's `<h1>` contains `Tiny tools`. About's `<h1>` contains `One architect`. The
  articles index `<h1>` contains `From the notebook`. An article page's `<h1>` is its
  `title`. A tool page's `<h1>` is the tool name, e.g. `JSON Formatter`.
- Every page has `<main id="main" tabIndex={-1}>` and a link with text `Articles`
  pointing at `#/articles`.
- Document titles: home `TwigKit — Tiny tools, done beautifully`, about
  `How it's built · TwigKit`, articles `Articles · TwigKit`, tool `JSON Formatter · TwigKit`.
- The tool page eyebrow reads `Tool NN of NN · <Category>`, where the total is
  `tools.length` zero-padded.
- `src/catalog.js` exports `ordered`, `numberOf`, `total`, `WORKER_TOOLS`, `matchTools`,
  `groups`. `src/articles/registry.js` exports `articles` (may be empty).
- `src/theme.js` exports `THEME_KEY` (`'twigkit-theme'`), `getTheme`, `applyTheme`,
  `setTheme`, `nextTheme`. Theme is `'auto' | 'light' | 'dark'`. `'auto'` stores no key
  and removes `data-theme` from `<html>`; `setTheme` dispatches a `twigkit:theme`
  CustomEvent on `window` with `detail` = the theme.

## File 1: `src/App.test.jsx`

```jsx
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App.jsx'
import { tools } from './registry.js'
import { groups, matchTools, numberOf, ordered, total, WORKER_TOOLS } from './catalog.js'
import { articles } from './articles/registry.js'

function renderAt(hash) {
  window.location.hash = hash
  return render(<App />)
}

const pad = (n) => String(n).padStart(2, '0')

beforeEach(() => {
  window.scrollTo = vi.fn()
})

afterEach(() => {
  cleanup()
  window.location.hash = ''
})

describe('routing', () => {
  it('shows Home at #/', () => {
    renderAt('#/')
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Tiny tools')
    expect(document.title).toBe('TwigKit — Tiny tools, done beautifully')
  })

  it('shows Home for an empty hash', () => {
    renderAt('')
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Tiny tools')
  })

  it('shows Home for an unknown hash', () => {
    renderAt('#/does-not-exist')
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Tiny tools')
  })

  it('shows About at #/about', () => {
    renderAt('#/about')
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('One architect')
    expect(document.title).toBe("How it's built · TwigKit")
  })

  it('shows the articles index at #/articles and for an unknown slug', () => {
    renderAt('#/articles')
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('From the notebook')
    expect(document.title).toBe('Articles · TwigKit')
    cleanup()
    renderAt('#/articles/no-such-article')
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('From the notebook')
  })

  it.skipIf(articles.length === 0)('shows an article at #/articles/<slug>', () => {
    const a = articles[0]
    renderAt(`#/articles/${a.slug}`)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(a.title)
    expect(document.title).toBe(`${a.title} · TwigKit`)
  })

  it('shows a tool at #/<id> with a derived index number', () => {
    renderAt('#/json-formatter')
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('JSON Formatter')
    expect(document.title).toBe('JSON Formatter · TwigKit')
    const tool = tools.find((t) => t.id === 'json-formatter')
    expect(screen.getByText(`Tool ${numberOf(tool)} of ${total} · Data`)).toBeInTheDocument()
  })

  it('has a focusable main landmark and an Articles link on every page', () => {
    for (const hash of ['#/', '#/about', '#/articles', '#/slugify']) {
      renderAt(hash)
      const main = document.getElementById('main')
      expect(main).not.toBeNull()
      expect(main.tagName).toBe('MAIN')
      expect(main.getAttribute('tabindex')).toBe('-1')
      const links = screen.getAllByRole('link', { name: 'Articles' })
      expect(links.some((l) => l.getAttribute('href') === '#/articles')).toBe(true)
      cleanup()
    }
  })

  it('offers a skip link as the first focusable element', () => {
    renderAt('#/')
    const skip = screen.getByText('Skip to content')
    expect(skip).toHaveClass('skip-link')
  })
})

describe('catalog', () => {
  it('numbers every tool once, in category order, zero-padded', () => {
    expect(ordered).toHaveLength(tools.length)
    expect(total).toBe(pad(tools.length))
    const numbers = ordered.map(numberOf)
    expect(numbers).toEqual(ordered.map((_, i) => pad(i + 1)))
    const flat = groups.flatMap((g) => g.tools.map((t) => t.id))
    expect(flat).toEqual(ordered.map((t) => t.id))
  })

  it('treats every tool but slugify as worker-built', () => {
    expect(WORKER_TOOLS).toHaveLength(tools.length - 1)
    expect(WORKER_TOOLS.some((t) => t.id === 'slugify')).toBe(false)
  })

  it('matches by name, description, id and category name', () => {
    expect(matchTools('')).toEqual(ordered)
    expect(matchTools('JSON FORMATTER').map((t) => t.id)).toContain('json-formatter')
    expect(matchTools('encode & decode').map((t) => t.id)).toContain('encode-decode')
    expect(matchTools('zzzz')).toEqual([])
  })
})
```

The `Tool NN of NN · Data` assertion relies on `json-formatter` having `category:
'data'` in its `index.js`. If the project manager has not yet added categories, this one
assertion fails; report it rather than changing it.

## File 2: `src/theme.test.js`

```js
import { afterEach, describe, expect, it, vi } from 'vitest'
import { THEME_KEY, applyTheme, getTheme, nextTheme, setTheme } from './theme.js'

afterEach(() => {
  localStorage.clear()
  delete document.documentElement.dataset.theme
})

describe('theme', () => {
  it('uses the key twigkit-theme', () => {
    expect(THEME_KEY).toBe('twigkit-theme')
  })

  it('cycles auto -> light -> dark -> auto', () => {
    expect(nextTheme('auto')).toBe('light')
    expect(nextTheme('light')).toBe('dark')
    expect(nextTheme('dark')).toBe('auto')
  })

  it('defaults to auto and ignores garbage in storage', () => {
    expect(getTheme()).toBe('auto')
    localStorage.setItem(THEME_KEY, 'purple')
    expect(getTheme()).toBe('auto')
  })

  it('applies light and dark as data-theme and removes it for auto', () => {
    applyTheme('dark')
    expect(document.documentElement.dataset.theme).toBe('dark')
    applyTheme('light')
    expect(document.documentElement.dataset.theme).toBe('light')
    applyTheme('auto')
    expect(document.documentElement.dataset.theme).toBeUndefined()
  })

  it('setTheme persists, applies and announces the change', () => {
    const heard = vi.fn()
    window.addEventListener('twigkit:theme', (e) => heard(e.detail))

    setTheme('dark')
    expect(localStorage.getItem(THEME_KEY)).toBe('dark')
    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(getTheme()).toBe('dark')
    expect(heard).toHaveBeenCalledWith('dark')

    setTheme('auto')
    expect(localStorage.getItem(THEME_KEY)).toBeNull()
    expect(document.documentElement.dataset.theme).toBeUndefined()
    expect(heard).toHaveBeenLastCalledWith('auto')
  })
})
```

## How to tell it is right

- `npm test` passes once packages 03, 04, 05, 06, 08–11 and 13–16 are in place (the two
  files fail with import errors before that, which is expected). The article test is
  skipped while there are no article modules.
- Do not loosen a failing assertion to make it pass; the assertions are the contract. If
  one fails after all packages are merged, report which one.
