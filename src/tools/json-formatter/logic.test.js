import { describe, expect, it } from 'vitest'
import { formatJson, minifyJson } from './logic.js'

describe('formatJson', () => {
  it('pretty-prints with 2 spaces by default', () => {
    expect(formatJson('{"b":1,"a":[1,2]}')).toEqual({
      ok: true,
      output: '{\n  "b": 1,\n  "a": [\n    1,\n    2\n  ]\n}',
    })
  })
  it('honours the indent option', () => {
    expect(formatJson('{"a":1}', { indent: 4 }).output).toBe('{\n    "a": 1\n}')
  })
  it('indent 0 gives compact output', () => {
    expect(formatJson('{ "a" : 1 }', { indent: 0 }).output).toBe('{"a":1}')
  })
  it('sorts keys recursively when asked', () => {
    const r = formatJson('{"b":{"d":1,"c":2},"a":1}', { indent: 0, sortKeys: true })
    expect(r.output).toBe('{"a":1,"b":{"c":2,"d":1}}')
  })
  it('does not reorder array items when sorting keys', () => {
    const r = formatJson('{"a":[3,1,2]}', { indent: 0, sortKeys: true })
    expect(r.output).toBe('{"a":[3,1,2]}')
  })
  it('reports invalid JSON', () => {
    const r = formatJson('{"a":')
    expect(r.ok).toBe(false)
    expect(typeof r.error).toBe('string')
    expect(r.error.length).toBeGreaterThan(0)
  })
  it('treats empty input as an error', () => {
    expect(formatJson('   ').ok).toBe(false)
  })
})

describe('minifyJson', () => {
  it('removes whitespace', () => {
    expect(minifyJson('{ "a" : [ 1, 2 ] }')).toEqual({ ok: true, output: '{"a":[1,2]}' })
  })
  it('reports invalid JSON', () => {
    expect(minifyJson('nope').ok).toBe(false)
  })
})
