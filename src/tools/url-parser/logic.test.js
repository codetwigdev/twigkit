import { describe, expect, it } from 'vitest'
import { parseUrl } from './logic.js'

describe('parseUrl', () => {
  it('splits a full URL into its parts', () => {
    const r = parseUrl('https://user:pw@example.com:8080/a/b?x=1&y=two%20words&x=3#frag')
    expect(r).toEqual({
      ok: true,
      protocol: 'https:',
      username: 'user',
      password: 'pw',
      hostname: 'example.com',
      port: '8080',
      origin: 'https://example.com:8080',
      pathname: '/a/b',
      search: '?x=1&y=two%20words&x=3',
      hash: '#frag',
      params: [
        { key: 'x', value: '1' },
        { key: 'y', value: 'two words' },
        { key: 'x', value: '3' },
      ],
    })
  })
  it('uses empty strings and an empty list for missing parts', () => {
    const r = parseUrl('http://example.com')
    expect(r.ok).toBe(true)
    expect(r.username).toBe('')
    expect(r.port).toBe('')
    expect(r.search).toBe('')
    expect(r.hash).toBe('')
    expect(r.params).toEqual([])
    expect(r.pathname).toBe('/')
  })
  it('trims whitespace', () => {
    expect(parseUrl('  https://example.com/x  ').pathname).toBe('/x')
  })
  it('asks for a scheme when it is missing', () => {
    const r = parseUrl('example.com/path')
    expect(r.ok).toBe(false)
    expect(r.error).toMatch(/scheme/i)
  })
  it('rejects garbage and empty input', () => {
    expect(parseUrl('not a url').ok).toBe(false)
    expect(parseUrl('').ok).toBe(false)
  })
})
