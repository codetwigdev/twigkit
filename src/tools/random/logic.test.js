import { describe, expect, it } from 'vitest'
import { randomString, uuidV4 } from './logic.js'

describe('uuidV4', () => {
  it('returns a valid version-4 UUID', () => {
    expect(uuidV4()).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
    )
  })
  it('returns a different value each call', () => {
    expect(uuidV4()).not.toBe(uuidV4())
  })
})

describe('randomString', () => {
  it('defaults to 16 letters and digits', () => {
    const r = randomString()
    expect(r.ok).toBe(true)
    expect(r.output).toMatch(/^[A-Za-z0-9]{16}$/)
  })
  it('respects length and character sets', () => {
    const r = randomString({ length: 10, upper: false, lower: false, digits: true, symbols: false })
    expect(r.output).toMatch(/^[0-9]{10}$/)
  })
  it('can use symbols only', () => {
    const r = randomString({ length: 20, upper: false, lower: false, digits: false, symbols: true })
    expect(r.output).toHaveLength(20)
    expect(r.output).toMatch(/^[^A-Za-z0-9]{20}$/)
  })
  it('errors when no character set is selected', () => {
    const r = randomString({ upper: false, lower: false, digits: false, symbols: false })
    expect(r.ok).toBe(false)
    expect(r.error.length).toBeGreaterThan(0)
  })
  it('errors on a bad length', () => {
    expect(randomString({ length: 0 }).ok).toBe(false)
    expect(randomString({ length: 1025 }).ok).toBe(false)
    expect(randomString({ length: 2.5 }).ok).toBe(false)
  })
})
