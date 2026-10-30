---
files:
  - src/styles/blocks.css
---

# 02 — Shared tool building blocks

> Changed in v1.1: adds `table.kv`, `.list-mono`, `.field > .out` and `ol` rules at the
> end of the file; everything before "new in v1.1" is unchanged from v1.

You own one file, `src/styles/blocks.css`, which styles every element the seventeen tool
components render. **You may not edit any tool component**; everything is done through
these class names and bare element selectors. The tools live under `src/tools/*/Tool.jsx`;
read two of them (`color`, `random`) to see the markup, but change nothing there.

Context: tools render inside `<div class="tool-body">` (another package provides it).
The page is warm paper; inputs are lighter "panel" boxes with a hairline border; results
(`.out`) sit in a darker "well". Labels are tiny uppercase monospace. One accent colour
("moss") is used for focus, primary buttons, selected states and additions.

Tokens you can use (defined by another package in `src/styles/tokens.css`):
`--paper --panel --well --ink --ink-2 --muted --line --line-strong --moss --moss-ink
--moss-soft --on-moss --clay --clay-soft --marker --diff-add --diff-remove --chevron
--font-display --font-body --font-mono --r-1 (3px) --r-2 (6px) --t-fast (120ms)
--t-base (180ms) --ease-out`.

Markup facts you are styling against (do not change them):

- `Field` renders `<div class="field"><label>Text</label><input|textarea|select/></div>`.
- The random tool renders `<label class="field"><input type="checkbox"/> A-Z</label>`:
  a `.field` that IS a label and contains a checkbox. The JSON tool renders
  `<label><input type="checkbox"/> Sort keys</label>` directly inside `.row`.
- `.row` is a flex row that may contain `.field`s, buttons and labels.
- `Output` renders `<pre class="out" aria-label="Output">text<button class="btn" disabled?>Copy</button></pre>`.
  When the value is empty the button is `disabled`. The regex tool also renders
  `<div class="out">` with `<mark>` children and no button.
- `.error` is `<p class="error" role="alert">message</p>`.
- `.stat` is `<div class="stat"><span class="muted">Words</span><strong>12</strong></div>`
  (some tools use `<b>` instead of `<strong>`).
- `.diff-line` is a `div` with optional `.diff-add` / `.diff-remove`.
- `.swatch` is an empty `div` with an inline background colour.
- Two tools use bare `<h2>` as section headings; base styles already handle `h2`.
- Encode/decode buttons carry `aria-pressed="true|false"`.
- New tools may render a key/value table
  `<table class="kv"><tbody><tr><th scope="row">host</th><td>example.com</td></tr>…</tbody></table>`
  (URL parts, JWT claims), a monospace list `<ol class="list-mono"><li>2026-10-30 09:00</li>…</ol>`
  (cron run times), and several labelled outputs
  `<div class="field"><span class="label">SHA-256</span><pre class="out">…<button class="btn">Copy</button></pre></div>`.

## File: `src/styles/blocks.css`

Write exactly this file:

