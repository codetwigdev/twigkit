# TwigKit design: "Field notes" — v1.1

v1.1 extends the shipped v1 design with categories (17 tools instead of 9), a grouped
rail and a grouped Home collection, an Articles section (index + reader), and a rule
that no count on the site is ever written by hand. Everything from v1 that is not
mentioned as changed stays exactly as it was.

## The concept

TwigKit is a sheet of good paper. Warm off-white, ink-black text, a single moss-green
accent, hairline rules instead of shadows, and a serif for anything that is a title: it
reads like a well-set field notebook rather than a dashboard. Every tool is a *specimen*:
a monospace glyph in a small square tile, an index number (`No. 06`), a serif name and one
plain sentence. The home page is the notebook's contents page, now with section headings;
the tool page is a single entry with a grouped, numbered index down the left; the About
page is the appendix that explains how the notebook was written; the Articles pages are
the notebook's own notes, set for reading. Dark mode is the same sheet after dark:
green-black paper, warm chalk-white ink, the same green. Nothing glows, nothing blurs,
nothing is purple. Motion is limited to short, one-property transitions (120–180 ms) and
is switched off under `prefers-reduced-motion`. System fonts only: a Palatino/Georgia-class
serif for display, the system sans for body, the system monospace for everything a
developer reads or types.

The implementation detail that makes this work on top of the untouched tool components:
inputs are *lighter* than the page (`--panel`), results are *darker* (`--well`) with a
3px left edge that turns green once there is a value, and labels are 11px uppercase
monospace with wide tracking. Those three moves give every tool the same quiet rhythm
without touching a line of tool code. The articles borrow the same three moves: code in
a well, callouts on `--moss-soft` with a green edge, labels in 11px mono.

Files: the exact, copy-pasteable CSS and JSX for every piece of this document are in the
work packages under `docs/design/work/`. This document is the design of record; where it
and a package disagree, this document wins and the package has a bug.

---

## 1. Tokens (unchanged from v1)

Complete custom-property block (light default, dark under system preference unless
`<html data-theme="light">`, and under `<html data-theme="dark">`). Lives in
`src/styles/tokens.css`.

```css
:root {
  color-scheme: light;
  --paper: #F5F2EA;      /* page background */
  --panel: #FDFBF6;      /* inputs, cards, buttons (lighter than page) */
  --well: #ECE8DC;       /* outputs, code, tiles (darker than page) */
  --ink: #1C1B17;        /* primary text */
  --ink-2: #4A4840;      /* secondary text, mono text */
  --muted: #625F55;      /* labels, captions (AA on paper, panel and well) */
  --line: #D8D2C4;       /* hairlines */
  --line-strong: #B4AD9C;/* button borders, scrollbar, output edge */
  --rule: rgba(28, 27, 23, 0.07); /* ruled-paper lines behind heroes */
  --moss: #35623A;       /* accent: focus, primary buttons, selected, additions */
  --moss-ink: #24472A;   /* accent as text / hover */
  --moss-soft: #DCE7D6;  /* accent tint backgrounds */
  --on-moss: #FFFFFF;    /* text on --moss */
  --clay: #A1402B;       /* errors, removals */
  --clay-soft: #F3DCD4;
  --marker: #F3E27A;     /* <mark> */
  --diff-add: #DCEBD2;
  --diff-remove: #F3D9D2;
  --selection: #CFE0C6;
  --chevron: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12' fill='none' stroke='%23625F55' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M2.5 4.5 6 8l3.5-3.5'/%3E%3C/svg%3E");
  --font-display: 'Iowan Old Style', 'Palatino Linotype', Palatino, 'Book Antiqua', Georgia, 'Times New Roman', serif;
  --font-body: system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  --font-mono: ui-monospace, 'Cascadia Mono', 'SF Mono', Menlo, Consolas, 'DejaVu Sans Mono', monospace;
  --r-1: 3px;  --r-2: 6px;  --r-3: 10px;  --r-pill: 999px;
  --shadow-card: 0 1px 2px rgba(28, 27, 23, 0.06);
  --shadow-sheet: 0 12px 32px rgba(28, 27, 23, 0.18);
  --t-fast: 120ms;  --t-base: 180ms;  --t-slow: 320ms;
  --ease-out: cubic-bezier(0.2, 0.7, 0.2, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --rail-w: 248px;  --content-max: 880px;  --page-max: 1120px;
}
/* dark: applied twice, once per trigger; both blocks identical */
@media (prefers-color-scheme: dark) { :root:not([data-theme='light']) { /* DARK */ } }
:root[data-theme='dark'] { /* DARK */ }
/* DARK = */
  color-scheme: dark;
  --paper: #141613;  --panel: #1C1F1B;  --well: #0E100E;
  --ink: #ECE8DC;  --ink-2: #C6C1B3;  --muted: #9A978B;
  --line: #2E322C;  --line-strong: #4A4F47;  --rule: rgba(236, 232, 220, 0.06);
  --moss: #8FC78B;  --moss-ink: #B5DDB1;  --moss-soft: #1F2E20;  --on-moss: #0D1A0F;
  --clay: #E59A86;  --clay-soft: #3A1F19;
  --marker: #6E5A14;  --diff-add: #1E3320;  --diff-remove: #3B211C;  --selection: #2F4A31;
  --chevron: (same SVG with stroke='%239A978B');
  --shadow-card: 0 1px 2px rgba(0, 0, 0, 0.4);  --shadow-sheet: 0 12px 32px rgba(0, 0, 0, 0.6);
```

