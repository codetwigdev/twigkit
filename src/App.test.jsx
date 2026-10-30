import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App.jsx'

function renderAt(hash) {
  window.location.hash = hash
  return render(<App />)
}

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

  it('shows a tool at #/<id>', () => {
    renderAt('#/json-formatter')
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('JSON Formatter')
    expect(document.title).toBe('JSON Formatter · TwigKit')
  })

  it('has a focusable main landmark on every page', () => {
    for (const hash of ['#/', '#/about', '#/slugify']) {
      renderAt(hash)
      const main = document.getElementById('main')
      expect(main).not.toBeNull()
      expect(main.tagName).toBe('MAIN')
      expect(main.getAttribute('tabindex')).toBe('-1')
      cleanup()
    }
  })

  it('offers a skip link as the first focusable element', () => {
    renderAt('#/')
    const skip = screen.getByText('Skip to content')
    expect(skip).toHaveClass('skip-link')
  })
})
