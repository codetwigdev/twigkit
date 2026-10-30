import { describe, expect, it } from 'vitest'
import { ALGORITHMS, hashText } from './logic.js'

describe('ALGORITHMS', () => {
  it('lists the supported algorithms in order', () => {
    expect(ALGORITHMS).toEqual(['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'])
  })
})

describe('hashText', () => {
  it('SHA-256 of "abc"', async () => {
    expect(await hashText('abc', 'SHA-256')).toEqual({
      ok: true,
      output: 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad',
    })
  })
  it('defaults to SHA-256', async () => {
    expect((await hashText('abc')).output).toBe(
      'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad',
    )
  })
  it('SHA-1 of "abc"', async () => {
    expect((await hashText('abc', 'SHA-1')).output).toBe('a9993e364706816aba3e25717850c26c9cd0d89d')
  })
  it('SHA-384 of "abc"', async () => {
    expect((await hashText('abc', 'SHA-384')).output).toBe(
      'cb00753f45a35e8bb5a03d699ac65007272c32ab0eded1631a8b605a43ff5bed8086072ba1e7cc2358baeca134c825a7',
    )
  })
  it('SHA-512 of "abc"', async () => {
    expect((await hashText('abc', 'SHA-512')).output).toBe(
      'ddaf35a193617abacc417349ae20413112e6fa4e89a97ea20a9eeee64b55d39a2192992a274fc1a836ba3c23a3feebbd454d4423643ce80e2a9ac94fa54ca49f',
    )
  })
  it('hashes the empty string', async () => {
    expect((await hashText('', 'SHA-256')).output).toBe(
      'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    )
  })
  it('rejects an unsupported algorithm', async () => {
    const r = await hashText('abc', 'MD5')
    expect(r.ok).toBe(false)
    expect(r.error.length).toBeGreaterThan(0)
  })
})