Contrast (WCAG AA, checked): ink on paper 15:1; ink-2 on paper 8.6:1; muted on paper
5.5:1, on well 5.0:1; moss-ink as link text on paper 9:1; moss on paper 6.4:1; white on
moss 6.4:1; clay on clay-soft 5.6:1; ink on marker 13:1; moss-ink on moss-soft (callout
title) 7.6:1; ink on moss-soft 12:1. Dark: ink on paper 14:1; muted on paper 6.6:1, on
well 6.4:1; moss on paper 9.5:1; on-moss on moss 9:1; clay on clay-soft 6.7:1; ink on
marker 5.4:1; moss-ink on moss-soft 8.9:1. Focus ring (moss) against paper 6.4:1 light,
9.5:1 dark. The reading measure is a literal `680px`; no new tokens were added.

### Type scale

| Role | Font | Size / line-height | Extras |
| --- | --- | --- | --- |
| Hero title | display | `clamp(44px, 7vw, 84px)` / 1.0 | tracking -0.025em; second line italic in `--moss-ink` |
| About / Articles-index title | display | `clamp(34px, 5vw, 60px)` / 1.05 | tracking -0.02em |
| **Article title** | display | `clamp(32px, 4.5vw, 48px)` / 1.1 | tracking -0.02em |
| Section title / tool title | display | `clamp(26px, 3vw, 34px)` / 1.1–1.15 (tool: `clamp(28px, 3.2vw, 36px)` / 1.1) | |
| **Article index entry title** | display | `clamp(22px, 2.4vw, 28px)` / 1.2 | |
| **Article h2 / h3** | display | 26px / 1.2 (23px phone) · 20px / 1.25 | margins 44/12 · 32/8 |
| Card name, try-the-tool name | display | 22px / 1.15 | |
| Note card title | display | 21px / 1.2 | |
| In-tool `h2`, story `h3`, related-article link | display | 20px / 1.2 | margin 28px 0 10px (tool) |
| Step / flow title, prev-next title | display | 18–19px / 1.2–1.25 | |
| **Article block quote** | display italic | 20px / 1.5 | `--ink-2` |
| Figure numeral | display | 40px / 1 (32px on phones) | tabular-nums |
| Stat numeral | display | 28px / 1.1 | tabular-nums |
| Lead paragraph | body | `clamp(17px, 1.6vw, 20px)` / 1.5 | `--ink-2` |
| **Article body** | body | 17px / 1.65 (16px phone) | `--ink`; `strong` 600 |
| Body | body | 15px / 1.55 | |
| Tool description, index summary | body | 16px / 1.5–1.55 | `--ink-2`, max 60ch |
| UI (buttons, nav, rail, filter pills) | body | 14px (pills 13px), weight 500 for buttons and pills | |
| Captions, notes | body | 13px / 1.5 | `--muted` |
| Mono I/O (inputs, outputs) | mono | 14px / 1.5 | tab-size 2 |
| **Article code block** | mono | 13.5px / 1.6 | in a well, horizontal scroll |
| Mono small (diff, lists, code, `table.kv`, `.list-mono`) | mono | 13px / 1.5–1.6 | |
| Eyebrow / label / group heading / date / tag | mono | 11px / 1, weight 500 | uppercase (tags: lowercase), tracking 0.12em (tags, times 0.04em), `--muted` |
| Tiny chips (workers) | — | replaced in v1.1 by 26px `ToolTile` glyphs | |

All headings weight 400; the serif carries the hierarchy by size alone.

### Spacing scale, radii, borders, shadows, motion, small details

Unchanged from v1: 4, 6, 8, 10, 12, 16, 20, 24, 28, 32, 40, 48, 56, 64, 88 px; gutters
32px desktop, 16px at ≤599px; workspace content padding 40px 48px (24px 16px phones);
`--r-1` controls, `--r-2` outputs/steps/pills' larger siblings, `--r-3` cards, `--r-pill`
chips; 1px `--line` borders, `--line-strong` on buttons and hover; only hovered cards
cast `--shadow-card`; `--t-fast` for colour/border and 2–3px arrow nudges, `--t-base` for
card lifts; `--ease-out` everywhere; reduced motion forces everything to 0.01ms;
selection, scrollbars, focus rings, links and the skip link exactly as v1. One addition:
the "From the notebook" cards and the article-nav boxes lift 2px like tool cards.

---

## 2. Shared building blocks (`src/styles/blocks.css`)

All v1 rows unchanged. New in v1.1, for the eight new tools (URL parts, JWT claims, cron
run times, several labelled digests):

| Block | Default | Notes |
| --- | --- | --- |
| `table.kv` | `--well` bg, 1px `--line`, radius 6px, 13px mono, full width; `th` (scope row) eyebrow style, 32% wide (38% on phones), nowrap; `td` ink, pre-wrap, `overflow-wrap: anywhere`; hairline between rows; padding 7px 12px | empty `td` shows `—` in `--muted` |
| `.list-mono` (`ol`/`ul`) | `--well` bg, 1px `--line`, 3px `--moss` left edge, radius 6px, 13px mono tabular, padding 10px 14px 10px 40px; `li` padding 2px 0; markers `--muted` | hidden when empty |
| `.field > .out` | margin 0 | a labelled output inside a field (`<span class="label">SHA-256</span>` above a `.out`) |
| `.tool-body ol` | as `.tool-body ul` (13px mono, `--ink-2`), padding-left 24px | |

Workers may use these in the new tools' `Tool.jsx`; the PM relays the markup to the
worker guide. Nothing else in `blocks.css` changes.