```css
/* ---------- layout helpers ---------- */
.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin: 0 0 16px;
  min-width: 0;
}
.field > label,
.field > .label {
  font: 500 11px/1 var(--font-mono);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--muted);
}
/* a .field that is a <label> wrapping a checkbox */
.field:has(> input[type='checkbox']) {
  flex-direction: row;
  align-items: center;
  gap: 8px;
  margin: 0;
  font-size: 14px;
  color: var(--ink);
  cursor: pointer;
}

.row {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 12px;
  margin: 0 0 16px;
}
.row > .field {
  flex: 1 1 200px;
  margin: 0;
}
.row > .field:has(> select) {
  flex: 0 1 220px;
}
.row > .field:has(> input[type='number']) {
  flex: 0 1 140px;
}
.row > .field:has(> input[type='color']) {
  flex: 0 0 auto;
}
.row > label,
.row > .field:has(> input[type='checkbox']) {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 38px;
  font-size: 14px;
  cursor: pointer;
}
.row .btn {
  flex: 0 0 auto;
}

.grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  align-items: start;
  margin: 0 0 16px;
}
.grid-2 > .field {
  margin: 0;
}
@media (max-width: 599px) {
  .grid-2 {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}

/* ---------- text controls ---------- */
textarea,
input[type='text'],
input[type='number'],
input[type='search'],
select {
  width: 100%;
  min-height: 38px;
  padding: 8px 10px;
  border: 1px solid var(--line);
  border-radius: var(--r-1);
  background: var(--panel);
  color: var(--ink);
  font: 14px/1.5 var(--font-mono);
  box-shadow: inset 0 1px 0 rgba(0, 0, 0, 0.02);
  transition: border-color var(--t-fast) var(--ease-out), box-shadow var(--t-fast) var(--ease-out);
}
textarea {
  min-height: 160px;
  resize: vertical;
  line-height: 1.5;
  tab-size: 2;
}
textarea::placeholder,
input::placeholder {
  color: var(--muted);
  opacity: 0.8;
}
textarea:hover,
input[type='text']:hover,
input[type='number']:hover,
input[type='search']:hover,
select:hover {
  border-color: var(--line-strong);
}
textarea:focus-visible,
input[type='text']:focus-visible,
input[type='number']:focus-visible,
input[type='search']:focus-visible,
select:focus-visible {
  outline: 2px solid var(--moss);
  outline-offset: 0;
  border-color: var(--moss);
}
textarea:disabled,
input:disabled,
select:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

select {
  appearance: none;
  -webkit-appearance: none;
  padding-right: 32px;
  background-image: var(--chevron);
  background-repeat: no-repeat;
  background-position: right 10px center;
  cursor: pointer;
}

input[type='number'] {
  font-variant-numeric: tabular-nums;
}

input[type='checkbox'] {
  width: 16px;
  height: 16px;
  margin: 0;
  accent-color: var(--moss);
  cursor: pointer;
}
input[type='checkbox']:focus-visible {
  outline: 2px solid var(--moss);
  outline-offset: 2px;
}

input[type='color'] {
  width: 48px;
  height: 38px;
  padding: 3px;
  border: 1px solid var(--line);
  border-radius: var(--r-1);
  background: var(--panel);
  cursor: pointer;
}
input[type='color']::-webkit-color-swatch-wrapper {
  padding: 0;
}
input[type='color']::-webkit-color-swatch {
  border: 0;
  border-radius: 2px;
}
input[type='color']::-moz-color-swatch {
  border: 0;
  border-radius: 2px;
}

/* ---------- buttons ---------- */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-height: 36px;
  padding: 6px 14px;
  border: 1px solid var(--line-strong);
  border-radius: var(--r-1);
  background: var(--panel);
  color: var(--ink);
  font: 500 14px/1.2 var(--font-body);
  cursor: pointer;
  user-select: none;
  transition: background-color var(--t-fast) var(--ease-out), border-color var(--t-fast) var(--ease-out), color var(--t-fast) var(--ease-out), transform var(--t-fast) var(--ease-out);
}
.btn:hover {
  border-color: var(--moss);
  color: var(--moss-ink);
  background: var(--moss-soft);
}
.btn:active {
  transform: translateY(1px);
}
.btn:focus-visible {
  outline: 2px solid var(--moss);
  outline-offset: 2px;
}
.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}
.btn:disabled:hover {
  border-color: var(--line-strong);
  color: var(--ink);
  background: var(--panel);
}
.btn[aria-pressed='true'] {
  background: var(--moss);
  border-color: var(--moss);
  color: var(--on-moss);
}
.btn[aria-pressed='true']:hover {
  background: var(--moss-ink);
  border-color: var(--moss-ink);
  color: var(--on-moss);
}
.btn.primary {
  background: var(--moss);
  border-color: var(--moss);
  color: var(--on-moss);
}
.btn.primary:hover {
  background: var(--moss-ink);
  border-color: var(--moss-ink);
  color: var(--on-moss);
}

/* ---------- output well ---------- */
.out {
  position: relative;
  margin: 0 0 16px;
  padding: 12px 14px;
  min-height: 48px;
  border: 1px solid var(--line);
  border-left: 3px solid var(--line-strong);
  border-radius: var(--r-2);
  background: var(--well);
  color: var(--ink);
  font: 14px/1.5 var(--font-mono);
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  tab-size: 2;
}
.out:has(> .btn) {
  padding-right: 92px;
}
.out .btn {
  position: absolute;
  top: 8px;
  right: 8px;
  min-height: 28px;
  padding: 3px 10px;
  font-size: 12px;
  background: var(--panel);
}
.out:has(> .btn:disabled)::before {
  content: 'Nothing here yet';
  color: var(--muted);
  font-style: italic;
}
.out:has(> .btn:not(:disabled)) {
  border-left-color: var(--moss);
}

/* ---------- messages ---------- */
.error {
  margin: 0 0 16px;
  padding: 10px 14px;
  border-left: 3px solid var(--clay);
  border-radius: var(--r-1);
  background: var(--clay-soft);
  color: var(--clay);
  font: 14px/1.5 var(--font-body);
}

/* ---------- stats ---------- */
.stat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px;
  margin: 0 0 16px;
}
.stat {
  display: flex;
  flex-direction: column-reverse;
  gap: 4px;
  padding: 12px 14px;
  border: 1px solid var(--line);
  border-radius: var(--r-2);
  background: var(--panel);
}
.stat .muted {
  font: 500 11px/1 var(--font-mono);
  letter-spacing: 0.12em;
  text-transform: uppercase;
}
.stat b,
.stat strong {
  display: block;
  font: 400 28px/1.1 var(--font-display);
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.01em;
  color: var(--ink);
}

/* ---------- diff ---------- */
.diff-line {
  padding: 2px 12px;
  border-left: 3px solid transparent;
  font: 13px/1.6 var(--font-mono);
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  color: var(--ink-2);
}
.diff-add {
  background: var(--diff-add);
  border-left-color: var(--moss);
  color: var(--ink);
}
.diff-remove {
  background: var(--diff-remove);
  border-left-color: var(--clay);
  color: var(--ink);
}

/* ---------- colour swatch ---------- */
.swatch {
  width: 100%;
  height: 64px;
  border: 1px solid var(--line);
  border-radius: var(--r-2);
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.05);
}

/* ---------- highlight ---------- */
mark {
  background: var(--marker);
  color: var(--ink);
  padding: 0 1px;
  border-radius: 2px;
  box-decoration-break: clone;
  -webkit-box-decoration-break: clone;
}

/* ---------- loose prose inside tools ---------- */
.tool-body p.muted {
  font-size: 13px;
  margin: 0 0 8px;
}
.tool-body ul {
  margin: 0 0 16px;
  padding-left: 20px;
  font: 13px/1.6 var(--font-mono);
  color: var(--ink-2);
}
.tool-body li {
  margin: 0 0 2px;
}
.tool-body > h2 {
  margin-top: 32px;
}
.tool-body > h2:first-child,
.tool-body > .grid-2 > div > h2:first-child {
  margin-top: 0;
}

/* ---------- new in v1.1 ---------- */

/* an output that sits inside a labelled field (hash digests, number bases) */
.field > .out {
  margin: 0;
}

/* ordered lists in tools read like the unordered ones */
.tool-body ol {
  margin: 0 0 16px;
  padding-left: 24px;
  font: 13px/1.6 var(--font-mono);
  color: var(--ink-2);
}

/* key / value table: URL parts, JWT claims, parsed fields */
table.kv {
  width: 100%;
  margin: 0 0 16px;
  border: 1px solid var(--line);
  border-radius: var(--r-2);
  border-spacing: 0;
  background: var(--well);
  font: 13px/1.5 var(--font-mono);
  overflow: hidden;
}
table.kv th,
table.kv td {
  padding: 7px 12px;
  vertical-align: top;
  text-align: left;
  border-top: 1px solid var(--line);
}
table.kv tr:first-child th,
table.kv tr:first-child td {
  border-top: 0;
}
table.kv th {
  width: 32%;
  font: 500 11px/1.6 var(--font-mono);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--muted);
  white-space: nowrap;
}
table.kv td {
  color: var(--ink);
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}
table.kv td:empty::before {
  content: '—';
  color: var(--muted);
}

/* monospace list in a well: cron run times, split lines, generated values */
.list-mono {
  margin: 0 0 16px;
  padding: 10px 14px 10px 40px;
  border: 1px solid var(--line);
  border-left: 3px solid var(--moss);
  border-radius: var(--r-2);
  background: var(--well);
  color: var(--ink);
  font: 13px/1.6 var(--font-mono);
  font-variant-numeric: tabular-nums;
}
.list-mono li {
  padding: 2px 0;
  overflow-wrap: anywhere;
}
.list-mono li::marker {
  color: var(--muted);
}
.list-mono:empty {
  display: none;
}

@media (max-width: 599px) {
  table.kv th {
    width: 38%;
    white-space: normal;
  }
}
```

