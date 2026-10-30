export function fromUnix(value, unit = 'auto') {
  const trimmed = typeof value === 'string' ? value.trim() : value
  if (trimmed === '' || trimmed === null || trimmed === undefined) {
    return { ok: false, error: 'Input is required' }
  }

  const num = typeof trimmed === 'number' ? trimmed : Number(trimmed)
  if (!Number.isFinite(num)) {
    return { ok: false, error: 'Input must be a number' }
  }

  let resolvedUnit = unit
  if (unit === 'auto') {
    resolvedUnit = Math.abs(num) >= 1e11 ? 'milliseconds' : 'seconds'
  }

  const ms = resolvedUnit === 'milliseconds' ? num : num * 1000
  const date = new Date(ms)
  if (isNaN(date.getTime())) {
    return { ok: false, error: 'Input is out of range' }
  }

  return {
    ok: true,
    unit: resolvedUnit,
    iso: date.toISOString(),
    utc: date.toUTCString(),
  }
}

export function toUnix(text) {
  if (!text || !text.trim()) {
    return { ok: false, error: 'Input is required' }
  }

  const ms = Date.parse(text)
  if (isNaN(ms)) {
    return { ok: false, error: 'Invalid date' }
  }

  return {
    ok: true,
    seconds: Math.floor(ms / 1000),
    milliseconds: ms,
  }
}
