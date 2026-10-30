# HTML Entities

**Exports (`logic.js`):** `escapeHtml(text)` and `unescapeHtml(text)`, each returning
`{ ok: true, output }` (they cannot fail, but keep the Result shape).

- `escapeHtml` replaces `&` `<` `>` `"` `'` with `&amp;` `&lt;` `&gt;` `&quot;` `&#39;`
  in a single pass (so `&` is not double-escaped). Everything else is left alone.
- `unescapeHtml` decodes in a **single regex pass** (so `&amp;lt;` becomes `&lt;`, not `<`):
  the named entities `amp`, `lt`, `gt`, `quot`, `apos`, `nbsp` (to U+00A0), decimal
  `&#NNN;` and hex `&#xHHH;` (case-insensitive `x`) via `String.fromCodePoint`. Unknown
  names, code points above U+10FFFF, and a bare `&` are left exactly as written.
  Never use the DOM (`innerHTML`, `DOMParser`) to decode.

**UI:** a textarea "Text", two buttons "Escape" (primary) and "Unescape" that choose the
action (use `aria-pressed` on the active one), and an `Output`. Derive the output during
render. Start with Escape selected.
