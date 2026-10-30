# Text Diff

**Exports (`logic.js`):**
- `diffLines(a, b)` returns an array of `{ type: 'same' | 'add' | 'remove', text }`.
  Split on `/\r?\n/`. An empty string means zero lines (not one empty line).
  Use an LCS (longest common subsequence) table. Where lines differ, emit all
  `remove` entries before the `add` entries of the same change (see the tests).
- `diffStats(diff)` returns `{ added, removed, same }` counts.

**UI:** two textareas side by side (`grid-2`), labelled "Original" and "Changed".
Below, the diff: one `div.diff-line` per entry, with an extra class `diff-add` or
`diff-remove` for those types, and a leading marker character (`+ `, `- `, two
spaces for same). Above the diff show a one-line summary like
"2 added, 1 removed". If both inputs are empty show nothing. If there are no
changes (and input is not empty) show "No differences".
