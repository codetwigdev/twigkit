import { describe, expect, it } from 'vitest'
import { convertColor } from './logic.js'

describe('convertColor', () => {
  it('converts a 6-digit hex', () => {
    expect(convertColor('#ff8000')).toEqual({
      ok: true,
      hex: '#ff8000',
      rgb: 'rgb(255, 128, 0)',
      hsl: 'hsl(30, 100%, 50%)',
    })
  })
  it('expands 3-digit hex', () => {
    const r = convertColor('#f80')
    expect(r.hex).toBe('#ff8800')
    expect(r.rgb).toBe('rgb(255, 136, 0)')
  })
  it('is case-insensitive and tolerates a missing #', () => {
    expect(convertColor('FF8000').hex).toBe('#ff8000')
    expect(convertColor('#FF8000').hex).toBe('#ff8000')
  })
  it('parses rgb()', () => {
    const r = convertColor('rgb(0, 0, 255)')
    expect(r.hex).toBe('#0000ff')
    expect(r.hsl).toBe('hsl(240, 100%, 50%)')
  })
  it('parses hsl()', () => {
    const r = convertColor('hsl(120, 100%, 25%)')
    expect(r.rgb).toBe('rgb(0, 128, 0)')
    expect(r.hex).toBe('#008000')
  })
  it('handles black, white and grey', () => {
    expect(convertColor('#000000').hsl).toBe('hsl(0, 0%, 0%)')
    expect(convertColor('#ffffff').hsl).toBe('hsl(0, 0%, 100%)')
    expect(convertColor('#808080').hsl).toBe('hsl(0, 0%, 50%)')
  })
  it('rejects out-of-range rgb values', () => {
    expect(convertColor('rgb(300, 0, 0)').ok).toBe(false)
  })
  it('rejects garbage', () => {
    const r = convertColor('banana')
    expect(r.ok).toBe(false)
    expect(r.error.length).toBeGreaterThan(0)
  })
})
