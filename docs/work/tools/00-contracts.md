These packages each build one TwigKit tool: `logic.js` (pure functions) and `Tool.jsx`
(UI wiring). The rules for tools are in `docs/WORKER_GUIDE.md`, which is part of your shared
context; where it says to write files under `src/tools/<id>/`, use the exact paths in your
package. Output format: a line `File: <path>` followed by the complete file in one fenced
code block, for both files.

Components import the shared UI with relative paths from `src/tools/<id>/`:
`../../ui/Field.jsx`, `../../ui/Output.jsx`, `../../ui/CopyButton.jsx`. Style comes from
global class names that already exist (`.field`, `.row`, `.grid-2`, `.btn`, `.btn.primary`,
`.out`, `.error`, `.stat-grid`, `.stat`, `.muted`); do not add CSS files or inline styles.
