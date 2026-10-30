# Base64 / URL

**Exports (`logic.js`):** `base64Encode`, `base64Decode`, `urlEncode`, `urlDecode`.
Each takes a string and returns `{ ok: true, output }` or `{ ok: false, error }`.

- Base64 must be UTF-8 safe: encode with `TextEncoder`, decode with `TextDecoder`
  (`btoa`/`atob` alone break on non-latin1).
- `base64Decode` trims whitespace, accepts the URL-safe alphabet (`-` and `_`),
  and accepts missing `=` padding. Invalid input returns an error; use
  `new TextDecoder('utf-8', { fatal: true })` so invalid UTF-8 is an error too.
- URL functions use `encodeURIComponent` / `decodeURIComponent`; a malformed
  sequence is an error.

**UI:** a mode select (Base64, URL), a textarea for input, two buttons "Encode"
(primary) and "Decode" that choose the action, and an `Output` for the result.
Output is derived during render from input + mode + action.
