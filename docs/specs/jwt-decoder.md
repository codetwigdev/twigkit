# JWT Decoder

**Exports (`logic.js`):** `decodeJwt(token, now = Date.now())` returns
`{ ok: true, header, payload, signature, issuedAt, expiresAt, expired }` or
`{ ok: false, error }`.

- Trim whitespace and strip a leading `Bearer ` (case-insensitive). Exactly three
  dot-separated parts, otherwise an error.
- `header` and `payload` are the parsed JSON objects. Parts are base64url: map `-` to
  `+` and `_` to `/`, add `=` padding, decode with `atob`, then UTF-8 decode with
  `TextDecoder` (use `fatal: true`), then `JSON.parse`. Any failure is an error
  (say which part, e.g. "The payload is not valid base64url JSON").
- `signature` is the third part, unchanged (a string). Do not verify it.
- `issuedAt` / `expiresAt` are ISO strings from the numeric `iat` / `exp` claims
  (seconds), or `null` when the claim is absent or not a finite number.
- `expired` is `true` when `now >= exp * 1000`, `false` when not, `null` without `exp`.
- Empty input is an error.

**UI:** a textarea "Token" and a small "Use an example" button that fills in the sample
token `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`.
When the token decodes: three labelled sections "Header", "Payload" (each an `Output`
with `JSON.stringify(value, null, 2)`) and "Signature" (an `Output` with the raw string).
Above them a status line: if `expired === true` show `Expired on <expiresAt>` in a
`.error` paragraph; if `false` show `Expires <expiresAt>` as `.muted`; if `iat` exists show
`Issued <issuedAt>` as `.muted`. Always show the `.muted` note
`Decoding does not verify the signature. Never trust a token you have not verified.`
Show the error only when the textarea is not empty.
