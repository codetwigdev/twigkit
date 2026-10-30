// Pure logic only: no React, no DOM. Easy to test, easy for a worker to get right.

export function countText(text) {
  const characters = text.length
  const charactersNoSpaces = text.replace(/\s/g, '').length
  const words = (text.match(/\S+/g) || []).length
  const lines = text === '' ? 0 : text.split('\n').length
  const readingMinutes = Math.ceil(words / 200)
  return { characters, charactersNoSpaces, words, lines, readingMinutes }
}

export function convertCase(text, mode) {
  if (mode === 'upper') return text.toUpperCase()
  if (mode === 'lower') return text.toLowerCase()
  if (mode === 'title') {
    return text
      .split(/\s+/)
      .filter(Boolean)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ')
  }
  if (mode === 'camel' || mode === 'pascal' || mode === 'snake' || mode === 'kebab') {
    const words = splitWords(text)
    if (mode === 'camel') {
      return words
        .map((w, i) => (i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()))
        .join('')
    }
    if (mode === 'pascal') {
      return words.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('')
    }
    if (mode === 'snake') return words.map((w) => w.toLowerCase()).join('_')
    return words.map((w) => w.toLowerCase()).join('-')
  }
  throw new Error(`Unknown mode: ${mode}`)
}

function splitWords(text) {
  return text
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .split(/[\s\-_]+/)
    .filter(Boolean)
}
