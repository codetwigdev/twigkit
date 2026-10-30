// Pure logic only: no React, no DOM.

export function processLines(
  text,
  {
    sort = 'none',
    dedupe = false,
    trim = false,
    removeEmpty = false,
    reverse = false,
    ignoreCase = false,
  } = {},
) {
  let lines = text === '' ? [] : text.split(/\r?\n/)
  const before = lines.length

  if (trim) {
    lines = lines.map((l) => l.trim())
  }

  if (removeEmpty) {
    lines = lines.filter((l) => l !== '')
  }

  if (dedupe) {
    const seen = new Set()
    lines = lines.filter((l) => {
      const key = ignoreCase ? l.toLowerCase() : l
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
  }

  if (sort !== 'none') {
    const cmp = (a, b) => {
      const ka = ignoreCase ? a.toLowerCase() : a
      const kb = ignoreCase ? b.toLowerCase() : b
      if (sort === 'asc') return ka < kb ? -1 : ka > kb ? 1 : 0
      if (sort === 'desc') return ka < kb ? 1 : ka > kb ? -1 : 0
      // 'length'
      if (a.length !== b.length) return a.length - b.length
      return ka < kb ? -1 : ka > kb ? 1 : 0
    }
    lines = [...lines].sort(cmp)
  }

  if (reverse) {
    lines = [...lines].reverse()
  }

  return {
    ok: true,
    output: lines.join('\n'),
    before,
    after: lines.length,
  }
}