---

## 3. Categories and index numbers (`src/catalog.js`)

Five categories, in this display order, each with a one-line blurb shown on Home:

| id | Name | Blurb | Tools (registry id) |
| --- | --- | --- | --- |
| `encode` | Encode & decode | Base64, entities, tokens and hashes. | `encode-decode`, `hash`, `html-entities`, `jwt-decoder` |
| `data` | Data | JSON, CSV and URLs, taken apart and put back. | `csv-json`, `json-formatter`, `url-parser` |
| `text` | Text | Count, compare, sort, slug and match. | `line-tools`, `regex-tester`, `slugify`, `text-diff`, `text-stats` |
| `numbers` | Numbers & time | Bases, timestamps and schedules. | `cron`, `number-base`, `timestamp` |
| `pick` | Colour & random | Pick a colour or ask for an ID. | `color`, `random` |

A tool with an unknown category falls into a trailing `Other` group, shown only when
non-empty, so a new folder never disappears.

**Numbers are global and come from category order, then name.** The resulting index,
which is identical in the rail, on Home cards and in the tool-page eyebrow:

```
01 Base64 / URL      02 Hash Generator   03 HTML Entities   04 JWT Decoder
05 CSV / JSON        06 JSON Formatter   07 URL Parser
08 Line Tools        09 Regex Tester     10 Slugify         11 Text Diff      12 Text Stats
13 Cron Explainer    14 Number Base      15 Timestamp
16 Color Converter   17 UUID / Random
```

Rationale: per-category numbering (`No. 01` appearing five times) would make the number
meaningless as an identifier; registry (alphabetical) numbering would scatter `01, 06,
08` inside a group. Category-then-name keeps each group's numbers contiguous and every
number unique. Adding a tool renumbers the ones after it, which is acceptable: the number
is a page reference, not a permalink.

`catalog.js` also exports `matchTools(query)` (substring over name, description, id and
category name) and `WORKER_TOOLS` (every tool except the architect-written Slugify),
which is the only source for "tools built by workers".

---

## 4. Page: Home (`#/`)

### Desktop wireframe (≥900px)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ ✦ TwigKit                         Tools   Articles   How it's built  (◐ Auto)│ 64px
├──────────────────────────────────────────────────────────────────────────────┤
│ ─────────────────────────── faint ruled lines every 32px ─────────────────── │
│  TWIGKIT · 17 SMALL TOOLS · ZERO UPLOADS                   (moss eyebrow)    │
│  Tiny tools,                                                                 │
│  done beautifully.          (84px serif; line 2 italic moss)                 │
│  Format JSON, decode a token, read a cron line, diff two texts. …            │
│  ┌──────────────────────────────────────────────────────┐                    │
│  │ ⌕  Jump to a tool — try “json” or “cron”   [/] to focus · [↵] to open │  │ 52px
│  └──────────────────────────────────────────────────────┘                    │
│  ✓ Runs in your browser   ✓ No account, no cookies, no analytics   ✓ MIT     │
├──────────────────────────────────────────────────────────────────────────────┤
│  THE COLLECTION                                                              │
│  Pick a tool.                                                           17   │
│  (● All 17)(Encode & decode 4)(Data 3)(Text 5)(Numbers & time 3)(Colour… 2)  │ pills
│                                                                              │
│  ENCODE & DECODE   Base64, entities, tokens and hashes.                  04  │ group head
│  ─────────────────────────────────────────────────────────────────────────── │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐          │
│  │ [64]   NO. 01│ │ [##]   NO. 02│ │ [&;]   NO. 03│ │ [jw]   NO. 04│ (3 cols,│
│  │ Base64 / URL │ │ Hash Gener…  │ │ HTML Entit…  │ │ JWT Decoder  │  wraps) │
│  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘          │
│  DATA   JSON, CSV and URLs, taken apart and put back.                    03  │
│  ─────────────────────────────────────────────────────────────────────────── │
│  … cards 05–07 … then TEXT 08–12, NUMBERS & TIME 13–15, COLOUR & RANDOM 16–17 │
├──────────────────────────────────────────────────────────────────────────────┤
│  FROM THE NOTEBOOK                                        All articles →     │
│  Recent notes.                                                               │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐                          │
│  │ 30 OCT 2026  │ │ 29 OCT 2026  │ │ 28 OCT 2026  │  2px top edge, moss on   │
│  │ Base64 is n… │ │ Reading a J… │ │ Cron in pla… │  hover                   │
│  │ What Base64… │ │ Three dot-s… │ │ The five fi… │                          │
│  │ 4 MIN READ   │ │ 5 MIN READ   │ │ 4 MIN READ   │                          │
│  └──────────────┘ └──────────────┘ └──────────────┘                          │
├──────────────────────────────────────────────────────────────────────────────┤
│  HOW IT'S BUILT                            ┌───────────┐ ┌───────────┐       │
│  Architected by Claude. Typed by Qwen.     │01 Specify │ │02 Implem… │       │
│  Checked by tests.                         └───────────┘ └───────────┘       │
│  TwigKit is also a demonstration: … 16 of  ┌───────────┐ ┌───────────┐       │
│  the 17 tools here were typed by a worker  │03 Verify  │ │04 Review  │       │
│  Read how it's built →                     └───────────┘ └───────────┘       │
├──────────────────────────────────────────────────────────────────────────────┤
│ ✦ TwigKit                        Tools  Articles  How it's built  Source…    │
│ Tiny tools, done beautifully. (italic)                                       │
│ A free, open-source test project by CodeTwig. MIT licensed. …                │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Mobile wireframe (375px)

