# JSON Formatter

**Exports (`logic.js`):** `formatJson(text, { indent = 2, sortKeys = false } = {})`,
`minifyJson(text)`. Both return `{ ok: true, output }` or `{ ok: false, error }`.

- Empty or whitespace-only input is an error ("Nothing to format").
- Parse errors: use the message from `JSON.parse`.
- `sortKeys` sorts object keys recursively (alphabetical). Arrays keep their order.
- `indent: 0` gives compact output.

**UI:** a textarea for input; an indent select (2 spaces or 4 spaces); a "Sort keys" checkbox; buttons "Format" (primary) and "Minify".
Show the result with `Output` (it handles the error display and the copy button).
Format/Minify buttons set which action is shown; output is derived during render.
