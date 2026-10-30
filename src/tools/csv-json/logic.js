// Pure logic only: no React, no DOM.

// Parse RFC 4180 style CSV into rows of string cells.
function parseCsv(text, delimiter) {
  const rows = []
  let row = []
  let field = ''
  let inQuotes = false
  let i = 0
  const len = text.length

  while (i < len) {
    const ch = text[i]
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"'
          i += 2
          continue
        }
        inQuotes = false
        i += 1
        continue
      }
      field += ch
      i += 1
      continue
    }
    if (ch === '"') {
      inQuotes = true
      i += 1
      continue
    }
    if (ch === delimiter) {
      row.push(field)
      field = ''
      i += 1
      continue
    }
    if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && text[i + 1] === '\n') {
        i += 2
      } else {
        i += 1
      }
      row.push(field)
      field = ''
      rows.push(row)
      row = []
      continue
    }
    field += ch
    i += 1
  }
  // trailing field/row after last delimiter or newline
  if (field !== '' || row.length > 0) {
    row.push(field)
    rows.push(row)
  }
  return rows
}

export function csvToJson(text, { delimiter = ',', header = true } = {}) {
  if (text.trim() === '') {
    return { ok: false, error: 'Input is empty' }
  }

  // detect unterminated quote
  let inQuotes = false
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    if (ch === '"') {
      if (inQuotes) {
        if (text[i + 1] === '"') {
          i += 1
        } else {
          inQuotes = false
        }
      } else {
        inQuotes = true
      }
    }
  }
  if (inQuotes) {
    return { ok: false, error: 'Unterminated quote in CSV' }
  }

  const rows = parseCsv(text, delimiter)

  if (header) {
    if (rows.length === 0) {
      return { ok: false, error: 'Input is empty' }
    }
    const keys = rows[0]
    const out = rows.slice(1).map((r) => {
      const obj = {}
      keys.forEach((k, idx) => {
        obj[k] = r[idx] !== undefined ? r[idx] : ''
      })
      return obj
    })
    return { ok: true, output: JSON.stringify(out, null, 2) }
  }

  return { ok: true, output: JSON.stringify(rows, null, 2) }
}

function csvCell(value, delimiter) {
  let s
  if (value === null || value === undefined) {
    s = ''
  } else if (typeof value === 'object') {
    s = JSON.stringify(value)
  } else {
    s = String(value)
  }
  if (
    s.includes(delimiter) ||
    s.includes('"') ||
    s.includes('\n') ||
    s.includes('\r')
  ) {
    s = '"' + s.replace(/"/g, '""') + '"'
  }
  return s
}

export function jsonToCsv(text, { delimiter = ',' } = {}) {
  if (text.trim() === '') {
    return { ok: false, error: 'Input is empty' }
  }
  let data
  try {
    data = JSON.parse(text)
  } catch {
    return { ok: false, error: 'Invalid JSON' }
  }
  if (!Array.isArray(data)) {
    return { ok: false, error: 'Input must be a JSON array' }
  }

  // array of arrays: write as-is, no header
  if (data.length > 0 && Array.isArray(data[0])) {
    const lines = data.map((row) =>
      row.map((v) => csvCell(v, delimiter)).join(delimiter)
    )
    return { ok: true, output: lines.join('\n') }
  }

  // array of objects: union of keys in first-seen order
  const keys = []
  for (const obj of data) {
    for (const k of Object.keys(obj)) {
      if (!keys.includes(k)) keys.push(k)
    }
  }
  const lines = [keys.join(delimiter)]
  for (const obj of data) {
    lines.push(keys.map((k) => csvCell(obj[k], delimiter)).join(delimiter))
  }
  return { ok: true, output: lines.join('\n') }
}
