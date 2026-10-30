// Pure logic only: no React, no DOM. Easy to test, easy for a worker to get right.

// Recursively sort object keys alphabetically. Arrays keep their order.
function sortKeysDeep(value) {
  if (Array.isArray(value)) {
    return value.map(sortKeysDeep)
  }
  if (value !== null && typeof value === 'object') {
    const sorted = {}
    for (const key of Object.keys(value).sort()) {
      sorted[key] = sortKeysDeep(value[key])
    }
    return sorted
  }
  return value
}

// Format a JSON string with the given indent and optional key sorting.
// Returns { ok: true, output } or { ok: false, error }.
export function formatJson(text, { indent = 2, sortKeys = false } = {}) {
  if (text.trim() === '') {
    return { ok: false, error: 'Nothing to format' }
  }

  let parsed
  try {
    parsed = JSON.parse(text)
  } catch (e) {
    return { ok: false, error: e.message }
  }

  if (sortKeys) {
    parsed = sortKeysDeep(parsed)
  }

  return { ok: true, output: JSON.stringify(parsed, null, indent) }
}

// Minify a JSON string.
// Returns { ok: true, output } or { ok: false, error }.
export function minifyJson(text) {
  if (text.trim() === '') {
    return { ok: false, error: 'Nothing to format' }
  }

  let parsed
  try {
    parsed = JSON.parse(text)
  } catch (e) {
    return { ok: false, error: e.message }
  }

  return { ok: true, output: JSON.stringify(parsed) }
}
