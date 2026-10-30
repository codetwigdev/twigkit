# Worker guide

You are implementing one small tool for TwigKit, a React + Vite app of browser-only
developer utilities. An architect has already written the app shell, the shared UI,
the tests and a spec. Your job is the implementation.

## What you write

Exactly two files, both inside `src/tools/<id>/`:

1. `logic.js` - pure JavaScript functions. No React, no DOM access, no imports
   from outside this folder. Export exactly the functions named in the spec.
2. `Tool.jsx` - a React component (`export default function Tool()`, no props)
   that holds state and wires inputs to the functions in `logic.js`.

Do not edit tests, `index.js`, or anything outside your folder.

## Rules

- `logic.js` must satisfy `logic.test.js` exactly. Read the tests first; they are
  the source of truth for return shapes and edge cases.
- Functions that can fail return a Result: `{ ok: true, ...fields }` or
  `{ ok: false, error: 'human readable message' }`. They never throw (unless the
  spec says so).
- No new npm dependencies. Browser built-ins and plain JS only.
- Compute results during render from state (no `useEffect` just to derive a value).
- Use the shared UI in `src/ui/` (`Field`, `Output`, `CopyButton`) and the global
  CSS classes in `src/index.css` (`.row`, `.grid-2`, `.btn`, `.field`, `.out`,
  `.error`, `.stat-grid`, `.stat`, `.muted`). Do not write new CSS files or inline
  style blocks except for tiny dynamic values (e.g. a color swatch background).
- Empty input is the normal starting state, not a mistake. When the main input is
  empty, do not show an error: render an empty `Output` (or nothing). Only show
  `error` once the user has typed something. (`logic.js` may still return an error
  for empty input; the component decides not to display it.)
- Checkboxes go directly in a `.row` as `<label><input type="checkbox" .../> Text</label>`.
  Do not give them the `field` class.
- Every form control needs a visible label (use `Field`, or wrap in `<label>`).
- Keep it short and readable. Match the style of the reference tool `slugify`:
  no semicolons, single quotes, 2-space indent.

## Output format

Reply with a summary of at most 5 lines, then the two files, each in this exact form
(the path is the full path from the repo root):

File: src/tools/<id>/logic.js
```js
// full file contents
```

File: src/tools/<id>/Tool.jsx
```jsx
// full file contents
```

Always return complete files, never fragments or diffs.
