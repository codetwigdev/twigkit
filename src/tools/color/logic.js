// Pure logic only: no React, no DOM. Easy to test, easy for a worker to get right.

// Convert a color string (#hex, rgb(), hsl()) into all three formats.
// Returns { ok: true, hex, rgb, hsl } or { ok: false, error }.
export function convertColor(input) {
  const trimmed = String(input).trim()
  if (!trimmed) return { ok: false, error: 'Input is empty' }

  // Try hex first (with or without #, 3 or 6 digits)
  const hexMatch = trimmed.match(/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i)
  if (hexMatch) {
    let hexDigits = hexMatch[1]
    if (hexDigits.length === 3) {
      hexDigits = hexDigits[0] + hexDigits[0] + hexDigits[1] + hexDigits[1] + hexDigits[2] + hexDigits[2]
    }
    const r = parseInt(hexDigits.slice(0, 2), 16)
    const g = parseInt(hexDigits.slice(2, 4), 16)
    const b = parseInt(hexDigits.slice(4, 6), 16)
    return buildResult(r, g, b)
  }

  // Try rgb()
  const rgbMatch = trimmed.match(/^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i)
  if (rgbMatch) {
    const r = parseInt(rgbMatch[1], 10)
    const g = parseInt(rgbMatch[2], 10)
    const b = parseInt(rgbMatch[3], 10)
    if (r > 255 || g > 255 || b > 255) {
      return { ok: false, error: 'RGB values must be between 0 and 255' }
    }
    return buildResult(r, g, b)
  }

  // Try hsl()
  const hslMatch = trimmed.match(/^hsl\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*\)$/i)
  if (hslMatch) {
    const h = parseInt(hslMatch[1], 10)
    const s = parseInt(hslMatch[2], 10)
    const l = parseInt(hslMatch[3], 10)
    const { r, g, b } = hslToRgb(h, s, l)
    return buildResult(r, g, b)
  }

  return { ok: false, error: 'Unrecognized color format' }
}

function buildResult(r, g, b) {
  const hex = '#' + toHex(r) + toHex(g) + toHex(b)
  const rgb = `rgb(${r}, ${g}, ${b})`
  const hsl = rgbToHsl(r, g, b)
  return { ok: true, hex, rgb, hsl }
}

function toHex(n) {
  return n.toString(16).padStart(2, '0')
}

function rgbToHsl(r, g, b) {
  const rn = r / 255
  const gn = g / 255
  const bn = b / 255
  const max = Math.max(rn, gn, bn)
  const min = Math.min(rn, gn, bn)
  const delta = max - min

  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (delta !== 0) {
    s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min)
    if (max === rn) {
      h = ((gn - bn) / delta + (gn < bn ? 6 : 0)) / 6
    } else if (max === gn) {
      h = ((bn - rn) / delta + 2) / 6
    } else {
      h = ((rn - gn) / delta + 4) / 6
    }
  }

  const hDeg = Math.round(h * 360)
  const sPct = Math.round(s * 100)
  const lPct = Math.round(l * 100)

  return `hsl(${hDeg}, ${sPct}%, ${lPct}%)`
}

function hslToRgb(h, s, l) {
  const sn = s / 100
  const ln = l / 100

  const c = (1 - Math.abs(2 * ln - 1)) * sn
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = ln - c / 2

  let r = 0
  let g = 0
  let b = 0

  if (h < 60) {
    r = c
    g = x
    b = 0
  } else if (h < 120) {
    r = x
    g = c
    b = 0
  } else if (h < 180) {
    r = 0
    g = c
    b = x
  } else if (h < 240) {
    r = 0
    g = x
    b = c
  } else if (h < 300) {
    r = x
    g = 0
    b = c
  } else {
    r = c
    g = 0
    b = x
  }

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  }
}
