# Color Converter

**Exports (`logic.js`):** `convertColor(input)` returns
`{ ok: true, hex, rgb, hsl }` (all strings) or `{ ok: false, error }`.

- Accepts `#rgb`, `#rrggbb` (with or without `#`, any case), `rgb(r, g, b)` and
  `hsl(h, s%, l%)`. Trim whitespace. Anything else is an error.
- rgb channels must be integers 0-255, otherwise error.
- Output formats exactly: hex lowercase `#ff8000`; `rgb(255, 128, 0)`;
  `hsl(30, 100%, 50%)` with h, s, l rounded to integers.
- Converting hsl to rgb: round each channel with `Math.round`.

**UI:** one text input ("Color", placeholder `#ff8000`), a native
`<input type="color">` that stays in sync (set the text input from it), a `swatch`
div whose background is the parsed hex, and three rows (HEX, RGB, HSL) each shown
with `Output`. Show the error message when the input is invalid, and no swatch.
Start with a sensible default color so the page is not empty.
