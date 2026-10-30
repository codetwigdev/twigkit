// Pure logic only: no React, no DOM. Easy to test, easy for a worker to get right.

// Turn any text into a URL-friendly slug.
// "Héllo, Wörld!" -> "hello-world"
export function slugify(text, { separator = '-' } = {}) {
  return text
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '') // strip accents
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, separator)
    .replace(new RegExp(`^${escape(separator)}+|${escape(separator)}+$`, 'g'), '')
}

function escape(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
