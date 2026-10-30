# Timestamp

**Exports (`logic.js`):**
- `fromUnix(value, unit = 'auto')` where `value` is a number or numeric string and
  `unit` is `'auto' | 'seconds' | 'milliseconds'`. Returns
  `{ ok: true, unit, iso, utc }` (`unit` is the unit actually used; `iso` is
  `Date#toISOString()`, `utc` is `Date#toUTCString()`) or `{ ok: false, error }`.
  Auto-detect: absolute value >= 1e11 means milliseconds, otherwise seconds.
  Trim string input. Empty, non-numeric or out-of-range input is an error.
- `toUnix(text)` parses any string `Date.parse` accepts. Returns
  `{ ok: true, seconds, milliseconds }` (seconds is `Math.floor(ms / 1000)`) or
  `{ ok: false, error }`. Empty input is an error.

**UI:** two sections side by side (`grid-2`).
1. "Unix to date": text input, unit select (Auto, Seconds, Milliseconds), and an
   `Output` showing ISO and UTC lines plus the viewer's local time
   (`toLocaleString()`, computed in the component, not in `logic.js`). Include a
   "Now" button that fills the input with the current Unix seconds.
2. "Date to Unix": text input (placeholder `2023-11-14T22:13:20Z`) and an `Output`
   showing seconds and milliseconds.
