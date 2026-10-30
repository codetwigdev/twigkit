import { describe, expect, it } from 'vitest'

// Structural checks for every article module in this folder. Facts are reviewed by a person.
const modules = import.meta.glob(['./*.js', '!./*.test.js'], { eager: true })
const articles = Object.entries(modules)
  .filter(([, m]) => m.default && Array.isArray(m.default.blocks))
  .map(([file, m]) => ({ path: `src/articles/${file.slice(2)}`, file: file.slice(2), a: m.default }))

const toolIds = Object.keys(import.meta.glob('../tools/*/index.js')).map((p) => p.split('/')[2])
const articleSlugs = articles.map(({ a }) => a.slug)
const BLOCKS = ['p', 'h2', 'h3', 'ul', 'ol', 'code', 'quote', 'callout']

const textOf = (b) => [b.text, b.title, b.cite, ...(b.items ?? [])].filter(Boolean)
const proseOf = (a) => a.blocks.filter((b) => b.type !== 'code').flatMap(textOf)
const words = (a) => proseOf(a).join(' ').split(/\s+/).filter(Boolean).length

it('there are articles to check', () => {
  expect(articles.length).toBeGreaterThan(0)
})

describe.each(articles)('$path', ({ file, a }) => {
  it('has valid metadata', () => {
    expect(a.slug, 'slug must equal the file name').toBe(file.replace(/\.js$/, ''))
    expect(a.title.length).toBeGreaterThan(5)
    expect(a.summary.length).toBeGreaterThanOrEqual(40)
    expect(a.summary.length).toBeLessThanOrEqual(200)
    expect(a.date).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    expect(Number.isNaN(Date.parse(a.date))).toBe(false)
    expect(a.tags.length).toBeGreaterThanOrEqual(1)
    expect(a.tags.length).toBeLessThanOrEqual(4)
    for (const t of a.tags) expect(t).toMatch(/^[a-z0-9-]+$/)
    if (a.tool !== undefined) expect(toolIds, `unknown tool ${a.tool}`).toContain(a.tool)
  })

  it('uses only known block types with the right fields', () => {
    for (const b of a.blocks) {
      expect(BLOCKS, `unknown block type ${b.type}`).toContain(b.type)
      if (['p', 'h2', 'h3', 'code', 'quote', 'callout'].includes(b.type)) {
        expect(typeof b.text, `${b.type} needs text`).toBe('string')
        expect(b.text.length).toBeGreaterThan(0)
      }
      if (['ul', 'ol'].includes(b.type)) {
        expect(Array.isArray(b.items) && b.items.length > 0, `${b.type} needs items`).toBe(true)
      }
      if (b.type === 'code') expect(['js', 'json', 'bash', 'text']).toContain(b.lang)
    }
  })

  it('has the expected shape: 4-8 h2 headings, 1+ code block, exactly 1 callout', () => {
    const count = (t) => a.blocks.filter((b) => b.type === t).length
    expect(count('h2')).toBeGreaterThanOrEqual(4)
    expect(count('h2')).toBeLessThanOrEqual(8)
    expect(count('code')).toBeGreaterThanOrEqual(1)
    expect(count('callout')).toBe(1)
    expect(a.blocks.some((b) => b.type === 'h1')).toBe(false)
  })

  it('is 550 to 1100 words of prose', () => {
    const n = words(a)
    expect(n).toBeGreaterThanOrEqual(550)
    expect(n).toBeLessThanOrEqual(1100)
  })

  it('has clean inline markup: balanced backticks and bold, no HTML, internal links only', () => {
    for (const s of proseOf(a)) {
      expect((s.match(/`/g) ?? []).length % 2, `unbalanced backticks in: ${s}`).toBe(0)
      expect((s.match(/\*\*/g) ?? []).length % 2, `unbalanced ** in: ${s}`).toBe(0)
      expect(s.replace(/`[^`]*`/g, ''), `HTML in prose: ${s}`).not.toMatch(/<\/?[a-z][^>]*>/i)
      expect(s, `exclamation mark in: ${s}`).not.toMatch(/!(\s|$)/)
      for (const [, href] of s.matchAll(/\]\(([^)]*)\)/g)) {
        expect(href, `external or odd link ${href}`).toMatch(/^#\//)
        const [, section, id] = href.split('/')
        if (section === 'articles') expect(articleSlugs, `unknown article ${id}`).toContain(id)
        else if (section !== 'about') expect(toolIds, `unknown tool ${section}`).toContain(section)
      }
    }
  })

  it('ends by pointing at its related tool when it has one', () => {
    if (!a.tool) return
    const linked = proseOf(a).some((s) => s.includes(`](#/${a.tool})`))
    expect(linked, `link to #/${a.tool}`).toBe(true)
  })
})
