# Hash Generator

**Exports (`logic.js`):**
- `ALGORITHMS`: `['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512']`.
- `hashText(text, algorithm = 'SHA-256')`: **async**, returns
  `{ ok: true, output }` (lowercase hex) or `{ ok: false, error }`.
  Use `crypto.subtle.digest(algorithm, new TextEncoder().encode(text))` and convert the
  bytes to hex. An algorithm not in `ALGORITHMS` is an error (do not call `digest`).

**UI:** a textarea "Text", a checkbox "Uppercase" (display only: uppercase the hex in the
component), and one labelled row per algorithm (label = the algorithm name, value in an
`Output`). The hashes are computed asynchronously: use an effect keyed on the text that
calls `hashText` for all four algorithms with `Promise.all`, stores the results in state,
and ignores stale results with a cancelled flag in the effect cleanup (this is the one
place an effect is right). When the textarea is empty show the four rows with empty
outputs. Under the rows, a `.muted` note: `Hashing happens in your browser with the Web Crypto API. A fast hash is not a safe way to store passwords.`
