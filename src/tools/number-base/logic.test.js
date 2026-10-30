import { describe, expect, it } from 'vitest'
import { convertBase } from './logic.js'

const FF = { ok: true, bin: '11111111', oct: '377', dec: '255', hex: 'ff' }

describe('convertBase', () => {
  it('converts from decimal', () => {
    expect(convertBase('255', 10)).toEqual(FF)
  })
  it('converts from hex (case-insensitive)', () => {
    expect(convertBase('ff', 16)).toEqual(FF)
    expect(convertBase('FF', 16)).toEqual(FF)
  })
  it('converts from binary and octal', () => {
    expect(convertBase('11111111', 2)).toEqual(FF)
    expect(convertBase('377', 8)).toEqual(FF)
  })
  it('accepts a matching prefix', () => {
    expect(convertBase('0xFF', 16)).toEqual(FF)
    expect(convertBase('0b11111111', 2)).toEqual(FF)
    expect(convertBase('0o377', 8)).toEqual(FF)
  })
  it('ignores underscores, spaces around the value', () => {
    expect(convertBase(' 1_000 ', 10).dec).toBe('1000')
  })
  it('handles negative numbers', () => {
    expect(convertBase('-10', 10)).toEqual({ ok: true, bin: '-1010', oct: '-12', dec: '-10', hex: '-a' })
  })
  it('handles numbers beyond 2^53 exactly', () => {
    const r = convertBase('18446744073709551616', 10)
    expect(r.hex).toBe('10000000000000000')
    expect(r.bin).toBe('1' + '0'.repeat(64))
  })
  it('handles zero', () => {
    expect(convertBase('0', 10)).toEqual({ ok: true, bin: '0', oct: '0', dec: '0', hex: '0' })
  })
  it('rejects digits that are invalid for the base', () => {
    const r = convertBase('12', 2)
    expect(r.ok).toBe(false)
    expect(r.error.length).toBeGreaterThan(0)
  })
  it('rejects empty input and unsupported bases', () => {
    expect(convertBase('', 10).ok).toBe(false)
    expect(convertBase('10', 3).ok).toBe(false)
  })
})
