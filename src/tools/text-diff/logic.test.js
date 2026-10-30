import { describe, expect, it } from 'vitest'
import { diffLines, diffStats } from './logic.js'

describe('diffLines', () => {
  it('marks a changed line as remove then add', () => {
    expect(diffLines('a\nb\nc', 'a\nx\nc')).toEqual([
      { type: 'same', text: 'a' },
      { type: 'remove', text: 'b' },
      { type: 'add', text: 'x' },
      { type: 'same', text: 'c' },
    ])
  })
  it('reports identical text as all same', () => {
    expect(diffLines('a\nb', 'a\nb')).toEqual([
      { type: 'same', text: 'a' },
      { type: 'same', text: 'b' },
    ])
  })
  it('detects pure insertions', () => {
    expect(diffLines('a\nc', 'a\nb\nc')).toEqual([
      { type: 'same', text: 'a' },
      { type: 'add', text: 'b' },
      { type: 'same', text: 'c' },
    ])
  })
  it('detects pure deletions', () => {
    expect(diffLines('a\nb\nc', 'a\nc')).toEqual([
      { type: 'same', text: 'a' },
      { type: 'remove', text: 'b' },
      { type: 'same', text: 'c' },
    ])
  })
  it('treats empty string as zero lines', () => {
    expect(diffLines('', 'a\nb')).toEqual([
      { type: 'add', text: 'a' },
      { type: 'add', text: 'b' },
    ])
    expect(diffLines('a', '')).toEqual([{ type: 'remove', text: 'a' }])
    expect(diffLines('', '')).toEqual([])
  })
  it('handles CRLF line endings', () => {
    expect(diffLines('a\r\nb', 'a\nb')).toEqual([
      { type: 'same', text: 'a' },
      { type: 'same', text: 'b' },
    ])
  })
})

describe('diffStats', () => {
  it('counts each type', () => {
    expect(diffStats(diffLines('a\nb\nc', 'a\nx\nc'))).toEqual({ added: 1, removed: 1, same: 2 })
  })
})
