# Regex Tester

**Exports (`logic.js`):** `testRegex(pattern, flags, text)` returns
`{ ok: true, matches, truncated }` or `{ ok: false, error }`.

- Each match is `{ index, match, groups, named }`: `groups` is the array of numbered
  capture values (without the full match), `named` is an object of named groups
  (empty object when none).
- Build the regex with `new RegExp(pattern, flags)`; invalid pattern or flags is an
  error (use the engine's message). Empty pattern is an error.
- Without the `g` flag return at most one match. With `g`, use `matchAll`
  (which advances past empty matches), and stop at 1000 matches, setting
  `truncated: true` if more existed.
- Capture groups that did not participate are `undefined` in JS; convert them to
  empty strings in `groups` and `named`.

**UI:** a pattern input and a flags input (default `g`) on one row; a textarea
"Test text"; below it the text rendered with each match wrapped in `<mark>`
(build React nodes from the match indexes; skip zero-length matches when
highlighting; never use `dangerouslySetInnerHTML`); then a list of matches showing
index, match and groups. Show "N matches" and a note if truncated. Show the error
message for an invalid regex.
