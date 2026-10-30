import { describe, expect, it } from 'vitest'
import { fromUnix, toUnix } from './logic.js'

describe('fromUnix', () => {
  it('converts seconds (auto-detected)', () => {
    expect(fromUnix(1700000000)).toEqual({
      ok: true,
      unit: 'seconds',
      iso: '2023-11-14T22:13:20.000Z',
      utc: 'Tue, 14 Nov 2023 22:13:20 GMT',
    })
  })
  it('converts milliseconds (auto-detected when abs value >= 1e11)', () => {
    const r = fromUnix(1700000000000)
    expect(r.unit).toBe('milliseconds')
    expect(r.iso).toBe('2023-11-14T22:13:20.000Z')
  })
  it('handles zero', () => {
    expect(fromUnix(0).iso).toBe('1970-01-01T00:00:00.000Z')
  })
  it('accepts numeric strings', () => {
    expect(fromUnix(' 1700000000 ').iso).toBe('2023-11-14T22:13:20.000Z')
  })
  it('lets the caller force the unit', () => {
    const r = fromUnix(1700000, 'milliseconds')
    expect(r.unit).toBe('milliseconds')
    expect(r.iso).toBe('1970-01-01T00:28:20.000Z')
    expect(fromUnix(1700000, 'seconds').iso).toBe('1970-01-20T16:13:20.000Z')
  })
  it('rejects non-numeric input', () => {
    const r = fromUnix('abc')
    expect(r.ok).toBe(false)
    expect(r.error.length).toBeGreaterThan(0)
  })
  it('rejects empty input', () => {
    expect(fromUnix('').ok).toBe(false)
  })
})

describe('toUnix', () => {
  it('parses an ISO date', () => {
    expect(toUnix('2023-11-14T22:13:20Z')).toEqual({
      ok: true,
      seconds: 1700000000,
      milliseconds: 1700000000000,
    })
  })
  it('rejects unparseable dates', () => {
    expect(toUnix('not a date').ok).toBe(false)
  })
  it('rejects empty input', () => {
    expect(toUnix('').ok).toBe(false)
  })
})
