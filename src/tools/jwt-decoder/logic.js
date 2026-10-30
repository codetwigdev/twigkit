function base64UrlToBytes(b64url) {
  let b64 = b64url.replace(/-/g, '+').replace(/_/g, '/')
  const pad = b64.length % 4
  if (pad) b64 += '='.repeat(4 - pad)
  return atob(b64)
}

function decodePart(part) {
  const binary = base64UrlToBytes(part)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  const decoder = new TextDecoder('utf-8', { fatal: true })
  const text = decoder.decode(bytes)
  return JSON.parse(text)
}

export function decodeJwt(token, now = Date.now()) {
  const trimmed = token.trim()
  if (!trimmed) return { ok: false, error: 'Token is empty' }

  const stripped = trimmed.replace(/^Bearer\s+/i, '')
  const parts = stripped.split('.')

  if (parts.length !== 3) {
    return { ok: false, error: 'Token must have exactly three parts' }
  }

  let header, payload
  try {
    header = decodePart(parts[0])
  } catch {
    return { ok: false, error: 'The header is not valid base64url JSON' }
  }

  try {
    payload = decodePart(parts[1])
  } catch {
    return { ok: false, error: 'The payload is not valid base64url JSON' }
  }

  const signature = parts[2]

  const iat = payload.iat
  const exp = payload.exp

  const issuedAt =
    iat !== undefined && Number.isFinite(iat) ? new Date(iat * 1000).toISOString() : null
  const expiresAt =
    exp !== undefined && Number.isFinite(exp) ? new Date(exp * 1000).toISOString() : null

  let expired = null
  if (exp !== undefined && Number.isFinite(exp)) {
    expired = now >= exp * 1000
  }

  return { ok: true, header, payload, signature, issuedAt, expiresAt, expired }
}
