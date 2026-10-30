import { describe, expect, it } from 'vitest'
import { testRegex } from './logic.js'

describe('testRegex', () => {
  it('finds all matches with the g flag', () => {
    const r = testRegex('\\d+', 'g', 'a1 b22 c333')
    expect(r.ok).toBe(true)
    expect(r.matches).toHaveLength(3)
    expect(r.matches[1]).toEqual({ index: 4, match: '22', groups: [], named: {} })
    expect(r.truncated).toBe(false)
  })
  it('returns only the first match without the g flag', () => {
    expect(testRegex('\\d+', '', 'a1 b22').matches).toHaveLength(1)
  })
  it('returns numbered capture groups', () => {
    const r = testRegex('(\\w)(\\d)', '', 'a1 b2')
    expect(r.matches[0].groups).toEqual(['a', '1'])
  })
  it('returns named capture groups', () => {
    const r = testRegex('(?<y>\\d{4})-(?<m>\\d{2})', '', '2024-05')
    expect(r.matches[0].named).toEqual({ y: '2024', m: '05' })
  })
  it('supports the i flag', () => {
    expect(testRegex('abc', 'gi', 'ABC abc').matches).toHaveLength(2)
  })
  it('does not hang on patterns that match the empty string', () => {
    expect(testRegex('x*', 'g', 'abc').matches).toHaveLength(4)
  })
  it('caps results at 1000 and flags truncation', () => {
    const r = testRegex('a', 'g', 'a'.repeat(1500))
    expect(r.matches).toHaveLength(1000)
    expect(r.truncated).toBe(true)
  })
  it('returns no matches (not an error) when nothing matches', () => {
    expect(testRegex('z', 'g', 'abc')).toEqual({ ok: true, matches: [], truncated: false })
  })
  it('reports an invalid pattern', () => {
    const r = testRegex('(', 'g', 'abc')
    expect(r.ok).toBe(false)
    expect(r.error.length).toBeGreaterThan(0)
  })
  it('reports invalid flags', () => {
    expect(testRegex('a', 'z', 'abc').ok).toBe(false)
  })
  it('treats an empty pattern as an error', () => {
    expect(testRegex('', 'g', 'abc').ok).toBe(false)
  })
})