```
┌───────────────────────────┐
│ ✦  Tools Articles How… (◐)│ 56px; wordmark hidden ≤439px
├───────────────────────────┤
│ TWIGKIT · 17 SMALL …      │
│ Tiny tools,               │ 44px
│ done beautifully.         │
│ ┌───────────────────────┐ │
│ │ ⌕ Jump to a tool —…   │ │ (hint hidden)
│ └───────────────────────┘ │
│ ✓ ✓ ✓ (stacked)           │
├───────────────────────────┤
│ THE COLLECTION            │
│ Pick a tool.           17 │
│ (All 17)(Encode & dec… 4) │ pills wrap
│ (Data 3)(Text 5)(Numb… 3) │
│ (Colour & random 2)       │
│ ENCODE & DECODE        04 │ (blurb hidden ≤899)
│ ─────────────────────────  │
│ ┌───────────────────────┐ │
│ │ [64]           NO. 01 │ │ 1 column
│ │ Base64 / URL          │ │
│ │ Encode and decode …   │ │
│ │ Open →   (always on)  │ │
│ └───────────────────────┘ │
│ … per group …             │
├───────────────────────────┤
│ FROM THE NOTEBOOK         │
│ Recent notes.             │
│ All articles →            │
│ ┌ note ┐ ┌ note ┐ ┌ note ┐│ stacked, 1 column
├───────────────────────────┤
│ HOW IT'S BUILT … 2×2 steps│
├───────────────────────────┤
│ footer, one column        │
└───────────────────────────┘
```

### Copy (exact; counts in `{}` are computed)

- Header nav: `Tools`, `Articles`, `How it's built`; theme button as v1.
- Eyebrow: `TwigKit · {tools.length} small tools · Zero uploads`.
- H1: `Tiny tools,` ⏎ `done beautifully.` (second line in `<em>`).
- Lead: `Format JSON, decode a token, read a cron line, diff two texts. Each one is a
  20-second job, and each one runs entirely in this tab. Nothing is uploaded, nothing is
  stored, nobody is asked to sign in.`
- Search placeholder: `Jump to a tool — try “json” or “cron”`; hidden label `Jump to a
  tool`; hint `/ to focus · ↵ to open`.
- Trust list: unchanged.
- Collection: eyebrow `The collection`; title `Pick a tool.`; count `17`, or `05 of 17`
  while a query or a category pill other than `All` is active; pills `All {n}` then each
  category name with its count; group head = category name (moss eyebrow) + blurb
  (13px muted, hidden ≤899px) + count of cards shown (`04`); card `No. 06`; CTA `Open →`.
  Empty: `No tool matches “<query>”[ in this category]. Build your own` (link `#/about`).
- Notebook teaser: eyebrow `From the notebook`; title `Recent notes.`; link `All
  articles →`; cards: date, title, summary, `N min read`. Absent when no articles exist.
- Build teaser: title `Architected by Claude. Typed by Qwen. Checked by tests.`; body
  `TwigKit is also a demonstration: one strong model writes the specs and the tests,
  small local models implement the tools in parallel, and nothing ships until the tests
  say so. {WORKER_TOOLS.length} of the {tools.length} tools here were typed by a worker;
  so were the articles.`; link `Read how it's built →`. Steps: `01 Specify — Claude
  writes the spec, the tests and the shell.` `02 Implement — Qwen workers each build one
  tool, in parallel.` `03 Verify — Tests and lint run; failures go back to the worker.`
  `04 Review — Claude checks the result in a real browser.`
- Footer: links `Tools`, `Articles`, `How it's built`, `Source on GitHub`; tagline and
  note unchanged.

### Behaviour

- Typing filters cards (within the selected category) by `matchTools`; groups with no
  matches disappear; Enter opens the first match of the typed text across all tools
  (`location.hash = '#/<id>'`); Escape clears; `/` outside a form control focuses the box.
- Category pills are `<button aria-pressed>`; `All` is selected on load; the choice is
  not persisted.
- Cards are `<a>` elements; the whole card is the link. Group heading is `h3`, card name
  `h4` (section title is `h2`).

### Section CSS (summary; verbatim in `work/04-home.md`, `13-collection.md`, `16-notebook-teaser.md`)

| Section | Values |
| --- | --- |
| `.site-header` | as v1; `≤439px`: `.brand-name` hidden, nav gap 12px |
| `.hero`, `.jump`, `.trust` | as v1 |
| `.collection` | padding 56px 32px 32px (40px 16px 24px phone); head as v1; count 34px serif muted |
| `.filters` | flex wrap gap 8px, margin-bottom 32px (24 phone); `.filter` 34px pill, panel bg, 1px line, 13px/500, padding 0 12px; count `.filter-n` 11px mono muted; hover border `--line-strong`; active moss bg / on-moss (count at 80%) |
| `.group` | `+ .group` margin-top 40px (32 phone); `.group-head` flex baseline gap 12px, padding-bottom 10px, hairline bottom, margin-bottom 16px; name 11px mono upper moss; blurb 13px muted ellipsis (hidden ≤899); count 11px mono muted right |
| `.cards`, `.card` | as v1 (3/2/1 columns, 184px min, hover lift, tile goes moss, CTA reveal) |
| `.notebook` | hairline top; inner padding 56px 32px (40px 16px phone); head flex space-between; `.notes` 3 columns gap 16 (1 column ≤899); `.note` panel, 1px line, 2px `--line-strong` top edge (moss on hover), radius 6px, padding 20px 20px 18px, lift 2px; date eyebrow; title 21px serif; summary 14px ink-2; meta 11px mono muted |
| `.teaser`, `.steps`, `.site-footer` | as v1 |

