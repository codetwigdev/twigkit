# Line Tools

**Exports (`logic.js`):**
`processLines(text, { sort = 'none', dedupe = false, trim = false, removeEmpty = false, reverse = false, ignoreCase = false } = {})`
returns `{ ok: true, output, before, after }`.

Steps, in this order:
1. Split on `/\r?\n/`. Empty text is zero lines (not one empty line). `before` is the
   number of lines at this point.
2. If `trim`, trim each line.
3. If `removeEmpty`, drop lines that are empty (after trimming, if trim is on).
4. If `dedupe`, drop repeated lines, keeping the first occurrence. Compare lowercased
   lines when `ignoreCase` is true.
5. Sort by `sort`: `'none'` (keep order), `'asc'`, `'desc'`, `'length'` (shortest first,
   ties alphabetical). Compare by plain code-unit order (`a < b`), not `localeCompare`;
   when `ignoreCase` is true compare lowercased lines and keep the original order for
   ties (the sort is stable).
6. If `reverse`, reverse the result.
7. `output` is the lines joined with `\n`; `after` is the number of resulting lines.

**UI:** a textarea "Lines"; a select "Sort" (None, A to Z, Z to A, By length); checkboxes
"Remove duplicates", "Trim whitespace", "Remove empty lines", "Reverse order", "Ignore
case" in a `.row`; then a `.muted` line like `12 lines to 9 lines` and an `Output`.
