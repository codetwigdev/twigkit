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
    for (const bad of ['javascript:foo', 'data:text/html,hi', '#top', '/local', 'ftp://x']) {
      const src = `[click](${bad})`
      expect(parseInline(src)).toEqual([{ t: 'text', s: src }])
      expect(isSafeHref(bad)).toBe(false)
    }
  })

  it('leaves unmatched markers alone', () => {
    expect(parseInline('a ** b ` c [d')).toEqual([{ t: 'text', s: 'a ** b ` c [d' }])
  })
})
