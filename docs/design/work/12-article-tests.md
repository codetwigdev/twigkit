---
files:
  - src/articles/inline.test.js
  - src/articles/registry.test.js
  - src/articles/ArticleBody.test.jsx
---

# 12 — Tests for the articles system

You own three test files. They check the contracts of the articles registry, the inline
parser and the block renderer (written by other packages). Write only the tests below,
nothing else. The project uses Vitest with jsdom, `globals: true`, and
`@testing-library/jest-dom` matchers. Every test must also pass when there are no article
modules in `src/articles/`.

Facts the tests rely on (from the contracts):

- `src/articles/registry.js` exports `articles` (sorted by `date` desc, then `title`),
  `articleBySlug`, `articlesForTool`, `wordCount`, `readingTime` (`'N min read'`,
  `Math.max(1, Math.round(words / 200))`), `formatDate` (`'2026-10-30'` → `'30 Oct 2026'`).
- `src/articles/inline.js` exports `parseInline(text)` → tokens
  `{ t: 'text'|'code'|'b'|'i', s }` or `{ t: 'a', s, href }`; only `http:`, `https:`,
  `mailto:` and `#/` hrefs become links, any other `[x](y)` stays literal text. Also
  exports `renderInline` and `isSafeHref`.
- `src/articles/ArticleBody.jsx` default-exports `ArticleBody({ blocks })`, rendering
  `div.art-body` with `p`, `h2`, `h3`, `ul`, `ol`, `figure.art-code` (containing
  `.art-code-lang`, a `button.btn` reading `Copy`, and `pre > code`),
  `blockquote.art-quote` (with `cite`), `aside.art-callout` (with `.art-callout-title`).
  Unknown types render nothing.
- `src/registry.js` exports `tools` with ids.

## File 1: `src/articles/inline.test.js`

```js
import { describe, expect, it } from 'vitest'
import { isSafeHref, parseInline } from './inline.js'

describe('parseInline', () => {
  it('returns [] for empty or non-string input', () => {
    expect(parseInline('')).toEqual([])
    expect(parseInline(undefined)).toEqual([])
    expect(parseInline(null)).toEqual([])
  })

  it('passes plain text through as one token', () => {
    expect(parseInline('just words')).toEqual([{ t: 'text', s: 'just words' }])
  })

  it('tokenises code, bold, italic and links in order', () => {
    expect(parseInline('a `b` **c** *d* [e](#/f) g')).toEqual([
      { t: 'text', s: 'a ' },
      { t: 'code', s: 'b' },
      { t: 'text', s: ' ' },
      { t: 'b', s: 'c' },
      { t: 'text', s: ' ' },
      { t: 'i', s: 'd' },
      { t: 'text', s: ' ' },
      { t: 'a', s: 'e', href: '#/f' },
      { t: 'text', s: ' g' },
    ])
  })

  it('keeps the inside of code literal', () => {
    expect(parseInline('`**not bold** [x](#/y)`')).toEqual([
      { t: 'code', s: '**not bold** [x](#/y)' },
    ])
  })

  it('allows http, https, mailto and #/ links only', () => {
    expect(parseInline('[a](https://x.y)')).toEqual([{ t: 'a', s: 'a', href: 'https://x.y' }])
    expect(parseInline('[a](http://x.y)')).toEqual([{ t: 'a', s: 'a', href: 'http://x.y' }])
    expect(parseInline('[a](mailto:x@y.z)')).toEqual([{ t: 'a', s: 'a', href: 'mailto:x@y.z' }])
    expect(parseInline('[a](#/slugify)')).toEqual([{ t: 'a', s: 'a', href: '#/slugify' }])
    expect(parseInline('[a](HTTPS://X.Y)')).toEqual([{ t: 'a', s: 'a', href: 'HTTPS://X.Y' }])
  })

  it('renders unsafe links as literal text', () => {
    for (const bad of ['javascript:alert(1)', 'data:text/html,hi', '#top', '/local', 'ftp://x']) {
      const src = `[click](${bad})`
      expect(parseInline(src)).toEqual([{ t: 'text', s: src }])
      expect(isSafeHref(bad)).toBe(false)
    }
  })

  it('leaves unmatched markers alone', () => {
    expect(parseInline('a ** b ` c [d')).toEqual([{ t: 'text', s: 'a ** b ` c [d' }])
  })
})
```

## File 2: `src/articles/registry.test.js`

```js
import { describe, expect, it } from 'vitest'
import { tools } from '../registry.js'
import { articleBySlug, articles, articlesForTool, formatDate, readingTime, wordCount } from './registry.js'

const BLOCK_TYPES = ['p', 'h2', 'h3', 'ul', 'ol', 'code', 'quote', 'callout']
const files = Object.keys(import.meta.glob('./*.js')).map((p) => p.slice(2, -3))

