import { describe, expect, it } from 'vitest'
import { base64Decode, base64Encode, urlDecode, urlEncode } from './logic.js'

describe('base64', () => {
  it('encodes ASCII', () => {
    expect(base64Encode('hello')).toEqual({ ok: true, output: 'aGVsbG8=' })
  })
  it('round-trips unicode (UTF-8, not latin1)', () => {
    const text = 'héllo ✓ 日本'
    const enc = base64Encode(text)
    expect(enc.ok).toBe(true)
    expect(base64Decode(enc.output)).toEqual({ ok: true, output: text })
  })
  it('decodes padded input', () => {
    expect(base64Decode('aGVsbG8=')).toEqual({ ok: true, output: 'hello' })
  })
  it('decodes input with missing padding', () => {
    expect(base64Decode('aGVsbG8')).toEqual({ ok: true, output: 'hello' })
  })
  it('decodes the URL-safe alphabet (- and _)', () => {
    // "??>" encodes to "Pz8-" in base64url, "Pz8+" in standard base64
    expect(base64Decode('Pz8-')).toEqual({ ok: true, output: '??>' })
  })
  it('ignores surrounding whitespace when decoding', () => {
    expect(base64Decode('  aGVsbG8=\n').output).toBe('hello')
  })
  it('reports invalid base64', () => {
    const r = base64Decode('!!!')
    expect(r.ok).toBe(false)
    expect(r.error.length).toBeGreaterThan(0)
  })
  it('handles empty input', () => {
    expect(base64Encode('')).toEqual({ ok: true, output: '' })
    expect(base64Decode('')).toEqual({ ok: true, output: '' })
  })
})

describe('url encoding', () => {
  it('percent-encodes reserved characters and unicode', () => {
    expect(urlEncode('a b&c=d/é')).toEqual({ ok: true, output: 'a%20b%26c%3Dd%2F%C3%A9' })
  })
  it('decodes percent-encoding', () => {
    expect(urlDecode('a%20b%26c')).toEqual({ ok: true, output: 'a b&c' })
  })
  it('reports malformed sequences', () => {
    expect(urlDecode('%E0%A4%A').ok).toBe(false)
  })
})
