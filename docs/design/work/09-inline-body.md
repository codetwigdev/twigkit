---
files:
  - src/articles/inline.js
  - src/articles/ArticleBody.jsx
---

# 09 — Inline markup parser and article body renderer

You own the two files that turn article data into React elements: a tiny, safe inline
parser (`` `code` ``, `**bold**`, `*italic*`, `[label](href)`) and the block renderer.
**Never use `dangerouslySetInnerHTML`.** Everything is built from React elements, so
article text can never inject markup.

Other packages provide `src/ui/CopyButton.jsx` (already exists:
`<CopyButton text="..." />` renders `<button class="btn">Copy</button>`) and the CSS for
the class names below (`src/pages/Article.css`, package 10). You write no CSS.

## File 1: `src/articles/inline.js`

Rules, exactly:

- Scan left to right. The four forms are matched by one regular expression, leftmost
  first; between matches, text is emitted as `{ t: 'text', s }`.
- `` `code` `` → `{ t: 'code', s }`; one or more non-backtick characters inside.
- `**bold**` → `{ t: 'b', s }`; `*italic*` → `{ t: 'i', s }`; one or more non-asterisk
  characters inside. Bold is tried before italic.
- `[label](href)` → `{ t: 'a', s: label, href }` only when `href` starts with `http:`,
  `https:`, `mailto:` or `#/` (case-insensitive for the schemes). Label: one or more
  non-`]` characters. Href: one or more characters that are not `)` or whitespace. When
  the href is not allowed, the **whole** `[label](href)` source is emitted as plain
  text.
- No nesting: the inside of every form is literal text.
- Empty or non-string input → `[]`. Adjacent text is not merged across a rejected link;
  that is fine.

```js
import { createElement } from 'react'

const TOKEN = /`([^`]+)`|\*\*([^*]+)\*\*|\*([^*]+)\*|\[([^\]]+)\]\(([^)\s]+)\)/g
const SAFE_HREF = /^(https?:|mailto:|#\/)/i

export function isSafeHref(href) {
  return SAFE_HREF.test(href || '')
}

// 'a `b` **c** *d* [e](#/f)' ->
// [{t:'text',s:'a '},{t:'code',s:'b'},{t:'text',s:' '},{t:'b',s:'c'},{t:'text',s:' '},
//  {t:'i',s:'d'},{t:'text',s:' '},{t:'a',s:'e',href:'#/f'}]
export function parseInline(text) {
  if (typeof text !== 'string' || text === '') return []
  const out = []
  let last = 0
  TOKEN.lastIndex = 0
  let m
  while ((m = TOKEN.exec(text)) !== null) {
    if (m.index > last) out.push({ t: 'text', s: text.slice(last, m.index) })
    if (m[1] !== undefined) out.push({ t: 'code', s: m[1] })
    else if (m[2] !== undefined) out.push({ t: 'b', s: m[2] })
    else if (m[3] !== undefined) out.push({ t: 'i', s: m[3] })
    else if (isSafeHref(m[5])) out.push({ t: 'a', s: m[4], href: m[5] })
    else out.push({ t: 'text', s: m[0] })
    last = m.index + m[0].length
  }
  if (last < text.length) out.push({ t: 'text', s: text.slice(last) })
  return out
}

// Tokens -> React children. External links open in a new tab; '#/' links do not.
export function renderInline(text) {
  return parseInline(text).map((tok, i) => {
    if (tok.t === 'code') return createElement('code', { key: i }, tok.s)
    if (tok.t === 'b') return createElement('strong', { key: i }, tok.s)
    if (tok.t === 'i') return createElement('em', { key: i }, tok.s)
    if (tok.t === 'a') {
      const external = !tok.href.startsWith('#/')
      return createElement(
        'a',
        external
          ? { key: i, href: tok.href, target: '_blank', rel: 'noopener noreferrer' }
          : { key: i, href: tok.href },
        tok.s,
      )
    }
    return tok.s
  })
}
```

## File 2: `src/articles/ArticleBody.jsx`

Props: `blocks` (array; may be missing or empty). Renders `<div class="art-body">` with
one element per block, in order. Unknown block types render nothing. Block `text` and
`items` go through `renderInline`; `code.text` does **not** (it is literal).

```jsx
import CopyButton from '../ui/CopyButton.jsx'
import { renderInline } from './inline.js'

function Block({ block }) {
  switch (block.type) {
    case 'p':
      return <p>{renderInline(block.text)}</p>
    case 'h2':
      return <h2>{renderInline(block.text)}</h2>
    case 'h3':
      return <h3>{renderInline(block.text)}</h3>
    case 'ul':
      return (
        <ul>
          {(block.items || []).map((s, i) => (
            <li key={i}>{renderInline(s)}</li>
          ))}
        </ul>
      )
    case 'ol':
      return (
        <ol>
          {(block.items || []).map((s, i) => (
            <li key={i}>{renderInline(s)}</li>
          ))}
        </ol>
      )
    case 'code':
      return (
        <figure className="art-code">
          <div className="art-code-head">
            <span className="art-code-lang">{block.lang || 'code'}</span>
            <CopyButton text={block.text || ''} />
          </div>
          <pre>
            <code>{block.text || ''}</code>
          </pre>
        </figure>
      )
    case 'quote':
      return (
        <blockquote className="art-quote">
          <p>{renderInline(block.text)}</p>
          {block.cite && <cite>{block.cite}</cite>}
        </blockquote>
      )
    case 'callout':
      return (
        <aside className="art-callout">
          {block.title && <p className="art-callout-title">{block.title}</p>}
          <p>{renderInline(block.text)}</p>
        </aside>
      )
    default:
      return null
  }
}

export default function ArticleBody({ blocks = [] }) {
  return (
    <div className="art-body">
      {blocks.map((b, i) => (
        <Block key={i} block={b} />
      ))}
    </div>
  )
}
```

## How to tell it is right

- In a Node REPL or a scratch test: `parseInline('see [docs](https://x.y) and [bad](javascript:alert(1))')`
  returns a text token, a link token with `href: 'https://x.y'`, a text token ` and `,
  and a **text** token whose `s` is the literal `[bad](javascript:alert(1))`.
- `parseInline('**a** *b* `c`')` returns b, text, i, text, code tokens; `parseInline('')`
  returns `[]`.
- Rendering `{ type: 'p', text: 'x <b>y</b>' }` shows the literal characters `<b>y</b>`
  on screen, not bold text.
- A `code` block renders a `figure.art-code` with the language label and a `Copy` button
  above a `pre > code`; clicking Copy puts exactly the block text on the clipboard.
- A block `{ type: 'video' }` renders nothing and does not throw.
- `npm test` passes (package 12 tests these files).
