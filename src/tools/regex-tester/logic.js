// Pure logic only: no React, no DOM. Easy to test, easy for a worker to get right.

// Test a regex pattern against text and return all matches (or the first match
// when the global flag is absent).
export function testRegex(pattern, flags, text) {
  if (!pattern) {
    return { ok: false, error: 'Pattern cannot be empty' }
  }

  let regex
  try {
    regex = new RegExp(pattern, flags)
  } catch (e) {
    return { ok: false, error: e.message }
  }

  const matches = []
  let truncated = false

  if (flags.includes('g')) {
    const iterator = text.matchAll(regex)
    for (const m of iterator) {
      if (matches.length >= 1000) {
        truncated = true
        break
      }
      matches.push(processMatch(m))
    }
  } else {
    const m = regex.exec(text)
    if (m) {
      matches.push(processMatch(m))
    }
  }

  return { ok: true, matches, truncated }
}

function processMatch(m) {
  const groups = []
  const named = {}

  for (let i = 1; i < m.length; i++) {
    const val = m[i]
    groups.push(val === undefined ? '' : val)
  }

  if (m.groups) {
    for (const key in m.groups) {
      const val = m.groups[key]
      named[key] = val === undefined ? '' : val
    }
  }

  return {
    index: m.index,
    match: m[0],
    groups,
    named
  }
}