---

## 5. Page: Tool workspace (`#/<tool-id>`)

### Desktop wireframe (≥900px)

```
┌────────────────┬─────────────────────────────────────────────────────────────┐
│ ✦ TwigKit  (◐) │                                                             │
│                │  TOOL 06 OF 17 · DATA                  (moss eyebrow)       │
│ ENCODE & DECODE│  JSON Formatter                        (36px serif)         │
│ 01 [64] Base64 │  Format, validate and minify JSON.     (16px ink-2)         │
│ 02 [##] Hash … │  ────────────────────────────────────────────── hairline    │
│ 03 [&;] HTML … │  JSON                                                       │
│ 04 [jw] JWT …  │  ┌───────────────────────────────────────────────────────┐  │
│ DATA           │  │ textarea (panel, mono)                                │  │
│ 05 [[]] CSV …  │  └───────────────────────────────────────────────────────┘  │
│ 06 [{}] JSON … │  [Format] [Minify]                                          │
│ 07 [?=] URL …  │  ┃ { "a": 1 }                                   [Copy]      │
│ TEXT           │                                                             │
│ 08 … 12        │  ┃ FROM THE NOTEBOOK                                        │
│ NUMBERS & TIME │  ┃ Base64 is not encryption →                               │
│ 13 … 15        │  ┃ What Base64 is for … 4 MIN READ      (only if related)  │
│ COLOUR & RANDOM│                                                             │
│ 16 … 17        │  ────────────────────────────────────────────── hairline    │
│ ───────────── │  Nothing you type leaves this tab. All tools · Articles ·   │
│ Articles →     │  How it's built                                             │
│ How it's built→│                                                             │
│ Source on GitHub                                                             │
│ Runs in your…  │                                                             │
└────────────────┴─────────────────────────────────────────────────────────────┘
   248px sticky, scrolls internally; theme toggle moved up beside the brand
```

Active rail row: `--moss-soft` background, `--moss-ink` text, number in moss, tile solid
moss with on-moss glyph. Rows are 34px (was 38px) so seventeen rows plus five headings
fit a 900px-tall window; on shorter windows the rail scrolls and the active row is
scrolled into view.

### Mobile wireframe (≤899px)

```
┌───────────────────────────────┐
│ ✦ TwigKit                 (◐) │ 56px, sticky
│ (64 Base64)(## Hash)(●{} JSON)…│ 17 chips in rail order, horizontal scroll
├───────────────────────────────┤
│ TOOL 06 OF 17 · DATA          │
│ JSON Formatter                │ 28px
│ … tool …                      │
│ ┃ FROM THE NOTEBOOK …         │
│ ───────────────────────────── │
│ Nothing you type leaves this… │
└───────────────────────────────┘
```

### Copy (exact)

