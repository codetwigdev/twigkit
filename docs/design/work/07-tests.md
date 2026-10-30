---
files:
  - src/App.test.jsx
  - src/theme.test.js
---

# 07 — Tests for routing and theme

You own two small test files. They check the shared contracts other packages implement:
hash routing in `src/App.jsx` and the theme store in `src/theme.js`. Write only the tests
below, nothing else. The project uses Vitest with jsdom, `globals: true`, and
`@testing-library/jest-dom` matchers (see `vite.config.js` and `src/test-setup.js`).

Facts the tests rely on (from the contracts):

- `App` renders the Home page for `#/`, empty hash and unknown hashes; the About page
  for `#/about`; the tool workspace for `#/<tool-id>`.
- Home's `<h1>` contains the text `Tiny tools`. About's `<h1>` contains `One architect`.
  A tool page's `<h1>` is the tool name, e.g. `JSON Formatter` for `#/json-formatter`.
- Every page has `<main id="main" tabIndex={-1}>`.
- Document titles: home `TwigKit — Tiny tools, done beautifully`, about
  `How it's built · TwigKit`, tool `JSON Formatter · TwigKit`.
- `src/theme.js` exports `THEME_KEY` (`'twigkit-theme'`), `getTheme`, `applyTheme`,
  `setTheme`, `nextTheme`. Theme is `'auto' | 'light' | 'dark'`. `'auto'` stores no key
  and removes `data-theme` from `<html>`; `setTheme` dispatches a `twigkit:theme`
  CustomEvent on `window` with `detail` = the theme.

## File 1: `src/App.test.jsx`

```jsx
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App.jsx'

function renderAt(hash) {
  window.location.hash = hash
  return render(<App />)
}

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

  it('shows a tool at #/<id>', () => {
    renderAt('#/json-formatter')
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('JSON Formatter')
    expect(document.title).toBe('JSON Formatter · TwigKit')
  })

  it('has a focusable main landmark on every page', () => {
    for (const hash of ['#/', '#/about', '#/slugify']) {
      renderAt(hash)
      const main = document.getElementById('main')
      expect(main).not.toBeNull()
      expect(main.tagName).toBe('MAIN')
      expect(main.getAttribute('tabindex')).toBe('-1')
      cleanup()
    }
  })

  it('offers a skip link as the first focusable element', () => {
    renderAt('#/')
    const skip = screen.getByText('Skip to content')
    expect(skip).toHaveClass('skip-link')
  })
})
```

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

- `npm test` runs 12 test files; the two new ones pass once packages 03, 04, 05 and 06
  are in place (they will fail with import errors before that, which is expected).
- Do not loosen a failing assertion to make it pass; the assertions are the contract. If
  one fails after all packages are merged, report which one.