## How to tell it is right

Open `#/json-formatter`, `#/color`, `#/random`, `#/text-diff`, `#/text-stats`:

- Labels ("JSON", "INDENT") are tiny uppercase monospace, grey.
- The textarea is a lighter box than the page with a 1px border; focusing it gives a
  2px green outline hugging the border.
- The select has a custom small chevron on the right and no native arrow.
- Buttons are 36px tall with a darker beige border; hovering tints them pale green with
  a green border; "Copy" inside the output is a small 28px version in the top right.
- The output box is slightly darker than the page with a 3px grey-beige left edge that
  turns green once there is a value; empty outputs read "Nothing here yet" in italic.
- In the Random tool, the checkboxes sit in one line with their text, green when checked.
- In the Color tool, the text input, colour picker and swatch line up; the swatch is 64px.
- In Text Stats, each number is a large serif numeral above a tiny uppercase label.
- In Text Diff, added lines are pale green with a green left edge, removed lines pale
  red-clay with a clay edge.
- An invalid JSON shows a pale clay box with clay text and a 3px clay left edge.
- Paste this into a scratch page or the console to check the new blocks: a
  `<table class="kv">` renders as a darker rounded panel with uppercase grey keys in a
  narrow left column and hairlines between rows; an `<ol class="list-mono">` is a darker
  panel with a 3px green left edge and grey numbers.
- Nothing under `src/tools/` or `src/ui/` was modified; `npm test` passes.
