import { describe, expect, it } from 'vitest'
import { decodeJwt } from './logic.js'

// The well-known jwt.io sample token.
const SAMPLE =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'

const b64u = (obj) =>
  btoa(JSON.stringify(obj)).replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_')
const make = (payload) => `${b64u({ alg: 'HS256', typ: 'JWT' })}.${b64u(payload)}.sig`

describe('decodeJwt', () => {
  it('decodes header, payload and signature', () => {
    const r = decodeJwt(SAMPLE)
    expect(r.ok).toBe(true)
    expect(r.header).toEqual({ alg: 'HS256', typ: 'JWT' })
    expect(r.payload).toEqual({ sub: '1234567890', name: 'John Doe', iat: 1516239022 })
    expect(r.signature).toBe('SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c')
  })
  it('converts iat to an ISO date', () => {
    expect(decodeJwt(SAMPLE).issuedAt).toBe('2018-01-18T01:30:22.000Z')
  })
  it('reports no expiry when there is no exp claim', () => {
    const r = decodeJwt(SAMPLE)
    expect(r.expiresAt).toBeNull()
    expect(r.expired).toBeNull()
  })
  it('reports expiry and whether the token has expired, relative to now', () => {
    const token = make({ exp: 1700000000 })
    const after = decodeJwt(token, 1700000001000)
    expect(after.expiresAt).toBe('2023-11-14T22:13:20.000Z')
    expect(after.expired).toBe(true)
    expect(decodeJwt(token, 1699999999000).expired).toBe(false)
  })
  it('accepts a leading "Bearer " and surrounding whitespace', () => {
    expect(decodeJwt(`  Bearer ${SAMPLE}\n`).ok).toBe(true)
  })
  it('rejects a token without three parts', () => {
    const r = decodeJwt('abc.def')
    expect(r.ok).toBe(false)
    expect(r.error.length).toBeGreaterThan(0)
  })
  it('rejects parts that are not base64url JSON', () => {
    expect(decodeJwt('aaa.bbb.ccc').ok).toBe(false)
  })
  it('rejects empty input', () => {
    expect(decodeJwt('  ').ok).toBe(false)
  })
})
