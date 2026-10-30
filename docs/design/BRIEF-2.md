# Design brief 2: articles, categories, and growing from 9 to 17 tools

From: project manager. To: lead designer. This extends the shipped "Field notes" design
(`docs/design/DESIGN.md`, `docs/design/work/`). Keep its look, tokens and constraints
(read `BRIEF.md` for the hard constraints; they all still apply: React 19, plain CSS, no
new dependencies, no external requests, system fonts, WCAG AA, light and dark, 375px up).

## What changed

1. **17 tools, not 9.** Eight new ones are scaffolded in `src/tools/`: `jwt-decoder`,
   `hash`, `csv-json`, `cron`, `number-base`, `url-parser`, `line-tools`, `html-entities`.
   Read each `index.js` for name, description and icon glyph. The tool components are
   written by the workers later and reuse the same shared classes as before, so
   `blocks.css` should already cover them; check whether any new building block is
   needed (for example a key/value table for URL parts, a monospace multi-line list for
   cron run times) and specify it.
2. **Categories.** A flat list of 17 will not scale in the workspace rail or on Home.
   Define 4 to 6 categories and give a mapping table for all 17 tools (put it in
   `00-contracts.md`). The PM will add a `category` string to every tool's `index.js`;
   the registry item becomes `{ id, name, description, icon, category, component }`.
   Redesign the rail (grouped, with headings, still compact and fast) and Home (a
   category filter or grouping that fits the "contents page of a notebook" idea and keeps
   the jump box). The index numbers (`No. 03`) must stay meaningful with 17 entries:
   decide whether they stay global or restart per category, and be consistent.
3. **Articles.** A new section, in the same voice as the rest of the site (calm, precise,
   practical). New routes, in the hash router: `#/articles` (index) and
   `#/articles/<slug>` (reader). Add `Articles` to the site header nav, a teaser on Home
   ("From the notebook": the three most recent articles), and a link from a tool page to
   its related article if one exists (and back). Design the index page and the reading
   page properly: a long-form reading experience is the point (measure, leading, heading
   rhythm, code blocks with a copy button, block quotes, callouts, lists, a tag row, date
   and reading time, previous/next, "Try the tool" call to action at the end).
4. **No stale numbers.** Home and About currently contain hard-coded counts ("Nine small
   tools", "8 tools built by workers", "89 tests"). Replace them: derive counts from the
   registry (the architect built the Slugify reference tool; the rest are built by
   workers, so workers built `tools.length - 1`), and avoid any number that goes stale
   (such as the test count or timings) unless it can be computed. Update About so the
   story also covers the second build (the redesign, then this expansion: new tools and
   articles built the same way).

## Article data contract (you may refine the block types; keep it simple)

Each article is a module `src/articles/<slug>.js` with a default export:

```js
export default {
  slug: 'base64-is-not-encryption',   // equals the file name
  title: 'Base64 is not encryption',
  summary: 'One sentence for the index card.',
  date: '2026-10-30',                 // ISO date
  tags: ['encoding', 'security'],
  tool: 'encode-decode',              // optional: id of a related tool
  blocks: [
    { type: 'p', text: 'Plain paragraph with `inline code`, **bold**, *italic* and [a link](https://example.com or #/tool-id).' },
    { type: 'h2', text: 'A heading' },
    { type: 'h3', text: 'A smaller heading' },
    { type: 'ul', items: ['one', 'two'] },
    { type: 'ol', items: ['first', 'second'] },
    { type: 'code', lang: 'js', text: 'const x = 1' },
    { type: 'quote', text: 'A quotation.', cite: 'Someone' },
    { type: 'callout', title: 'Note', text: 'A short aside.' },
  ],
}
```

Articles are written by the workers as data only; a renderer turns blocks into React
elements. **Never** `dangerouslySetInnerHTML`. Specify the tiny inline parser for
`` `code` ``, `**bold**`, `*italic*` and `[label](href)` exactly (it must be safe: only
`http:`, `https:`, `mailto:` and `#/` hrefs; anything else renders as plain text). The
reading time is computed from the word count (200 words per minute, minimum 1).
`src/articles/registry.js` collects articles with `import.meta.glob('./*.js', { eager:
true })` (excluding itself and helper files; say how), sorted by `date` descending, then
`title`.

## Articles that will exist (design for real content)

| Slug | Title | Summary | Tool |
| --- | --- | --- | --- |
| `base64-is-not-encryption` | Base64 is not encryption | What Base64 is for, why it makes data bigger, and why it keeps leaking into "security". | `encode-decode` |
| `reading-a-jwt-without-panic` | Reading a JWT without panic | Three dot-separated parts, what each one holds, and what decoding does not prove. | `jwt-decoder` |
| `regular-expressions-one-idea-at-a-time` | Regular expressions, one idea at a time | Build a pattern from literals, classes, quantifiers and groups. | `regex-tester` |
| `unix-time-and-the-year-2038` | Unix time and the year 2038 | Seconds versus milliseconds, time zones, and the 32-bit cliff. | `timestamp` |
| `cron-in-plain-english` | Cron in plain English | The five fields, the three traps, and how to read any schedule. | `cron` |
| `hashes-are-not-passwords` | Hashes are not passwords | What SHA-256 is good for, and why storing passwords needs something slower. | `hash` |
| `an-architect-and-a-team-of-workers` | An architect and a team of workers | How TwigKit is built: a strong model designs, a local model types, tests decide. | none |
| `tests-are-the-spec` | Tests are the spec | Why the tests, not the prompt, are what made the worker model reliable. | none |

Articles are 600 to 1,000 words, with 4 to 8 headings, a few code blocks, and one callout.

## Deliverables

Same rules as brief 1, with one important difference: **the work packages are the baseline
every time they are run, so update them in place.** Specifically:

1. Update `docs/design/DESIGN.md` (v1.1) and `docs/design/work/00-contracts.md`.
2. **Update the existing packages `01` to `07` in full** wherever this change touches the
   files they own (routing, header nav, rail, Home, About, tests, blocks, tokens), and
   say so at the top of each changed package in one line. A package you do not change
   stays as it is.
3. Add new packages for the new files (articles registry, inline parser, renderer,
   index page, reader page, CSS, tests). Numbering continues from `08`. No two packages
   own the same file; each package stays under about 400 lines of output. There may be
   more than 8 packages in total; they run in parallel in batches.
4. Do **not** edit anything in `src/` (the PM edits tool `index.js` files and the shared
   tool-registry export), do not edit the briefs, and do not write the articles.

When finished, reply with a short summary: what you changed in the design, the full list
of packages with the files each owns, the category mapping, and anything you were unsure of.
