// Pure logic only: no React, no DOM.

export const ALGORITHMS = ['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512']

// Hash text with a Web Crypto algorithm. Returns { ok, output } (lowercase hex)
// or { ok: false, error }.
export async function hashText(text, algorithm = 'SHA-256') {
  if (!ALGORITHMS.includes(algorithm)) {
    return { ok: false, error: `Unsupported algorithm: ${algorithm}` }
  }
  try {
    const bytes = await crypto.subtle.digest(algorithm, new TextEncoder().encode(text))
    return { ok: true, output: toHex(new Uint8Array(bytes)) }
  } catch (err) {
    return { ok: false, error: err.message }
  }
}

function toHex(uint8) {
  let hex = ''
  for (const b of uint8) {
    hex += b.toString(16).padStart(2, '0')
  }
  return hex
}
