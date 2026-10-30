// Pure logic only: no React, no DOM. Easy to test, easy for a worker to get right.

// Base64 encode a string, UTF-8 safe.
export function base64Encode(input) {
  const bytes = new TextEncoder().encode(input)
  let binary = ''
  for (const byte of bytes) {
    binary += String.fromCharCode(byte)
  }
  return { ok: true, output: btoa(binary) }
}

// Base64 decode a string, UTF-8 safe.
// Accepts URL-safe alphabet and missing padding.
export function base64Decode(input) {
  const trimmed = input.trim()
  if (trimmed === '') {
    return { ok: true, output: '' }
  }

  // Convert URL-safe alphabet to standard base64
  const standard = trimmed.replace(/-/g, '+').replace(/_/g, '/')

  // Validate base64 characters
  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(standard)) {
    return { ok: false, error: 'Invalid base64 input' }
  }

  // Add missing padding
  const padded = standard + '='.repeat((4 - (standard.length % 4)) % 4)

  try {
    const binary = atob(padded)
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i)
    }
    const text = new TextDecoder('utf-8', { fatal: true }).decode(bytes)
    return { ok: true, output: text }
  } catch {
    return { ok: false, error: 'Invalid base64 input' }
  }
}

// URL encode a string using encodeURIComponent.
export function urlEncode(input) {
  return { ok: true, output: encodeURIComponent(input) }
}

// URL decode a string using decodeURIComponent.
export function urlDecode(input) {
  try {
    return { ok: true, output: decodeURIComponent(input) }
  } catch {
    return { ok: false, error: 'Invalid URL encoding' }
  }
}
