import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App.jsx'
import { tools } from './registry.js'
import { groups, matchTools, numberOf, ordered, total, WORKER_TOOLS } from './catalog.js'
import { articles } from './articles/registry.js'

function renderAt(hash) {
  window.location.hash = hash
  return render(<App />)
}

const pad = (n) => String(n).padStart(2, '0')

beforeEach(() => {
  window.scrollTo = vi.fn()
})

afterEach(() => {
  cleanup()
  window.location.hash = ''
})

describe('routing', () => {
  it('shows Home at #/', () => {
    renderAt('#/')
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Tiny tools')
    expect(document.title).toBe('TwigKit — Tiny tools, done beautifully')
  })

  it('shows Home for an empty hash', () => {
    renderAt('')
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Tiny tools')
  })

  it('shows Home for an unknown hash', () => {
    renderAt('#/does-not-exist')
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Tiny tools')
  })

  it('shows About at #/about', () => {
    renderAt('#/about')
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('One architect')
    expect(document.title).toBe("How it's built · TwigKit")
  })

  it('shows the articles index at #/articles and for an unknown slug', () => {
    renderAt('#/articles')
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('From the notebook')
    expect(document.title).toBe('Articles · TwigKit')
    cleanup()
    renderAt('#/articles/no-such-article')
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('From the notebook')
  })

  it.skipIf(articles.length === 0)('shows an article at #/articles/<slug>', () => {
    const a = articles[0]
    renderAt(`#/articles/${a.slug}`)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(a.title)
    expect(document.title).toBe(`${a.title} · TwigKit`)
  })

  it('shows a tool at #/<id> with a derived index number', () => {
    renderAt('#/json-formatter')
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('JSON Formatter')
    expect(document.title).toBe('JSON Formatter · TwigKit')
    const tool = tools.find((t) => t.id === 'json-formatter')
    expect(screen.getByText(`Tool ${numberOf(tool)} of ${total} · Data`)).toBeInTheDocument()
  })

  it('has a focusable main landmark and an Articles link on every page', () => {
    for (const hash of ['#/', '#/about', '#/articles', '#/slugify']) {
      renderAt(hash)
      const main = document.getElementById('main')
      expect(main).not.toBeNull()
      expect(main.tagName).toBe('MAIN')
      expect(main.getAttribute('tabindex')).toBe('-1')
      const links = screen.getAllByRole('link', { name: 'Articles' })
      expect(links.some((l) => l.getAttribute('href') === '#/articles')).toBe(true)
      cleanup()
    }
  })

  it('offers a skip link as the first focusable element', () => {
    renderAt('#/')
    const skip = screen.getByText('Skip to content')
    expect(skip).toHaveClass('skip-link')
  })
})

describe('catalog', () => {
  it('numbers every tool once, in category order, zero-padded', () => {
    expect(ordered).toHaveLength(tools.length)
    expect(total).toBe(pad(tools.length))
    const numbers = ordered.map(numberOf)
    expect(numbers).toEqual(ordered.map((_, i) => pad(i + 1)))
    const flat = groups.flatMap((g) => g.tools.map((t) => t.id))
    expect(flat).toEqual(ordered.map((t) => t.id))
  })

  it('treats every tool but slugify as worker-built', () => {
    expect(WORKER_TOOLS).toHaveLength(tools.length - 1)
    expect(WORKER_TOOLS.some((t) => t.id === 'slugify')).toBe(false)
  })

  it('matches by name, description, id and category name', () => {
    expect(matchTools('')).toEqual(ordered)
    expect(matchTools('JSON FORMATTER').map((t) => t.id)).toContain('json-formatter')
    expect(matchTools('encode & decode').map((t) => t.id)).toContain('encode-decode')
    expect(matchTools('zzzz')).toEqual([])
  })
})
