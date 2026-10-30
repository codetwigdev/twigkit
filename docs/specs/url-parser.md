# URL Parser

**Exports (`logic.js`):** `parseUrl(text)` returns
`{ ok: true, protocol, username, password, hostname, port, origin, pathname, search, hash, params }`
or `{ ok: false, error }`. Return exactly these keys.

- Trim the input. Empty input is an error.
- A scheme is required: the text must match `/^[a-z][a-z0-9+.-]*:\/\//i`, otherwise return
  the error `Include a scheme such as https://`.
- Then use `new URL(text)`; if it throws, return an error with a short message.
- Parts come straight from the `URL` object (`protocol` keeps its colon, `search` its `?`,
  `hash` its `#`; missing parts are empty strings; `port` is `''` when it is the default).
- `params` is an array of `{ key, value }` from `url.searchParams` in order, duplicates
  kept, values percent-decoded.

**UI:** a text input "URL" (monospace, placeholder `https://example.com/path?x=1#top`) and,
when valid, a list of labelled rows (Protocol, Host name, Port, Path, Query, Fragment,
Origin, plus User and Password only if they are non-empty), each an `Output`. Under them
a "Query parameters" section: when there are none a `.muted` line `No query parameters`,
otherwise one `Output` per parameter showing `key = value` in a single line. Show the
error only when the input is not empty.
