export function uuidV4() {
  return crypto.randomUUID()
}

export function randomString({ length = 16, upper = true, lower = true, digits = true, symbols = false } = {}) {
  if (!Number.isInteger(length) || length < 1 || length > 1024) {
    return { ok: false, error: 'Length must be an integer between 1 and 1024' }
  }

  let charset = ''
  if (upper) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  if (lower) charset += 'abcdefghijklmnopqrstuvwxyz'
  if (digits) charset += '0123456789'
  if (symbols) charset += '!@#$%^&*()-_=+[]{};:,.?'

  if (charset.length === 0) {
    return { ok: false, error: 'Select at least one character set' }
  }

  const charsetLength = charset.length
  const maxSafe = Math.floor(0x100000000 / charsetLength) * charsetLength
  const result = []

  while (result.length < length) {
    const buffer = new Uint32Array(length)
    crypto.getRandomValues(buffer)

    for (const value of buffer) {
      if (result.length >= length) break
      if (value < maxSafe) {
        result.push(charset[value % charsetLength])
      }
    }
  }

  return { ok: true, output: result.join('') }
}
