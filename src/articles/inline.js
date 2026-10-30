import { createElement } from 'react'

const TOKEN = /`([^`]+)`|\*\*([^*]+)\*\*|\*([^*]+)\*|\[([^\]]+)\]\(([^)\s]+)\)/g
const SAFE_HREF = /^(https?:|mailto:|#\/)/i

export function isSafeHref(href) {
  return SAFE_HREF.test(href || '')
}

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
