import { describe, expect, it } from 'vitest'
import { csvToJson, jsonToCsv } from './logic.js'

const parsed = (r) => JSON.parse(r.output)

describe('csvToJson', () => {
  it('turns rows into objects keyed by the header (values stay strings)', () => {
    const r = csvToJson('name,age\nAda,36\nLinus,54')
    expect(r.ok).toBe(true)
    expect(parsed(r)).toEqual([
      { name: 'Ada', age: '36' },
      { name: 'Linus', age: '54' },
    ])
  })
  it('pretty-prints with 2 spaces', () => {
    expect(csvToJson('a\n1').output).toBe('[\n  {\n    "a": "1"\n  }\n]')
  })
  it('handles quoted fields, escaped quotes and commas inside quotes', () => {
    expect(parsed(csvToJson('a,b\n"x, y","say ""hi"""'))).toEqual([{ a: 'x, y', b: 'say "hi"' }])
  })
  it('handles newlines inside quotes', () => {
    expect(parsed(csvToJson('a\n"line1\nline2"'))).toEqual([{ a: 'line1\nline2' }])
  })
  it('handles CRLF and ignores a trailing newline', () => {
    expect(parsed(csvToJson('a,b\r\n1,2\r\n'))).toEqual([{ a: '1', b: '2' }])
  })
  it('supports another delimiter', () => {
    expect(parsed(csvToJson('a;b\n1;2', { delimiter: ';' }))).toEqual([{ a: '1', b: '2' }])
  })
  it('gives arrays of arrays when there is no header row', () => {
    expect(parsed(csvToJson('a,b\n1,2', { header: false }))).toEqual([
      ['a', 'b'],
      ['1', '2'],
    ])
  })
  it('fills missing cells with empty strings', () => {
    expect(parsed(csvToJson('a,b\n1'))).toEqual([{ a: '1', b: '' }])
  })
  it('reports an unterminated quote', () => {
    const r = csvToJson('a\n"oops')
    expect(r.ok).toBe(false)
    expect(r.error.length).toBeGreaterThan(0)
  })
  it('rejects empty input', () => {
    expect(csvToJson('  ').ok).toBe(false)
  })
})

describe('jsonToCsv', () => {
  it('builds columns from the union of keys in first-seen order', () => {
    expect(jsonToCsv('[{"a":1,"b":"x"},{"a":2,"c":true}]')).toEqual({
      ok: true,
      output: 'a,b,c\n1,x,\n2,,true',
    })
  })
  it('quotes fields containing the delimiter, quotes or newlines', () => {
    expect(jsonToCsv('[{"a":"x, y"}]').output).toBe('a\n"x, y"')
    expect(jsonToCsv('[{"a":"say \\"hi\\""}]').output).toBe('a\n"say ""hi"""')
    expect(jsonToCsv('[{"a":"l1\\nl2"}]').output).toBe('a\n"l1\nl2"')
  })
  it('writes null as empty and nested values as JSON', () => {
    expect(jsonToCsv('[{"a":null,"b":{"c":1}}]').output).toBe('a,b\n,"{""c"":1}"')
  })
  it('accepts an array of arrays', () => {
    expect(jsonToCsv('[[1,2],[3,4]]').output).toBe('1,2\n3,4')
  })
  it('supports another delimiter', () => {
    expect(jsonToCsv('[{"a":1,"b":2}]', { delimiter: ';' }).output).toBe('a;b\n1;2')
  })
  it('rejects JSON that is not an array', () => {
    expect(jsonToCsv('{"a":1}').ok).toBe(false)
  })
  it('rejects invalid JSON and empty input', () => {
    expect(jsonToCsv('[').ok).toBe(false)
    expect(jsonToCsv('').ok).toBe(false)
  })
})
