import { tools } from './registry.js'

// Display order of the categories. A tool's index number (01, 02, …) is its position
// in `ordered`: category order first, then name. Numbers are global, never per category.
export const CATEGORIES = [
  { id: 'encode', name: 'Encode & decode', blurb: 'Base64, entities, tokens and hashes.' },
  { id: 'data', name: 'Data', blurb: 'JSON, CSV and URLs, taken apart and put back.' },
  { id: 'text', name: 'Text', blurb: 'Count, compare, sort, slug and match.' },
  { id: 'numbers', name: 'Numbers & time', blurb: 'Bases, timestamps and schedules.' },
  { id: 'pick', name: 'Colour & random', blurb: 'Pick a colour or ask for an ID.' },
]

const OTHER = { id: 'other', name: 'Other', blurb: '' }

export function categoryOf(tool) {
  return CATEGORIES.find((c) => c.id === tool.category) || OTHER
}

function rank(tool) {
  const i = CATEGORIES.findIndex((c) => c.id === tool.category)
  return i === -1 ? CATEGORIES.length : i
}

export const ordered = [...tools].sort(
  (a, b) => rank(a) - rank(b) || a.name.localeCompare(b.name),
)

export const groups = [...CATEGORIES, OTHER]
  .map((category) => ({
    category,
    tools: ordered.filter((t) => categoryOf(t).id === category.id),
  }))
  .filter((g) => g.tools.length > 0)

export const pad = (n) => String(n).padStart(2, '0')
export const num = (i) => pad(i + 1)
export const numberOf = (tool) => num(ordered.findIndex((t) => t.id === tool.id))
export const total = pad(ordered.length)

// Case-insensitive substring match over name, description, id and category name.
export function matchTools(query) {
  const q = (query || '').trim().toLowerCase()
  if (!q) return ordered
  return ordered.filter((t) =>
    `${t.name} ${t.description} ${t.id} ${categoryOf(t).name}`.toLowerCase().includes(q),
  )
}

// The architect wrote Slugify as the reference tool; every other tool was built by a worker.
export const WORKER_TOOLS = ordered.filter((t) => t.id !== 'slugify')
