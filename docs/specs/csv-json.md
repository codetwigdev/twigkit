# CSV / JSON

**Exports (`logic.js`):**
- `csvToJson(text, { delimiter = ',', header = true } = {})` returns
  `{ ok: true, output }` (pretty JSON, 2 spaces) or `{ ok: false, error }`.
- `jsonToCsv(text, { delimiter = ',' } = {})` returns `{ ok: true, output }` or
  `{ ok: false, error }`.

**CSV parsing (write a small state-machine parser, no libraries):** RFC 4180 style.
Fields may be wrapped in double quotes; inside quotes the delimiter, `\n` and `\r\n` are
literal and `""` is one quote. Rows end at `\n` or `\r\n`; one trailing newline is ignored.
An unterminated quote is an error. Empty or whitespace-only input is an error. All values
stay strings (no number or boolean inference). With `header: true` the first row gives
the keys and each later row becomes an object; missing cells become `''`, extra cells are
dropped. With `header: false` the output is an array of arrays.

**JSON to CSV:** input must parse as a JSON array (otherwise an error; invalid JSON and
empty input are errors too). Array of objects: columns are the union of keys in first-seen
order, header row first. Array of arrays: written as-is without a header. Cell rules:
`null`/`undefined` is empty; strings as-is; numbers and booleans via `String`; objects and
arrays via `JSON.stringify`. Quote a cell (wrap in `"`, double any `"`) if it contains the
delimiter, a double quote, `\n` or `\r`. Rows are joined with `\n`, no trailing newline.

**UI:** a mode select ("CSV to JSON", "JSON to CSV"), a delimiter select (Comma `,`,
Semicolon `;`, Tab, Pipe `|`), a checkbox "First row is a header" (shown only in CSV to
JSON mode), a textarea "Input" and an `Output`. Derive the output during render. Show the
error only when the input is not empty.
