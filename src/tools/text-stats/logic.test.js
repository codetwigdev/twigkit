import { describe, expect, it } from 'vitest'
import { convertCase, countText } from './logic.js'

describe('countText', () => {
  it('returns zeros for empty text', () => {
    expect(countText('')).toEqual({
      characters: 0,
      charactersNoSpaces: 0,
      words: 0,
      lines: 0,
      readingMinutes: 0,
    })
  })
  it('counts a small sample', () => {
    expect(countText('Hello world.\nSecond line')).toEqual({
      characters: 24,
      charactersNoSpaces: 21,
      words: 4,
      lines: 2,
      readingMinutes: 1,
    })
  })
  it('collapses runs of whitespace when counting words', () => {
    expect(countText('  a   b \n\n c  ').words).toBe(3)
  })
  it('rounds reading time up at 200 words per minute', () => {
    const text = Array(201).fill('word').join(' ')
    expect(countText(text).readingMinutes).toBe(2)
  })
})

describe('convertCase', () => {
  it('upper and lower', () => {
    expect(convertCase('Hello World', 'upper')).toBe('HELLO WORLD')
    expect(convertCase('Hello World', 'lower')).toBe('hello world')
  })
  it('title case', () => {
    expect(convertCase('hello wORLD foo', 'title')).toBe('Hello World Foo')
  })
  it('camel case', () => {
    expect(convertCase('hello world-foo_bar', 'camel')).toBe('helloWorldFooBar')
  })
  it('pascal case', () => {
    expect(convertCase('hello world', 'pascal')).toBe('HelloWorld')
  })
  it('snake case', () => {
    expect(convertCase('Hello World', 'snake')).toBe('hello_world')
    expect(convertCase('helloWorld', 'snake')).toBe('hello_world')
  })
  it('kebab case', () => {
    expect(convertCase('Hello World', 'kebab')).toBe('hello-world')
    expect(convertCase('HelloWorld', 'kebab')).toBe('hello-world')
  })
  it('throws on an unknown mode', () => {
    expect(() => convertCase('x', 'sarcasm')).toThrow()
  })
})