describe('article registry', () => {
  it('is sorted newest first, then by title', () => {
    for (let i = 1; i < articles.length; i++) {
      const a = articles[i - 1]
      const b = articles[i]
      expect(a.date >= b.date).toBe(true)
      if (a.date === b.date) expect(a.title.localeCompare(b.title) <= 0).toBe(true)
    }
  })

  it('never includes helper files', () => {
    expect(articles.some((a) => ['registry', 'inline'].includes(a.slug))).toBe(false)
  })

  it.each(articles.map((a) => [a.slug, a]))('%s is well formed', (slug, a) => {
    expect(files).toContain(slug)
    expect(a.title).toBeTruthy()
    expect(a.summary).toBeTruthy()
    expect(a.date).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    expect(Array.isArray(a.tags)).toBe(true)
    if (a.tool !== undefined) expect(tools.map((t) => t.id)).toContain(a.tool)
    expect(Array.isArray(a.blocks)).toBe(true)
    expect(a.blocks.length).toBeGreaterThan(0)
    for (const b of a.blocks) expect(BLOCK_TYPES).toContain(b.type)
    expect(articleBySlug(slug)).toBe(a)
    if (a.tool) expect(articlesForTool(a.tool)).toContain(a)
    expect(readingTime(a)).toMatch(/^[1-9]\d* min read$/)
  })

  it('finds nothing for an unknown slug', () => {
    expect(articleBySlug('no-such-article')).toBeUndefined()
    expect(articlesForTool('no-such-tool')).toEqual([])
  })

  it('counts words across block types and rounds to whole minutes', () => {
    const fixture = {
      blocks: [
        { type: 'p', text: 'one two three' },
        { type: 'h2', text: 'four' },
        { type: 'ul', items: ['five six', 'seven'] },
        { type: 'code', lang: 'js', text: 'eight nine' },
        { type: 'quote', text: 'ten', cite: 'ignored' },
        { type: 'callout', title: 'eleven', text: 'twelve thirteen' },
      ],
    }
    expect(wordCount(fixture)).toBe(13)
    expect(readingTime(fixture)).toBe('1 min read')
    const long = { blocks: [{ type: 'p', text: Array(900).fill('w').join(' ') }] }
    expect(readingTime(long)).toBe('5 min read')
    expect(readingTime({ blocks: [] })).toBe('1 min read')
  })

  it('formats ISO dates as "30 Oct 2026"', () => {
    expect(formatDate('2026-10-30')).toBe('30 Oct 2026')
    expect(formatDate('2026-01-05')).toBe('5 Jan 2026')
    expect(formatDate('not a date')).toBe('not a date')
  })
})
```

The glob in the test deliberately has no exclusions; it lists every `.js` file in the
folder so the test can check each article's `slug` matches its file name.

## File 3: `src/articles/ArticleBody.test.jsx`

```jsx
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import ArticleBody from './ArticleBody.jsx'

afterEach(cleanup)

const BLOCKS = [
  { type: 'p', text: 'Plain with `code`, **bold**, *italic* and [a link](#/slugify).' },
  { type: 'h2', text: 'Heading two' },
  { type: 'h3', text: 'Heading three' },
  { type: 'ul', items: ['one', 'two'] },
  { type: 'ol', items: ['first', 'second'] },
  { type: 'code', lang: 'js', text: 'const x = 1' },
  { type: 'quote', text: 'A quotation.', cite: 'Someone' },
  { type: 'callout', title: 'Note', text: 'A short aside.' },
  { type: 'video', src: 'nope' },
]

describe('ArticleBody', () => {
  it('renders every block type into the expected elements', () => {
    const { container } = render(<ArticleBody blocks={BLOCKS} />)
    expect(container.querySelector('.art-body')).not.toBeNull()
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Heading two')
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Heading three')
    expect(container.querySelectorAll('ul > li')).toHaveLength(2)
    expect(container.querySelectorAll('ol > li')).toHaveLength(2)
    const code = container.querySelector('figure.art-code')
    expect(code.querySelector('.art-code-lang')).toHaveTextContent('js')
    expect(code.querySelector('pre > code')).toHaveTextContent('const x = 1')
    expect(code.querySelector('button.btn')).toHaveTextContent('Copy')
    const quote = container.querySelector('blockquote.art-quote')
    expect(quote).toHaveTextContent('A quotation.')
    expect(quote.querySelector('cite')).toHaveTextContent('Someone')
    const callout = container.querySelector('aside.art-callout')
    expect(callout.querySelector('.art-callout-title')).toHaveTextContent('Note')
    expect(callout).toHaveTextContent('A short aside.')
  })

  it('renders inline markup as elements and ignores unknown blocks', () => {
    const { container } = render(<ArticleBody blocks={BLOCKS} />)
    const p = container.querySelector('.art-body > p')
    expect(p.querySelector('code')).toHaveTextContent('code')
    expect(p.querySelector('strong')).toHaveTextContent('bold')
    expect(p.querySelector('em')).toHaveTextContent('italic')
    expect(p.querySelector('a')).toHaveAttribute('href', '#/slugify')
    expect(p.querySelector('a')).not.toHaveAttribute('target')
    expect(container.querySelector('video')).toBeNull()
    expect(container.querySelector('.art-body').children).toHaveLength(BLOCKS.length - 1)
  })

  it('never turns text into markup and never links unsafe hrefs', () => {
    const { container } = render(
      <ArticleBody
        blocks={[
          { type: 'p', text: 'x <b>y</b> [bad](javascript:alert(1)) [ok](https://example.com)' },
        ]}
      />,
    )
    const p = container.querySelector('p')
    expect(p.querySelector('b')).toBeNull()
    expect(p).toHaveTextContent('x <b>y</b> [bad](javascript:alert(1)) ok')
    const links = p.querySelectorAll('a')
    expect(links).toHaveLength(1)
    expect(links[0]).toHaveAttribute('href', 'https://example.com')
    expect(links[0]).toHaveAttribute('target', '_blank')
    expect(links[0]).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('renders an empty body for no blocks', () => {
    const { container } = render(<ArticleBody />)
    expect(container.querySelector('.art-body').children).toHaveLength(0)
  })
})
```

## How to tell it is right

- `npm test` passes once packages 08 and 09 are in place (the files fail with import
  errors before that, which is expected). The per-article `well formed` cases are
  generated from whatever article modules exist, including none.
- Do not loosen a failing assertion to make it pass; the assertions are the contract. If
  one fails after all packages are merged, report which one.
