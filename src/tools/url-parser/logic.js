// Pure logic only: no React, no DOM. Easy to test, easy for a worker to get right.

// Parse a URL into its parts.
// "https://user:pw@example.com:8080/a/b?x=1&y=two%20words#frag" -> { ok: true, ... }
export function parseUrl(text) {
  const trimmed = text.trim()
  if (!trimmed) return { ok: false, error: 'Enter a URL' }
  if (!/^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed)) {
    return { ok: false, error: 'Include a scheme such as https://' }
  }
  let url
  try {
    url = new URL(trimmed)
  } catch {
    return { ok: false, error: 'Could not parse that URL' }
  }
  const params = []
  for (const [key, value] of url.searchParams) {
    params.push({ key, value })
  }
  return {
    ok: true,
    protocol: url.protocol,
    username: url.username,
    password: url.password,
    hostname: url.hostname,
    port: url.port,
    origin: url.origin,
    pathname: url.pathname,
    search: url.search,
    hash: url.hash,
    params,
  }
}
