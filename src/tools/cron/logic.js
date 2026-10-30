// Pure logic only: no React, no DOM.

const MONTHS = {
  JAN: 1, FEB: 2, MAR: 3, APR: 4, MAY: 5, JUN: 6,
  JUL: 7, AUG: 8, SEP: 9, OCT: 10, NOV: 11, DEC: 12,
}
const DOWS = { SUN: 0, MON: 1, TUE: 2, WED: 3, THU: 4, FRI: 5, SAT: 6 }

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

const FIELDS = [
  { key: 'minute', min: 0, max: 59 },
  { key: 'hour', min: 0, max: 23 },
  { key: 'dom', min: 1, max: 31 },
  { key: 'month', min: 1, max: 12 },
  { key: 'dow', min: 0, max: 7 },
]

function parseValue(token, field, raw) {
  const upper = token.toUpperCase()
  if (field.key === 'month' && MONTHS[upper] !== undefined) return MONTHS[upper]
  if (field.key === 'dow' && DOWS[upper] !== undefined) return DOWS[upper]
  if (!/^\d+$/.test(token)) {
    throw new Error(`invalid value "${raw}" in ${field.key}`)
  }
  const n = parseInt(token, 10)
  if (n < field.min || n > field.max) {
    throw new Error(`${field.key} value ${n} out of range`)
  }
  return n
}

function parseField(raw, field) {
  const isStar = raw === '*'
  const values = new Set()
  const items = raw.split(',')
  for (const item of items) {
    if (item === '') throw new Error(`empty item in ${field.key}`)
    const [rangePart, stepPart] = item.split('/')
    if (stepPart !== undefined && stepPart !== '') {
      if (!/^\d+$/.test(stepPart)) throw new Error(`invalid step in ${field.key}`)
      const step = parseInt(stepPart, 10)
      if (step === 0) throw new Error(`step 0 in ${field.key}`)
      if (rangePart === '*') {
        for (let v = field.min; v <= field.max; v += step) values.add(v)
      } else if (rangePart.includes('-')) {
        const [a, b] = rangePart.split('-')
        if (a === '' || b === '') throw new Error(`invalid range in ${field.key}`)
        const lo = parseValue(a, field, raw)
        const hi = parseValue(b, field, raw)
        if (lo > hi) throw new Error(`range ${a}-${b} in ${field.key} has a > b`)
        for (let v = lo; v <= hi; v += step) values.add(v)
      } else {
        const lo = parseValue(rangePart, field, raw)
        const hi = field.max
        for (let v = lo; v <= hi; v += step) values.add(v)
      }
    } else {
      if (rangePart === '*') {
        for (let v = field.min; v <= field.max; v++) values.add(v)
      } else if (rangePart.includes('-')) {
        const [a, b] = rangePart.split('-')
        if (a === '' || b === '') throw new Error(`invalid range in ${field.key}`)
        const lo = parseValue(a, field, raw)
        const hi = parseValue(b, field, raw)
        if (lo > hi) throw new Error(`range ${a}-${b} in ${field.key} has a > b`)
        for (let v = lo; v <= hi; v++) values.add(v)
      } else {
        values.add(parseValue(rangePart, field, raw))
      }
    }
  }
  if (values.size === 0) throw new Error(`no values in ${field.key}`)
  return { isStar, values }
}

function parseExpr(expr) {
  const parts = expr.trim().split(/\s+/)
  if (parts.length !== 5) throw new Error(`expected 5 fields, got ${parts.length}`)
  const parsed = []
  for (let i = 0; i < 5; i++) {
    if (parts[i] === '') throw new Error(`empty ${FIELDS[i].key} field`)
    parsed.push(parseField(parts[i], FIELDS[i]))
  }
  return parsed
}

function pad2(n) {
  return String(n).padStart(2, '0')
}

function dayName(v) {
  return DAY_NAMES[v === 7 ? 0 : v]
}

