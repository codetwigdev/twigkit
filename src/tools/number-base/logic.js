// Pure logic only: no React, no DOM.

const VALID_BASES = [2, 8, 10, 16]
const PREFIXES = { 16: '0x', 2: '0b', 8: '0o' }

// Convert a number string from one base (2, 8, 10 or 16) into all four bases.
// Returns { ok: true, bin, oct, dec, hex } or { ok: false, error }.
export function convertBase(input, fromBase) {
  if (!VALID_BASES.includes(fromBase)) {
    return { ok: false, error: `Unsupported base: ${fromBase}` }
  }

  const trimmed = input.trim()
  if (trimmed === '') {
    return { ok: false, error: 'Empty input' }
  }

  // Sign
  let negative = false
  let rest = trimmed
  if (rest[0] === '-') {
    negative = true
    rest = rest.slice(1)
  }

  // Prefix (case-insensitive)
  const prefix = PREFIXES[fromBase]
  if (prefix && rest.toLowerCase().startsWith(prefix)) {
    rest = rest.slice(prefix.length)
  }

  // Remove underscores and any remaining whitespace
  const digits = rest.replace(/[_\s]/g, '')
  if (digits === '') {
    return { ok: false, error: 'No digits after sign' }
  }

  // Validate and parse digit by digit into a BigInt
  let value = 0n
  for (const ch of digits) {
    const code = ch.charCodeAt(0)
    let digit
    if (code >= 48 && code <= 57) {
      digit = code - 48 // '0'-'9'
    } else if (fromBase === 16 && ((code >= 97 && code <= 102) || (code >= 65 && code <= 70))) {
      digit = (code & 31) + 9 // a-f / A-F
    } else {
      return { ok: false, error: `Invalid character '${ch}' for base ${fromBase}` }
    }
    if (digit >= fromBase) {
      return { ok: false, error: `Invalid character '${ch}' for base ${fromBase}` }
    }
    value = value * BigInt(fromBase) + BigInt(digit)
  }

  if (negative) value = -value

  return {
    ok: true,
    bin: value.toString(2),
    oct: value.toString(8),
    dec: value.toString(10),
    hex: value.toString(16),
  }
}
