const NAMED = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: '\u00A0',
}

export function escapeHtml(text) {
  const output = text.replace(/[&<>"']/g, (ch) => {
    switch (ch) {
      case '&':
        return '&amp;'
      case '<':
        return '&lt;'
      case '>':
        return '&gt;'
      case '"':
        return '&quot;'
      case "'":
        return '&#39;'
      default:
        return ch
    }
  })
  return { ok: true, output }
}

export function unescapeHtml(text) {
  const output = text.replace(/&#x([0-9a-f]+);|&#(\d+);|&([a-z]+);/gi, (match, hex, dec, name) => {
    if (hex !== undefined) {
      const code = parseInt(hex, 16)
      if (code > 0x10ffff) return match
      return String.fromCodePoint(code)
    }
    if (dec !== undefined) {
      const code = parseInt(dec, 10)
      if (code > 0x10ffff) return match
      return String.fromCodePoint(code)
    }
    const key = name.toLowerCase()
    if (key in NAMED) return NAMED[key]
    return match
  })
  return { ok: true, output }
}
