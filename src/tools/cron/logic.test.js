import { describe, expect, it } from 'vitest'
import { explainCron, nextRuns } from './logic.js'

describe('explainCron', () => {
  const cases = [
    ['* * * * *', 'Every minute'],
    ['*/15 * * * *', 'Every 15 minutes'],
    ['0 9 * * *', 'At 09:00 every day'],
    ['30 14 * * 1-5', 'At 14:30 on Monday to Friday'],
    ['0 0 1 * *', 'At 00:00 on day 1 of every month'],
    ['0 0 * * 0', 'At 00:00 on Sunday'],
    ['0 0 * * 7', 'At 00:00 on Sunday'],
    ['0 12 15 6 *', 'At 12:00 on day 15 of June'],
    ['0 8 * * 1,3,5', 'At 08:00 on Monday, Wednesday and Friday'],
    ['0 8 * * mon', 'At 08:00 on Monday'],
  ]
  it.each(cases)('%s', (expr, text) => {
    expect(explainCron(expr)).toEqual({ ok: true, summary: text })
  })
  it('falls back to a field-by-field sentence for other shapes', () => {
    const r = explainCron('5,35 */2 * * *')
    expect(r.ok).toBe(true)
    expect(r.summary.length).toBeGreaterThan(10)
  })
  it.each(['', '* * * *', '* * * * * *', '60 * * * *', '* 24 * * *', '* * 0 * *', '* * * 13 *', '* * * * 8', 'a * * * *'])(
    'rejects %j',
    (expr) => {
      const r = explainCron(expr)
      expect(r.ok).toBe(false)
      expect(r.error.length).toBeGreaterThan(0)
    },
  )
})

describe('nextRuns', () => {
  it('lists the next matches strictly after the start time (UTC)', () => {
    expect(nextRuns('*/15 * * * *', Date.UTC(2026, 0, 1, 10, 7), 3)).toEqual({
      ok: true,
      runs: ['2026-01-01T10:15:00.000Z', '2026-01-01T10:30:00.000Z', '2026-01-01T10:45:00.000Z'],
    })
  })
  it('does not return the start time itself', () => {
    expect(nextRuns('0 9 * * *', Date.UTC(2026, 0, 1, 9, 0), 2).runs).toEqual([
      '2026-01-02T09:00:00.000Z',
      '2026-01-03T09:00:00.000Z',
    ])
  })
  it('respects day-of-week ranges', () => {
    // Friday 2 Jan 2026 15:00, so the next weekdays are Mon 5 and Tue 6.
    expect(nextRuns('30 14 * * 1-5', Date.UTC(2026, 0, 2, 15, 0), 2).runs).toEqual([
      '2026-01-05T14:30:00.000Z',
      '2026-01-06T14:30:00.000Z',
    ])
  })
  it('respects day-of-month', () => {
    expect(nextRuns('0 0 1 * *', Date.UTC(2026, 0, 15), 2).runs).toEqual([
      '2026-02-01T00:00:00.000Z',
      '2026-03-01T00:00:00.000Z',
    ])
  })
  it('matches day-of-month OR day-of-week when both are restricted', () => {
    expect(nextRuns('0 0 13 * 5', Date.UTC(2026, 1, 1), 3).runs).toEqual([
      '2026-02-06T00:00:00.000Z',
      '2026-02-13T00:00:00.000Z',
      '2026-02-20T00:00:00.000Z',
    ])
  })
  it('returns an empty list (and does not hang) for a date that never exists', () => {
    expect(nextRuns('0 0 30 2 *', Date.UTC(2026, 0, 1), 1)).toEqual({ ok: true, runs: [] })
  })
  it('defaults to 5 runs', () => {
    expect(nextRuns('* * * * *', Date.UTC(2026, 0, 1)).runs).toHaveLength(5)
  })
  it('reports an invalid expression', () => {
    expect(nextRuns('nope', Date.UTC(2026, 0, 1)).ok).toBe(false)
  })
})
