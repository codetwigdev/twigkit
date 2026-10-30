import { describe, expect, it } from 'vitest'
import { slugify } from './logic.js'

describe('slugify', () => {
  it('lowercases and joins words with a dash', () => {
    expect(slugify('Hello World')).toBe('hello-world')
  })
  it('strips accents and punctuation', () => {
    expect(slugify('Héllo, Wörld!')).toBe('hello-world')
  })
  it('trims leading and trailing separators', () => {
    expect(slugify('  --Hi there--  ')).toBe('hi-there')
  })
  it('supports a custom separator', () => {
    expect(slugify('Hello World', { separator: '_' })).toBe('hello_world')
  })
  it('returns an empty string for empty input', () => {
    expect(slugify('')).toBe('')
  })
})
