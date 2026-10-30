# Number Base

**Exports (`logic.js`):** `convertBase(input, fromBase)` where `fromBase` is 2, 8, 10 or
16. Returns `{ ok: true, bin, oct, dec, hex }` (all strings, no prefixes, hex lowercase)
or `{ ok: false, error }`.

- Use `BigInt`, never `Number`, so values beyond 2^53 are exact.
- Trim the input; allow one leading `-`; ignore `_` separators; allow a prefix that
  matches the base (`0x`/`0X` for 16, `0b`/`0B` for 2, `0o`/`0O` for 8) after the sign.
- Digits must be valid for the base (case-insensitive for hex), otherwise an error that
  names the bad character. Empty input, a sign with no digits, or an unsupported base is
  an error.
- Negative numbers keep the `-` in every output (`-10` -> bin `-1010`, hex `-a`).
- Parse digit by digit into a `BigInt` (multiply by the base and add); do not build a
  `BigInt` from untrusted prefixed strings.

**UI:** a text input "Number", a select "Base" (Binary 2, Octal 8, Decimal 10,
Hexadecimal 16; default Decimal), and four labelled rows (Binary, Octal, Decimal,
Hexadecimal) each an `Output` with a Copy button. When the input is empty show the four
rows with empty outputs. Show the error only when the input is not empty.