Rail: group headings = category names; rows `01 Base64 / URL` … `17 UUID / Random`
(catalog order); foot links `Articles →`, `How it's built →`, `Source on GitHub`; note
`Runs in your browser. Nothing is uploaded.` Head: eyebrow `Tool 06 of 17 · Data`, `h1`
= tool name, `p` = tool description. Loading fallback: `Loading…`. Related article panel
(only when an article's `tool` is this id; newest wins): eyebrow `From the notebook`,
the article title with an arrow, the summary, `N min read`. Foot: `Nothing you type
leaves this tab. All tools · Articles · How it's built`. Document title
`<Tool name> · TwigKit`.

### Section CSS (summary; verbatim in `work/03-shell.md` and `work/15-rail.md`)

| Part | Values |
| --- | --- |
| `.rail` | sticky top 0, height 100vh, width 248px, padding 16px 12px, 1px `--line` right, scrolls internally |
| `.rail-top` | flex space-between: Brand + icon-only ThemeToggle (28px tall, label hidden); padding 0 8px 16px |
| `.rail-nav` | column, gap 14px between groups; `.rail-group-label` eyebrow, margin 0 0 4px, padding 0 8px |
| `.rail-item` | flex, gap 10px, min-height 34px, padding 4px 8px, radius 6px, 14px `--ink-2`; hover `--well` bg; active `--moss-soft` / `--moss-ink` / 500; focus ring inset -2px |
| `.rail-num`, `.tile-sm`, `.rail-foot`, `.rail-link`, `.rail-note` | as v1 (foot margin-top 20px instead of auto) |
| `.ws-main`, `.tool-head`, `.ws-foot` | as v1 |
| `.tool-related` | margin-top 40px (32 phone), padding 18px 20px (16 phone), panel bg, 1px line, 3px moss left edge, radius 6px, max 64ch; link 20px serif ink (hover moss-ink), arrow moss nudges 3px; meta 14px ink-2; time 11px mono muted |
| ≤899px | rail hidden; `.ws-mobile` sticky bar + `.strip` chips exactly as v1 |

---

## 6. Page: How it's built (`#/about`)

Layout and CSS as v1 except where listed. Every number is computed.

### Changes

- H1: `One architect, a team of workers, and a test suite between them.` (max 20ch).
- Figures: `{tools.length}` / `tools in the kit`; `{WORKER_TOOLS.length}` / `of them
  typed by Qwen workers`; `{articles.length}` / `articles, written the same way`; `0` /
  `bytes uploaded, ever`.
- Flow station 2: who `Qwen × {WORKER_TOOLS.length}`; the 4×2 text chips are replaced by
  a wrapped row (max 240px, gap 4px; 360px on phones) of 26px `ToolTile` glyphs, one per
  worker tool, each with the tool name as `title` and visually-hidden text. Station 3
  text: `One test file per tool, plus lint and a build. A failure goes back to the
  worker.`
- Story: six entries, 2 columns × 3 rows (1 column ≤699px): 01 The architect writes the
  contract · 02 Workers type in parallel · 03 The loop verifies (`scripts/dispatch.mjs`
  and `scripts/team.mjs` …) · 04 The architect reviews (the "error before you typed"
  anecdote) · 05 The site gets a design (designer model, work packages, Qwen team,
  browser review; "This page is one of those packages.") · 06 The kit grows (new tools
  and articles added the same way). Full text in `work/05-about.md`. The v1 review-note
  paragraph under the story is folded into 05 and 06 and removed.
- Build section: unchanged commands; a second `.build-note`: `Articles work the same
  way: a module under src/articles/ with a default export is an article. See the
  notebook.` (link to `#/articles`). `.build-note` is 14px muted, max 62ch, margin 0 0 12px.
- `FlowDiagram` and its CSS live in their own files (`FlowDiagram.jsx`, `FlowDiagram.css`).

---

## 7. Page: Articles index (`#/articles`)

### Desktop wireframe

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ ✦ TwigKit                         Tools   Articles   How it's built  (◐ Auto)│
├──────────────────────────────────────────────────────────────────────────────┤
│  ARTICLES                                                    (ruled paper)   │
│  From the notebook.                                      (60px serif)        │
│  Short, practical notes on the ideas behind the tools: …                     │
├──────────────────────────────────────────────────────────────────────────────┤
│  30 OCT 2026      Base64 is not encryption                   (28px serif)    │
│                   What Base64 is for, why it makes data bigger, and why …    │
│                   4 MIN READ  (encoding)(security)  ([64] Base64 / URL)      │
│  ─────────────────────────────────────────────────────────────────────────── │
│  29 OCT 2026      Reading a JWT without panic                                │
│                   Three dot-separated parts, …                               │
│                   5 MIN READ  (jwt)(security)  ([jw] JWT Decoder)            │
│  ─────────────────────────────────────────────────────────────────────────── │
│  … one row per article, newest first …                                       │
│  Articles are data files in the repository, rendered without any HTML …     │
├──────────────────────────────────────────────────────────────────────────────┤
│  footer                                                                      │
└──────────────────────────────────────────────────────────────────────────────┘
```

Mobile (≤699px): the date sits above the title; one column; hairlines between rows.

### Copy (exact)

Eyebrow `Articles`; H1 `From the notebook.`; lead `Short, practical notes on the ideas
behind the tools: what Base64 actually is, how to read a token, why cron has five fields.
Each note links to the tool it explains, and each tool links back.` Row: date (`30 Oct
2026`), title (link), summary, `N min read`, tag pills, tool pill (`ToolTile` + name,
links to `#/<id>`). Empty: `No articles yet. The first notes are being written; the tools
are already here.` (link `#/`). Foot note: `Articles are data files in the repository,
rendered without any HTML injection. Read them on GitHub.`

### CSS (summary; verbatim in `work/11-articles-index.md`)

| Part | Values |
| --- | --- |
| `.arts-hero` | ruled background as Home; inner padding 72px 32px 48px (48px 16px 36px phone); title `clamp(34px, 5vw, 60px)`/1.05; lead `clamp(16px, 1.5vw, 19px)` `--ink-2` max 60ch |
| `.arts-list-wrap` | max 1120 centred, padding 24px 32px 64px (8px 16px 48px phone) |
| `.arts-item` | grid `140px 1fr`, gap 8px 32px, padding 28px 0, hairline bottom (1 column, 24px 0 at ≤699) |
| `.arts-date` | eyebrow style, line-height 1.6, padding-top 6px, nowrap |
| `.arts-item-title` | `clamp(22px, 2.4vw, 28px)`/1.2; link ink, no underline; hover moss-ink + underline offset 4px |
| `.arts-summary` | 16px/1.55 `--ink-2`, margin-bottom 12px; `.arts-main` max 68ch |
| `.arts-meta` | flex wrap gap 8px 16px; `.arts-time` 11px mono muted; `.tag` 11px mono pill (panel, 1px line, padding 4px 9px); `.arts-tool` pill with 26px tile, 13px, padding 2px 10px 2px 2px, hover border moss + tile moss |
| `.arts-empty` | dashed `--line-strong`, radius 10px, padding 40px 20px, centred muted |
| `.arts-foot` | 13px muted, max 64ch, margin-top 32px |

---

## 8. Page: Article reader (`#/articles/<slug>`)

### Desktop wireframe

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ ✦ TwigKit                         Tools   Articles   How it's built  (◐ Auto)│
├──────────────────────────────────────────────────────────────────────────────┤
│              ← All articles                                   (13px, ink-2)  │
│              30 OCT 2026 · 4 MIN READ                          (moss eyebrow)│
│              Base64 is not encryption                          (48px serif)  │
│              What Base64 is for, why it makes data bigger, …   (20px ink-2)  │
│              (encoding)(security)                              tag pills     │
│              ─────────────────────────────────────────────── hairline        │
│              Body text, 17px/1.65, column 680px wide. Inline `code` on a     │
│              darker chip, **bold** 600, links moss-ink with a hairline       │
│              underline.                                                      │
│              What Base64 is for                                (26px serif)  │
│              …                                                               │
│              ┌───────────────────────────────────────────────────┐           │
│              │ JS                                        [Copy] │ head strip │
│              │ btoa('hi')  // "aGk="                             │ well      │
│              └───────────────────────────────────────────────────┘           │
│              ┃ “A quotation set in italic serif.”               block quote  │
│              ┃ — SOMEONE                                                     │
│              ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓             │
│              ┃ NOTE                                            ┃ callout:    │
│              ┃ A short aside on moss-soft with a green edge.   ┃ moss-soft   │
│              ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛             │
│              • lists with grey markers, 6px between items                    │
│              ┌───────────────────────────────────────────────────┐           │
│              │ [64]  TRY THE TOOL                                │           │
│              │       Base64 / URL              [Open Base64 / URL →] (moss) │
│              │       Encode and decode Base64 and URL strings.   │           │
│              └───────────────────────────────────────────────────┘           │
│              ─────────────────────────────────────────────── hairline        │
│              ┌ PREVIOUS ─────────────┐  ┌───────────────── NEXT ┐            │
│              │ Reading a JWT without…│  │ Regular expressions, …│            │
│              └───────────────────────┘  └───────────────────────┘            │
├──────────────────────────────────────────────────────────────────────────────┤
│  footer                                                                      │
└──────────────────────────────────────────────────────────────────────────────┘
```

Mobile (≤599px): 16px gutters; body 16px; h2 23px; code blocks scroll horizontally
inside their box; the try-the-tool button spans the full width under the text; prev/next
stack in one column, both left-aligned.

### Copy (exact)

Back link `All articles` (arrow-left icon). Meta `{formatDate(date)} · {readingTime}`.
H1 = `title`; lead = `summary`; tag pills = `tags`. Try-the-tool: eyebrow `Try the
tool`, tool name, tool description, button `Open {tool.name} →` (`.btn.primary`, links
`#/<id>`); omitted when `tool` is absent or unknown. Nav: `Previous` = the article above
this one in the index (newer), `Next` = the one below (older); each box shows the eyebrow
and the title; absent sides are empty; the whole nav is omitted when neither exists.
Document title `{title} · TwigKit`.

### Reading CSS (summary; verbatim in `work/10-article-reader.md`)

| Part | Values |
| --- | --- |
| `.art-inner` | max `calc(680px + 64px)`, centred, padding 40px 32px 72px (24px 16px 56px phone) |
| `.art-back` | 13px `--ink-2`, hover moss-ink, arrow nudges -2px; margin-bottom 32px |
| `.art-head` | margin-bottom 36px, padding-bottom 28px, hairline; `.art-meta` eyebrow in moss; title `clamp(32px, 4.5vw, 48px)`/1.1 tracking -0.02em; summary `clamp(17px, 1.6vw, 20px)`/1.5 `--ink-2`; tags margin-top 20px |
| `.art-body` | 17px/1.65 ink (16px phone); `p` margin 0 0 20px; `h2` 26px/1.2 margin 44px 0 12px (23px, 36px top on phone); `h3` 20px/1.25 margin 32px 0 8px; first heading margin-top 0; lists padding-left 24px, `li` margin 6px, markers muted; links moss-ink with `--line-strong` underline; `strong` 600; inline `code` 0.88em on `--well`, radius 3px, padding 1px 5px |
| `.art-code` | margin-bottom 24px, well bg, 1px line, radius 6px, overflow hidden; `.art-code-head` flex space-between, padding 6px 8px 6px 14px, hairline bottom; lang eyebrow; copy `.btn` 28px / 12px on panel; `pre` padding 14px 16px, 13.5px/1.6 mono, `overflow-x: auto`, tab-size 2 |
| `.art-quote` | margin 28px 0, padding 4px 0 4px 20px, 3px `--line-strong` left; `p` italic serif 20px/1.5 `--ink-2`; `cite` block, 12px mono muted, `— ` prefix via `::before` |
| `.art-callout` | margin 28px 0, padding 14px 18px, `--moss-soft` bg, 1px line, 3px moss left, radius 6px; title eyebrow in `--moss-ink`; text 15px/1.55 ink |
| `.art-try` | margin-top 48px, grid `auto 1fr auto` gap 16px 20px, padding 20px 24px (16 phone), panel, 1px line, radius 10px; eyebrow moss; name 22px serif; desc 14px ink-2; button `.btn.primary`, nowrap, no underline (full width ≤599) |
| `.art-nav` | margin-top 40px, padding-top 24px, hairline top, 2 columns gap 16px (1 column phone); `.art-nav-link` panel-less box with 1px line, radius 6px, padding 14px 16px, column gap 6px, hover border `--line-strong` and title moss-ink; next box right-aligned; title 18px serif |

---

## 9. Article data, inline markup and safety

Data contract: as in BRIEF-2 (`slug`, `title`, `summary`, `date`, `tags`, optional
`tool`, `blocks` of `p | h2 | h3 | ul | ol | code | quote | callout`). The registry
(`src/articles/registry.js`) globs `['./*.js', '!./registry.js', '!./inline.js',
'!./*.test.js']`, keeps only defaults with a string `slug`, and sorts by `date` desc then
`title`. Reading time = `max(1, round(words / 200))` over paragraph, heading, list, code,
quote and callout text, shown as `N min read`. Dates render as `30 Oct 2026`.

Inline parser (`parseInline`): one regex, leftmost match wins, no nesting:

```
`([^`]+)`  |  \*\*([^*]+)\*\*  |  \*([^*]+)\*  |  \[([^\]]+)\]\(([^)\s]+)\)
```

Tokens `{ t: 'text'|'code'|'b'|'i', s }` and `{ t: 'a', s, href }`. A link is only a
link when `href` matches `/^(https?:|mailto:|#\/)/i`; otherwise the entire `[label](href)`
source is emitted as a text token. `renderInline` maps tokens to `code`, `strong`, `em`,
`a` (external links get `target="_blank" rel="noopener noreferrer"`; `#/` links do not)
and bare strings. `ArticleBody` maps blocks to elements as listed in `00-contracts.md`
§3. Nothing anywhere uses `dangerouslySetInnerHTML`; text that looks like HTML renders
as the literal characters.

---

## 10. No stale numbers

Every count on the site is computed at render time: `tools.length`,
`WORKER_TOOLS.length` (= `tools.length - 1`), `articles.length`, group counts, index
numbers, reading times. Test counts and run timings no longer appear anywhere because
they cannot be computed by the site. The only literals allowed in copy are the step
numbers `01`–`04`, the phrase "20-second job", `0` bytes uploaded, and the vLLM port in
a command. Package 07 asserts the derived numbering; package 05's acceptance check greps
`About.jsx` for stray digits.

---

## 11. Inline SVG (complete)

All v1 SVGs unchanged (twig mark, favicon, arrow, check, search, theme icons, retry loop,
select chevron). One addition, the left arrow used by "All articles" and the back link:

```html
<svg class="icon-arrow-left" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M13 8H3M7 4L3 8l4 4"/></svg>
```

Twig mark (brand):

```html
<svg class="brand-mark" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21.5V9"/><path d="M12 13.5c0-3.3 2.4-5.5 5.5-5.5 0 3.3-2.4 5.5-5.5 5.5z"/><path d="M12 18c0-3.3-2.4-5.5-5.5-5.5 0 3.3 2.4 5.5 5.5 5.5z"/><path d="M12 9c0-2.8 1-5 2.5-6.5"/></svg>
```

Arrow (links, 16px):

```html
<svg class="icon-arrow" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4"/></svg>
```

Check, search, theme icons, retry loop, favicon: see `work/04-home.md`, `06-chrome.md`,
`14-flow-diagram.md`; they are byte-identical to v1.

---

## 12. Theme toggle, theming rules, accessibility

Unchanged from v1, plus:

- The rail shows the theme toggle beside the brand (icon only, 28px tall); it is no
  longer in the rail footer, so it is always visible however tall the rail is.
- Rail group headings are `<p class="eyebrow">` referenced by `aria-labelledby` on a
  `<section>` per group; rows keep `aria-current="page"`.
- Category pills are real `<button>`s with `aria-pressed`; the collection count stays
  `aria-live="polite"`.
- Article pages: `article` landmark inside `main`; `nav aria-label="More articles"`;
  `aside aria-label="Try the tool"`; tags are a `ul aria-label="Tags"`; dates are
  `<time dateTime>`. Code copy buttons are the shared `CopyButton` (36px min target
  reduced to 28px only inside code heads, as in tool outputs).
- External links in articles open in a new tab with `rel="noopener noreferrer"`; in-site
  links do not.
- Touch targets: pills 34px, chips 36px, rail rows 34px (hover/focus area is the full
  row width), note cards and nav boxes ≥ 44px tall.

## 13. Package map (v1.1)

| Package | Owns | Status |
| --- | --- | --- |
| 01 tokens and base | `src/index.css`, `src/styles/tokens.css`, `src/styles/base.css` | unchanged |
| 02 tool blocks | `src/styles/blocks.css` | updated (kv, list-mono) |
| 03 shell | `src/App.jsx`, `src/shell/useRoute.js`, `src/catalog.js`, `src/shell/Workspace.jsx`, `src/shell/Workspace.css` | updated |
| 04 home | `src/pages/Home.jsx`, `src/pages/Home.css` | updated |
| 05 about | `src/pages/About.jsx`, `src/pages/About.css` | updated |
| 06 chrome | `src/theme.js`, `src/ui/chrome/*.jsx`, `src/ui/chrome/chrome.css`, `index.html`, `public/favicon.svg` | updated |
| 07 tests | `src/App.test.jsx`, `src/theme.test.js` | updated |
| 08 articles registry | `src/articles/registry.js` | new |
| 09 inline parser and body | `src/articles/inline.js`, `src/articles/ArticleBody.jsx` | new |
| 10 article reader | `src/pages/Article.jsx`, `src/pages/Article.css` | new |
| 11 articles index | `src/pages/Articles.jsx`, `src/pages/Articles.css` | new |
| 12 article tests | `src/articles/inline.test.js`, `src/articles/registry.test.js`, `src/articles/ArticleBody.test.jsx` | new |
| 13 collection | `src/pages/Collection.jsx`, `src/pages/Collection.css` | new (split from 04) |
| 14 flow diagram | `src/pages/FlowDiagram.jsx`, `src/pages/FlowDiagram.css` | new (split from 05) |
| 15 rail | `src/shell/Rail.jsx`, `src/shell/Rail.css` | new (split from 03) |
| 16 notebook teaser | `src/pages/NotebookTeaser.jsx`, `src/pages/NotebookTeaser.css` | new |

Before running: the PM adds `category` to every tool `index.js` per §3. The flow-diagram
CSS that v1 kept inside `About.css` moves to `FlowDiagram.css`; package 05 rewrites
`About.css` without it, so nothing needs deleting by hand. Suggested batches: 01–08
together, then 09–16; 07 and 12 only pass once their dependencies exist.
