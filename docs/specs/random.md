# UUID / Random

**Exports (`logic.js`):**
- `uuidV4()` returns a string. Use `crypto.randomUUID()` (available in browsers and
  in the test environment).
- `randomString({ length = 16, upper = true, lower = true, digits = true, symbols = false } = {})`
  returns `{ ok: true, output }` or `{ ok: false, error }`.
  Errors: length not an integer in 1..1024; no character set selected.
  Use `crypto.getRandomValues` (not `Math.random`) and avoid modulo bias by
  rejecting values above the largest multiple of the charset length.
  Symbols charset: `!@#$%^&*()-_=+[]{};:,.?`

**UI:** two sections.
1. "UUID v4": a "Generate" button and a count select (1, 5, 10); show the UUIDs
   one per line in an `Output`. Generate on first render and on each click
   (keep the generated values in state; do not regenerate on every re-render).
2. "Random string": number input for length, four checkboxes (A-Z, a-z, 0-9,
   symbols), "Generate" button, result in `Output` (or the error).
