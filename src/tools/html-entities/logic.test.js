import { describe, expect, it } from 'vitest'
import { escapeHtml, unescapeHtml } from './logic.js'

describe('escapeHtml', () => {
  it('escapes the five special characters', () => {
    expect(escapeHtml('<a href="x">Tom & Jerry\'s</a>')).toEqual({
      ok: true,
      output: '&lt;a href=&quot;x&quot;&gt;Tom &amp; Jerry&#39;s&lt;/a&gt;',
    })
  })
  it('leaves ordinary and non-ASCII text alone', () => {
    expect(escapeHtml('héllo ✓ 日本').output).toBe('héllo ✓ 日本')
  })
  it('handles empty input', () => {
    expect(escapeHtml('')).toEqual({ ok: true, output: '' })
  })
})

describe('unescapeHtml', () => {
  it('decodes named and numeric entities', () => {
    expect(unescapeHtml('&lt;p&gt; &quot;hi&quot; &#39;x&#39; &#x41; &#65; &apos;').output).toBe(
      '<p> "hi" \'x\' A A \'',
    )
  })
  it('decodes non-breaking space', () => {
    expect(unescapeHtml('a&nbsp;b').output).toBe('a b')
  })
  it('decodes once, never twice', () => {
    expect(unescapeHtml('&amp;lt;').output).toBe('&lt;')
    expect(unescapeHtml('&amp;amp;').output).toBe('&amp;')
  })
  it('decodes astral code points', () => {
    expect(unescapeHtml('&#128512; &#x1F600;').output).toBe('\u{1F600} \u{1F600}')
  })
  it('leaves unknown or invalid entities unchanged', () => {
    expect(unescapeHtml('&foo; &#99999999; &').output).toBe('&foo; &#99999999; &')
  })
  it('round-trips with escapeHtml', () => {
    const text = '<div class="a">x & y</div>'
    expect(unescapeHtml(escapeHtml(text).output).output).toBe(text)
  })
})
