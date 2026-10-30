import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { tools } from './registry.js'

const components = import.meta.glob('./tools/*/Tool.jsx', { eager: true })

describe('tool registry', () => {
  it('has well-formed metadata, with id matching the folder name', () => {
    const folders = Object.keys(import.meta.glob('./tools/*/index.js')).map(
      (p) => p.split('/')[2],
    )
    expect(tools.map((t) => t.id).sort()).toEqual(folders.sort())
    for (const t of tools) {
      expect(t.name).toBeTruthy()
      expect(t.description).toBeTruthy()
      expect(t.icon).toBeTruthy()
      expect(t.component).toBeTruthy()
    }
  })

  it.each(Object.entries(components))('%s renders without crashing', (_path, mod) => {
    const Tool = mod.default
    expect(() => render(<Tool />)).not.toThrow()
  })
})
