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
