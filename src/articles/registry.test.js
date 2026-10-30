import { describe, expect, it } from 'vitest'
import { tools } from '../registry.js'
import { articleBySlug, articles, articlesForTool, formatDate, readingTime, wordCount } from './registry.js'

const BLOCK_TYPES = ['p', 'h2', 'h3', 'ul', 'ol', 'code', 'quote', 'callout']
const files = Object.keys(import.meta.glob('./*.js')).map((p) => p.slice(2, -3))

describe('article registry', () => {
  it('is sorted newest first, then by title', () => {
    for (let i = 1; i < articles.length; i++) {
      const a = articles[i - 1]
      const b = articles[i]
      expect(a.date >= b.date).toBe(true)
      if (a.date === b.date) expect(a.title.localeCompare(b.title) <= 0).toBe(true)
    }
  })

  it('never includes helper files', () => {
    expect(articles.some((a) => ['registry', 'inline'].includes(a.slug))).toBe(false)
  })

  it.each(articles.map((a) => [a.slug, a]))('%s is well formed', (slug, a) => {
    expect(files).toContain(slug)
    expect(a.title).toBeTruthy()
    expect(a.summary).toBeTruthy()
    expect(a.date).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    expect(Array.isArray(a.tags)).toBe(true)
    if (a.tool !== undefined) expect(tools.map((t) => t.id)).toContain(a.tool)
    expect(Array.isArray(a.blocks)).toBe(true)
    expect(a.blocks.length).toBeGreaterThan(0)
    for (const b of a.blocks) expect(BLOCK_TYPES).toContain(b.type)
    expect(articleBySlug(slug)).toBe(a)
    if (a.tool) expect(articlesForTool(a.tool)).toContain(a)
    expect(readingTime(a)).toMatch(/^[1-9]\d* min read$/)
  })

  it('finds nothing for an unknown slug', () => {
    expect(articleBySlug('no-such-article')).toBeUndefined()
    expect(articlesForTool('no-such-tool')).toEqual([])
  })

  it('counts words across block types and rounds to whole minutes', () => {
    const fixture = {
      blocks: [
        { type: 'p', text: 'one two three' },
        { type: 'h2', text: 'four' },
        { type: 'ul', items: ['five six', 'seven'] },
        { type: 'code', lang: 'js', text: 'eight nine' },
        { type: 'quote', text: 'ten', cite: 'ignored' },
        { type: 'callout', title: 'eleven', text: 'twelve thirteen' },
      ],
    }
    expect(wordCount(fixture)).toBe(13)
    expect(readingTime(fixture)).toBe('1 min read')
    const long = { blocks: [{ type: 'p', text: Array(900).fill('w').join(' ') }] }
    expect(readingTime(long)).toBe('5 min read')
    expect(readingTime({ blocks: [] })).toBe('1 min read')
  })

  it('formats ISO dates as "30 Oct 2026"', () => {
    expect(formatDate('2026-10-30')).toBe('30 Oct 2026')
    expect(formatDate('2026-01-05')).toBe('5 Jan 2026')
    expect(formatDate('not a date')).toBe('not a date')
  })
})
