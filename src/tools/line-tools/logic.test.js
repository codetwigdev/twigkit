import { describe, expect, it } from 'vitest'
import { processLines } from './logic.js'

describe('processLines', () => {
  it('returns the text unchanged with no options', () => {
    expect(processLines('b\na\nc')).toEqual({ ok: true, output: 'b\na\nc', before: 3, after: 3 })
  })
  it('sorts ascending and descending', () => {
    expect(processLines('b\na\nc', { sort: 'asc' }).output).toBe('a\nb\nc')
    expect(processLines('b\na\nc', { sort: 'desc' }).output).toBe('c\nb\na')
  })
  it('sorts by length, then alphabetically', () => {
    expect(processLines('ccc\nb\naa\na', { sort: 'length' }).output).toBe('a\nb\naa\nccc')
  })
  it('sorts case-sensitively by code unit unless asked to ignore case', () => {
    expect(processLines('b\nB\na', { sort: 'asc' }).output).toBe('B\na\nb')
    expect(processLines('b\nB\na', { sort: 'asc', ignoreCase: true }).output).toBe('a\nb\nB')
  })
  it('removes duplicates, keeping the first occurrence', () => {
    expect(processLines('a\nb\na\nc\nb', { dedupe: true })).toEqual({
      ok: true,
      output: 'a\nb\nc',
      before: 5,
      after: 3,
    })
  })
  it('ignores case when deduplicating if asked', () => {
    expect(processLines('A\na\nB', { dedupe: true, ignoreCase: true }).output).toBe('A\nB')
    expect(processLines('A\na\nB', { dedupe: true }).output).toBe('A\na\nB')
  })
  it('trims whitespace and removes empty lines', () => {
    expect(processLines('  a \n\n b\n   ', { trim: true, removeEmpty: true }).output).toBe('a\nb')
  })
  it('removes empty lines only when asked', () => {
    expect(processLines('a\n\nb', { removeEmpty: true }).output).toBe('a\nb')
    expect(processLines('a\n\nb').output).toBe('a\n\nb')
  })
  it('reverses the order', () => {
    expect(processLines('a\nb\nc', { reverse: true }).output).toBe('c\nb\na')
  })
  it('deduplicates before sorting, and reverses last', () => {
    expect(processLines('b\na\nb', { dedupe: true, sort: 'asc', reverse: true }).output).toBe('b\na')
  })
  it('handles CRLF input', () => {
    expect(processLines('a\r\nb', { reverse: true }).output).toBe('b\na')
  })
  it('treats empty text as zero lines', () => {
    expect(processLines('')).toEqual({ ok: true, output: '', before: 0, after: 0 })
  })
})