function dayPhrase(dowRaw, dow, domRaw, monthRaw, month) {
  if (domRaw === '*' && monthRaw === '*' && dowRaw === '*') return 'every day'
  if (dowRaw !== '*' && domRaw === '*' && monthRaw === '*') {
    const vals = [...dow.values].sort((a, b) => a - b)
    if (vals.length === 1) return `on ${dayName(vals[0])}`
    let isRange = true
    for (let i = 1; i < vals.length; i++) {
      if (vals[i] !== vals[i - 1] + 1) { isRange = false; break }
    }
    if (isRange) return `on ${dayName(vals[0])} to ${dayName(vals[vals.length - 1])}`
    const names = vals.map((v) => dayName(v))
    return `on ${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`
  }
  if (domRaw !== '*' && monthRaw === '*') return `on day ${domRaw} of every month`
  if (domRaw !== '*' && monthRaw !== '*') return `on day ${domRaw} of ${MONTH_NAMES[month.values.size === 1 ? [...month.values][0] - 1 : 0]}`
  return null
}

export function explainCron(expr) {
  let parsed
  try {
    parsed = parseExpr(expr)
  } catch (e) {
    return { ok: false, error: e.message }
  }
  const [minute, hour, dom, month, dow] = parsed
  const raw = expr.trim().split(/\s+/)
  const [minuteRaw, hourRaw, domRaw, monthRaw, dowRaw] = raw

  if (minuteRaw === '*' && hourRaw === '*' && domRaw === '*' && monthRaw === '*' && dowRaw === '*') {
    return { ok: true, summary: 'Every minute' }
  }
  if (/^\*\/\d+$/.test(minuteRaw) && hourRaw === '*' && domRaw === '*' && monthRaw === '*' && dowRaw === '*') {
    return { ok: true, summary: `Every ${minuteRaw.slice(2)} minutes` }
  }
  if (minute.values.size === 1 && hour.values.size === 1) {
    const m = [...minute.values][0]
    const h = [...hour.values][0]
    const phrase = dayPhrase(dowRaw, dow, domRaw, monthRaw, month)
    if (phrase) {
      return { ok: true, summary: `At ${pad2(h)}:${pad2(m)} ${phrase}` }
    }
  }
  const parts = [
    `At minute ${minuteRaw}`,
    `hour ${hourRaw}`,
    domRaw === '*' ? 'every day-of-month' : `day-of-month ${domRaw}`,
    monthRaw === '*' ? 'every month' : `month ${monthRaw}`,
    dowRaw === '*' ? 'every day-of-week' : `day-of-week ${dowRaw}`,
  ]
  return { ok: true, summary: parts.join(', ') }
}

function dayMatchesUTC(date, dom, month, dow) {
  if (!month.values.has(date.getUTCMonth() + 1)) return false
  const domOk = dom.values.has(date.getUTCDate())
  const jsDay = date.getUTCDay()
  const dowOk = jsDay === 0
    ? (dow.values.has(0) || dow.values.has(7))
    : dow.values.has(jsDay)
  const domRestricted = !dom.isStar
  const dowRestricted = !dow.isStar
  if (domRestricted && dowRestricted) return domOk || dowOk
  return domOk && dowOk
}

export function nextRuns(expr, from, count = 5) {
  let parsed
  try {
    parsed = parseExpr(expr)
  } catch (e) {
    return { ok: false, error: e.message }
  }
  const [minute, hour, dom, month, dow] = parsed
  const startMs = from instanceof Date ? from.getTime() : from
  const start = new Date(startMs)
  start.setUTCSeconds(0, 0)
  start.setUTCMinutes(start.getUTCMinutes() + 1)

  const runs = []
  const limit = start.getTime() + 8 * 365 * 24 * 60 * 60 * 1000

  const cursor = new Date(start.getTime())
  while (runs.length < count && cursor.getTime() <= limit) {
    if (dayMatchesUTC(cursor, dom, month, dow)) {
      outer: for (let h = 0; h < 24; h++) {
        if (!hour.values.has(h)) continue
        for (let m = 0; m < 60; m++) {
          if (!minute.values.has(m)) continue
          const t = Date.UTC(cursor.getUTCFullYear(), cursor.getUTCMonth(), cursor.getUTCDate(), h, m)
          if (t <= start.getTime()) continue
          if (t > limit) break outer
          runs.push(new Date(t).toISOString())
          if (runs.length >= count) break outer
        }
      }
    }
    cursor.setUTCDate(cursor.getUTCDate() + 1)
  }
  return { ok: true, runs }
}
