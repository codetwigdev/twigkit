---
files:
  - src/articles/registry.js
---

# 08 — Articles registry

You own one small file that collects the article modules and exposes a few helpers.
Articles are plain data modules written by other people later; there may be none in your
checkout, and everything must work with zero articles.

An article module is `src/articles/<slug>.js` with a default export:

```js
export default {
  slug: 'base64-is-not-encryption',   // equals the file name
  title: 'Base64 is not encryption',
  summary: 'One sentence for the index card.',
  date: '2026-10-30',                 // ISO date
  tags: ['encoding', 'security'],
  tool: 'encode-decode',              // optional: id of a related tool
  blocks: [
    { type: 'p', text: '…' }, { type: 'h2', text: '…' }, { type: 'h3', text: '…' },
    { type: 'ul', items: ['…'] }, { type: 'ol', items: ['…'] },
    { type: 'code', lang: 'js', text: '…' },
    { type: 'quote', text: '…', cite: '…' },
    { type: 'callout', title: '…', text: '…' },
  ],
}
```

The same folder also holds non-article files that the glob must skip: `registry.js`
(this file), `inline.js`, and any `*.test.js`. React components in the folder end in
`.jsx` and are not matched by `*.js`.

## File: `src/articles/registry.js`

Write exactly:

```js
// Every src/articles/<slug>.js with a default export that has a `slug` is an article.
// Helper files are excluded by name; anything without a slug is ignored.
const modules = import.meta.glob(['./*.js', '!./registry.js', '!./inline.js', '!./*.test.js'], {
  eager: true,
})

export const articles = Object.values(modules)
  .map((m) => m.default)
  .filter((a) => a && typeof a.slug === 'string')
  .sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title))

export function articleBySlug(slug) {
  return articles.find((a) => a.slug === slug)
}

export function articlesForTool(toolId) {
  return articles.filter((a) => a.tool === toolId)
}

const words = (s) => (s || '').split(/\s+/).filter(Boolean).length

export function wordCount(article) {
  let n = 0
  for (const b of article.blocks || []) {
    if (b.type === 'ul' || b.type === 'ol') n += (b.items || []).reduce((t, s) => t + words(s), 0)
    else if (b.type === 'callout') n += words(b.title) + words(b.text)
    else n += words(b.text)
  }
  return n
}

export function readingTime(article) {
  const minutes = Math.max(1, Math.round(wordCount(article) / 200))
  return `${minutes} min read`
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// '2026-10-30' -> '30 Oct 2026'. Input that is not YYYY-MM-DD is returned unchanged.
export function formatDate(iso) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || '')
  if (!m) return iso || ''
  return `${Number(m[3])} ${MONTHS[Number(m[2]) - 1] || m[2]} ${m[1]}`
}
```

Notes:

- `import.meta.glob` accepts an array with negative patterns; keep the list exactly as
  written so helper files never become articles.
- Sort is newest first; two articles on the same day sort by title.
- `readingTime` counts words in paragraphs, headings, list items, code, quotes and
  callouts (title and text), at 200 words per minute, never less than 1 minute.

## How to tell it is right

- With no article modules present, `articles` is `[]`, `articleBySlug('x')` is
  `undefined`, and the app still builds (`npm run build`).
- Drop a file `src/articles/hello.js` with the shape above (`slug: 'hello'`, `date:
  '2026-10-30'`, one paragraph of 50 words): `articles` has one entry,
  `readingTime(articles[0])` is `'1 min read'`, `formatDate('2026-10-30')` is
  `'30 Oct 2026'`, `formatDate('2026-01-05')` is `'5 Jan 2026'`. Remove the file
  afterwards.
- `npm test` passes (package 12 adds tests for this file).
