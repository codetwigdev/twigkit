# TwigKit design: "Field notes"

## The concept

TwigKit is a sheet of good paper. Warm off-white, ink-black text, a single moss-green
accent, hairline rules instead of shadows, and a serif for anything that is a title: it
reads like a well-set field notebook rather than a dashboard. Every tool is a *specimen*:
a monospace glyph in a small square tile, an index number (`No. 03`), a serif name and one
plain sentence. The home page is the notebook's contents page; the tool page is a single
entry with a numbered index down the left; the About page is the appendix that explains
how the notebook was written. Dark mode is the same sheet after dark: green-black paper,
warm chalk-white ink, the same green. Nothing glows, nothing blurs, nothing is purple.
Motion is limited to short, one-property transitions (120–180 ms) and is switched off under
`prefers-reduced-motion`. The whole thing uses system fonts only: a Palatino/Georgia-class
serif for display, the system sans for body, and the system monospace for everything a
developer reads or types.

The implementation detail that makes this work on top of the untouched tool components:
inputs are *lighter* than the page (`--panel`), results are *darker* (`--well`) with a
3px left edge that turns green once there is a value, and labels are 11px uppercase
monospace with wide tracking. Those three moves give every tool the same quiet rhythm
without touching a line of tool code.

Files: the exact, copy-pasteable CSS and JSX for every piece of this document are in the
work packages under `docs/design/work/`. This document is the design of record; where it
and a package disagree, this document wins and the package has a bug.

---

## 1. Tokens

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
moss 6.4:1; clay on clay-soft 5.6:1; ink on marker 13:1. Dark: ink on paper 14:1; muted on
paper 6.6:1, on well 6.4:1; moss on paper 9.5:1; on-moss on moss 9:1; clay on clay-soft
6.7:1; ink on marker 5.4:1. Focus ring (moss) against paper 6.4:1 light, 9.5:1 dark.

### Type scale

| Role | Font | Size / line-height | Extras |
| --- | --- | --- | --- |
| Hero title | display | `clamp(44px, 7vw, 84px)` / 1.0 | tracking -0.025em; second line italic in `--moss-ink` |
| About title | display | `clamp(34px, 5vw, 60px)` / 1.05 | tracking -0.02em |
| Section title / tool title | display | `clamp(26px, 3vw, 34px)` / 1.1–1.15 (tool: `clamp(28px, 3.2vw, 36px)` / 1.1) | |
| Card name | display | 22px / 1.15 | |
| In-tool `h2`, story `h3` | display | 20px / 1.2 | margin 28px 0 10px (tool) |
| Step / flow title | display | 18–19px / 1.2 | |
| Figure numeral | display | 40px / 1 (32px on phones) | tabular-nums |
| Stat numeral | display | 28px / 1.1 | tabular-nums |
| Lead paragraph | body | `clamp(17px, 1.6vw, 20px)` / 1.5 | `--ink-2` |
| Body | body | 15px / 1.55 | |
| Tool description | body | 16px / 1.5 | `--ink-2`, max 60ch |
| UI (buttons, nav, rail) | body | 14px, weight 500 for buttons | |
| Captions, notes | body | 13px / 1.5 | `--muted` |
| Mono I/O (inputs, outputs) | mono | 14px / 1.5 | tab-size 2 |
| Mono small (diff, lists, code) | mono | 13px / 1.6 | |
| Eyebrow / label | mono | 11px / 1, weight 500 | uppercase, tracking 0.12em, `--muted` |
| Tiny chips (workers) | mono | 10px / 1 | tracking 0.04em |

All headings weight 400; the serif carries the hierarchy by size alone.

### Spacing scale

4, 6, 8, 10, 12, 16, 20, 24, 28, 32, 40, 48, 56, 64, 88 px. Page gutters: 32px desktop,
16px at ≤599px. Content column padding in the workspace: 40px 48px (24px 16px on phones).
Vertical rhythm inside tools: every block ends with `margin-bottom: 16px`.

### Radii, borders, shadows

`--r-1` 3px for controls and small tiles; `--r-2` 6px for buttons' larger siblings, outputs,
stats, steps; `--r-3` 10px for home cards and large tiles; `--r-pill` for chips and the
theme toggle. Borders are 1px `--line` by default, `--line-strong` for buttons and on
hover. Shadows: only `--shadow-card` on a hovered home card. Nothing else casts a shadow.

### Motion

| Duration | Use |
| --- | --- |
| `--t-fast` 120ms | colour/border changes on hover and focus, arrow nudges (2–3px) |
| `--t-base` 180ms | card lift (translateY -2px), "Open →" reveal, brand twig tilt (-10°) |
| `--t-slow` 320ms | reserved (unused in v1) |

Easing `--ease-out` everywhere. Under `prefers-reduced-motion: reduce` every transition
and animation is forced to 0.01ms and `scroll-behavior` is `auto`.

### Small details

- Selection: `--selection` background, `--ink` text.
- Scrollbars: `scrollbar-width: thin; scrollbar-color: var(--line-strong) transparent`;
  WebKit 10px with a 3px transparent inset so the thumb is a 4px pill.
- Focus: `:focus-visible { outline: 2px solid var(--moss); outline-offset: 2px }`.
  Text controls use `outline-offset: 0` and turn their border moss as well.
- Links: moss-ink, 1px underline in `--line-strong` offset 3px; underline darkens on hover.
- Skip link: hidden above the viewport, appears as a moss pill at top-left on focus; it
  focuses `#main` without changing the hash.

---

## 2. Shared building blocks (styled only through CSS, `src/styles/blocks.css`)

| Block | Default | Hover | Focus (visible) | Active / selected | Disabled | Error | Empty |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `.field > label` | eyebrow style (11px mono upper, `--muted`), 6px gap above control | – | – | – | – | – | – |
| `textarea`, `input[type=text/number/search]`, `select` | `--panel` bg, 1px `--line`, radius 3px, 14px mono, min-height 38px, padding 8px 10px; textarea min-height 160px, resize vertical | border `--line-strong` | 2px moss outline, offset 0, border moss | – | opacity .55, not-allowed cursor | (no invalid state is rendered by tools) | placeholder `--muted` at 80% |
| `select` | native arrow removed; `--chevron` 12px at right 10px | as above | as above | – | – | – | – |
| `input[type=checkbox]` | 16px, `accent-color: --moss`, inline with its label text (14px) | – | 2px moss ring, offset 2 | checked = moss | – | – | – |
| `input[type=color]` | 48×38px, 3px padding, panel bg, 1px line, radius 3px; swatch corners 2px | – | ring | – | – | – | – |
| `.btn` | panel bg, 1px `--line-strong`, radius 3px, 36px tall, 14px/500 body, padding 6px 14px | bg `--moss-soft`, border + text moss | 2px moss ring, offset 2 | pressed: translateY(1px); `aria-pressed=true`: moss bg, on-moss text | opacity .5, no hover change | – | – |
| `.btn.primary` | moss bg, on-moss text | `--moss-ink` bg | ring | – | opacity .5 | – | – |
| `.out` | `--well` bg, 1px `--line`, 3px left edge `--line-strong`, radius 6px, 14px mono, padding 12px 14px (right 92px when a copy button is present), min-height 48px | – | – | left edge turns `--moss` when the copy button is enabled (= has a value) | – | – | italic `--muted` "Nothing here yet" (via `::before` when the copy button is disabled) |
| `.out .btn` | 28px tall, 12px text, absolute top 8 right 8 | as `.btn` | ring | – | opacity .5 | – | – |
| `.error` | `--clay-soft` bg, 3px left `--clay`, `--clay` text, 14px body, padding 10px 14px | – | – | – | – | this *is* the error state | – |
| `.stat` | panel card, 1px line, radius 6px; numeral 28px serif above an eyebrow label (column-reverse) | – | – | – | – | – | – |
| `.diff-line` | 13px mono, padding 2px 12px, 3px transparent left edge, `--ink-2` | – | – | `.diff-add`: `--diff-add` bg + moss edge; `.diff-remove`: `--diff-remove` bg + clay edge; both `--ink` text | – | – | – |
| `.swatch` | 64px tall, radius 6px, 1px line, inset 1px 5% black ring | – | – | – | – | – | – |
| `mark` | `--marker` bg, `--ink`, radius 2px, `box-decoration-break: clone` | – | – | – | – | – | – |
| `.row` | flex, wrap, gap 12px, `align-items: flex-end`, margin-bottom 16px; children `.field` flex `1 1 200px` (select 0 1 220px, number 0 1 140px, color auto) | | | | | | |
| `.grid-2` | two equal columns, gap 24px; one column ≤599px | | | | | | |
| in-tool `h2` | 20px serif, margin 28px 0 10px (32px top inside `.tool-body`, 0 when first) | | | | | | |
| `.tool-body ul` | 13px mono list, `--ink-2`, padding-left 20px | | | | | | |

---

## 3. Page: Home (`#/`)

### Desktop wireframe (≥900px)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ ✦ TwigKit                                  Tools   How it's built   (◐ Auto) │ 64px, hairline below
├──────────────────────────────────────────────────────────────────────────────┤
│ ─────────────────────────── faint ruled lines every 32px ─────────────────── │
│  TWIGKIT · NINE SMALL TOOLS · ZERO UPLOADS                 (moss eyebrow)    │
│  Tiny tools,                                                                 │
│  done beautifully.          (84px serif; line 2 italic moss)                 │
│  Format JSON, decode Base64, convert a timestamp, diff two texts. Each one   │
│  is a 20-second job, and each one runs entirely in this tab. …               │
│  ┌──────────────────────────────────────────────────────┐                    │
│  │ ⌕  Jump to a tool — try “json” or “uuid”   [/] to focus · [↵] to open │  │ 52px
│  └──────────────────────────────────────────────────────┘                    │
│  ✓ Runs in your browser   ✓ No account, no cookies, no analytics   ✓ MIT     │
├──────────────────────────────────────────────────────────────────────────────┤
│  THE COLLECTION                                                              │
│  Pick a tool.                                                           09   │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐                          │
│  │ [64]   NO. 01│ │ [#]    NO. 02│ │ [{}]   NO. 03│   3 columns, gap 16      │
│  │ Base64 / URL │ │ Color Conv…  │ │ JSON Format… │                          │
│  │ Encode and…  │ │ Convert col… │ │ Format, val… │                          │
│  │       Open → │ │              │ │              │   (→ appears on hover)   │
│  └──────────────┘ └──────────────┘ └──────────────┘                          │
│  … three rows …                                                              │
├──────────────────────────────────────────────────────────────────────────────┤
│  HOW IT'S BUILT                            ┌───────────┐ ┌───────────┐       │
│  Architected by Claude. Typed by Qwen.     │01 Specify │ │02 Implem… │       │
│  Checked by 89 tests.                      └───────────┘ └───────────┘       │
│  TwigKit is also a demonstration: …        ┌───────────┐ ┌───────────┐       │
│  Read how it's built →                     │03 Verify  │ │04 Review  │       │
│                                            └───────────┘ └───────────┘       │
├──────────────────────────────────────────────────────────────────────────────┤
│ ✦ TwigKit                                  Tools  How it's built  Source…    │
│ Tiny tools, done beautifully. (italic)                                       │
│ ───────────────────────────────────────────────────────────────────────────  │
│ A free, open-source test project by CodeTwig. MIT licensed. Nothing you …    │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Mobile wireframe (375px)

```
┌───────────────────────────┐
│ ✦ TwigKit  Tools How… (◐) │ 56px
├───────────────────────────┤
│ TWIGKIT · NINE SMALL …    │
│ Tiny tools,               │ 44px
│ done beautifully.         │
│ Format JSON, decode …     │
│ ┌───────────────────────┐ │
│ │ ⌕ Jump to a tool —…   │ │ (hint hidden)
│ └───────────────────────┘ │
│ ✓ Runs in your browser    │
│ ✓ No account, no cookies… │
│ ✓ Open source, MIT…       │
├───────────────────────────┤
│ THE COLLECTION            │
│ Pick a tool.           09 │
│ ┌───────────────────────┐ │
│ │ [64]           NO. 01 │ │ 1 column, gap 12
│ │ Base64 / URL          │ │
│ │ Encode and decode …   │ │
│ │ Open →   (always on)  │ │
│ └───────────────────────┘ │
│ … ×9                      │
├───────────────────────────┤
│ HOW IT'S BUILT            │
│ Architected by Claude…    │
│ Read how it's built →     │
│ ┌─────────┐ ┌─────────┐   │
│ │01 Spec… │ │02 Impl… │   │ 2 columns
│ └─────────┘ └─────────┘   │
│ ┌─────────┐ ┌─────────┐   │
│ │03 Veri… │ │04 Revi… │   │
│ └─────────┘ └─────────┘   │
├───────────────────────────┤
│ footer, one column        │
└───────────────────────────┘
```

### Copy (exact)

- Header nav: `Tools`, `How it's built`; theme button label `Auto` / `Light` / `Dark`,
  `aria-label` = `Theme: Auto. Switch to Light` (and so on through the cycle).
- Eyebrow: `TwigKit · Nine small tools · Zero uploads` (CSS uppercases it).
- H1: `Tiny tools,` ⏎ `done beautifully.` (second line in `<em>`).
- Lead: `Format JSON, decode Base64, convert a timestamp, diff two texts. Each one is a
  20-second job, and each one runs entirely in this tab. Nothing is uploaded, nothing is
  stored, nobody is asked to sign in.`
- Search placeholder: `Jump to a tool — try “json” or “uuid”`; hidden label
  `Jump to a tool`; hint `/ to focus · ↵ to open` (two `<kbd>`s).
- Trust list: `Runs in your browser` · `No account, no cookies, no analytics` ·
  `Open source, MIT licensed`.
- Collection: eyebrow `The collection`; title `Pick a tool.`; count `09`, or `03 of 09`
  while filtering; card number `No. 01`; card CTA `Open →`.
- Empty search: `No tool matches “<query>”. Build your own` (link to `#/about`).
- Teaser: eyebrow `How it's built`; title `Architected by Claude. Typed by Qwen. Checked
  by 89 tests.`; body `TwigKit is also a demonstration: one strong model writes the specs
  and the tests, eight small local models implement the tools in parallel, and nothing
  ships until the tests say so.`; link `Read how it's built →`.
- Steps: `01 Specify — Claude writes the spec, the tests and the shell.` `02 Implement —
  Eight Qwen workers each build one tool, in parallel.` `03 Verify — Tests and lint run;
  failures go back to the worker.` `04 Review — Claude checks the result in a real browser.`
- Footer: tagline `Tiny tools, done beautifully.`; links `Tools`, `How it's built`,
  `Source on GitHub`; note `A free, open-source test project by CodeTwig. MIT licensed.
  Nothing you type leaves this tab: there is no server to send it to.`

### Behaviour

- Typing filters cards by case-insensitive substring over `name + description + id`.
  Enter opens the first match (`location.hash = '#/<id>'`). Escape clears. Pressing `/`
  anywhere outside a form control focuses the box.
- Cards are `<a>` elements; the whole card is the link.

### Section CSS (summary; verbatim in `work/04-home.md`)

| Section | Values |
| --- | --- |
| `.site-header` | 64px (56px phone), hairline bottom, inner max 1120 centred, gutters 32/16; nav gap 20/14; current link has a 1px moss bottom border |
| `.hero` | hairline bottom; `repeating-linear-gradient(to bottom, transparent 0 31px, var(--rule) 31px 32px)`; inner padding 88px 32px 56px (48px 16px 40px phone) |
| `.hero-title` | see type scale; `em` italic `--moss-ink` |
| `.jump` | max 560px; input 52px tall, radius 6px, panel bg, 1px `--line-strong`, 16px body font, padding 0 150px 0 42px (0 16px phone); magnifier 18px at left 14px in `--muted`; hint 12px mono at right 14px, hidden on phone; `kbd` 11px mono, 1px line-strong border with 2px bottom, radius 4px |
| `.trust` | 13px `--muted`, gap 8px 24px, check icons moss |
| `.collection` | padding 56px 32px 32px; head flex space-between baseline; count 34px serif `--muted` |
| `.cards` | 3 / 2 (≤899) / 1 (≤599) columns, gap 16 (12 phone) |
| `.card` | panel bg, 1px line, radius 10px, padding 20px, min-height 184px (0 on phone), flex column gap 10px; hover: translateY(-2px), border `--line-strong`, `--shadow-card`, tile goes moss; CTA 13px/500 moss-ink, hidden until hover/focus (always shown when `hover: none`) |
| `.teaser` | hairline top; inner grid `1.1fr 1fr` gap 48 (1 column ≤899), padding 56px 32px 64px (40px 16px 48px phone) |
| `.steps` | 2×2 grid gap 12px; step: panel, 1px line, radius 6px, padding 16px; number 11px mono moss; name 18px serif; text 13px muted |
| `.site-footer` | hairline top; inner grid `1fr auto` gap 24px 48px, padding 40px 32px 48px (1 column, 32px 16px 40px phone); tagline italic serif 15px muted; note 13px muted above a hairline, max 64ch |

---

## 4. Page: Tool workspace (`#/<tool-id>`)

### Desktop wireframe (≥900px)

```
┌────────────────┬─────────────────────────────────────────────────────────────┐
│ ✦ TwigKit      │                                                             │
│                │  TOOL 03 OF 09                         (moss eyebrow)       │
│ TOOLS          │  JSON Formatter                        (36px serif)         │
│ 01 [64] Base64 │  Format, validate and minify JSON.     (16px ink-2)         │
│ 02 [#]  Color… │  ────────────────────────────────────────────── hairline    │
│ 03 [{}] JSON … │  JSON                                                       │
│ 04 [.*] Regex… │  ┌───────────────────────────────────────────────────────┐  │
│ 05 [/]  Slugi… │  │ textarea (panel, mono)                                │  │
│ 06 [+-] Text … │  └───────────────────────────────────────────────────────┘  │
│ 07 [Aa] Text … │  INDENT          ☑ Sort keys                                │
│ 08 [t]  Times… │  [2 spaces ▾]                                               │
│ 09 [?]  UUID … │  [Format] [Minify]                                          │
│                │  ┃ { "a": 1 }                                   [Copy]      │
│ ───────────── │  ┃ (well, moss left edge when non-empty)                    │
│ How it's built→│                                                             │
│ Source on GitHub                                                             │
│ (◐ Auto) Runs  │  ────────────────────────────────────────────── hairline    │
│ in your browser│  Nothing you type leaves this tab. All tools · How it's…    │
└────────────────┴─────────────────────────────────────────────────────────────┘
   248px sticky        content max 880 + 96 padding, padding 40px 48px
```

Active rail row (03): `--moss-soft` background, `--moss-ink` text, number in moss, tile
solid moss with on-moss glyph.

### Mobile wireframe (≤899px)

```
┌───────────────────────────────┐
│ ✦ TwigKit                 (◐) │ 56px, sticky
│ (64 Base64)(# Color)(●{} JSON)│ chips, horizontal scroll, active = moss
├───────────────────────────────┤
│ TOOL 03 OF 09                 │
│ JSON Formatter                │ 28px
│ Format, validate and minify…  │
│ ───────────────────────────── │
│ JSON                          │
│ ┌───────────────────────────┐ │
│ │ textarea                  │ │
│ └───────────────────────────┘ │
│ INDENT  [2 spaces ▾] ☑ Sort…  │
│ [Format] [Minify]             │
│ ┃ output              [Copy] │
│ ───────────────────────────── │
│ Nothing you type leaves this… │
└───────────────────────────────┘
```

### Copy (exact)

Rail: eyebrow `Tools`; items `01 Base64 / URL` … `09 UUID / Random` (registry order);
foot links `How it's built →`, `Source on GitHub`; note `Runs in your browser. Nothing is
uploaded.` Head: eyebrow `Tool 03 of 09`, `h1` = tool name, `p` = tool description.
Loading fallback: `Loading…`. Foot: `Nothing you type leaves this tab. All tools · How
it's built`. Document title `<Tool name> · TwigKit`.

### Section CSS (summary; verbatim in `work/03-shell.md`)

| Part | Values |
| --- | --- |
| `.rail` | sticky top 0, height 100vh, width 248px, padding 20px 16px 16px, 1px `--line` right, scrolls internally |
| `.rail-item` | flex, gap 10px, padding 6px 8px, radius 6px, 14px `--ink-2`; hover: `--well` bg, ink text; active: `--moss-soft` bg, `--moss-ink` text, weight 500; focus ring inset (-2px) |
| `.rail-num` | 11px mono 500, tabular, `--muted` (moss when active), 18px wide |
| `.tile-sm` | 26px square, radius 3px, 11px mono 600, well bg, 1px line |
| `.rail-foot` | margin-top auto, hairline top, padding-top 16px, gap 8px; links 13px `--ink-2`, hover `--moss-ink`, arrow nudges 2px |
| `.ws-main` | flex 1, padding 40px 48px 48px, max-width 976px (= 880 content) |
| `.tool-head` | padding-bottom 20px, margin-bottom 24px, hairline bottom; eyebrow moss, margin-bottom 10px; title `clamp(28px, 3.2vw, 36px)`/1.1; desc 16px `--ink-2` max 60ch |
| `.ws-foot` | margin-top 48px, hairline top, padding-top 16px, 13px `--muted` |
| ≤899px | rail hidden; `.ws-mobile` sticky top, paper bg, hairline bottom; bar 56px; `.strip` horizontal scroll, no scrollbar, gap 8px, padding 0 16px 12px; `.chip` 36px pill, panel bg, 1px line, 13px, padding 0 12px 0 5px; active chip moss bg / on-moss text, tile transparent with 35% currentColor border; main padding 24px 16px 40px; title 28px |

---

## 5. Page: How it's built (`#/about`)

### Desktop wireframe

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ ✦ TwigKit                                  Tools   How it's built   (◐ Auto) │
├──────────────────────────────────────────────────────────────────────────────┤
│  HOW IT'S BUILT                                              (ruled paper)   │
│  One architect, eight workers,                                               │
│  and a test suite between them.                          (60px serif)        │
│  TwigKit is a free test project. A strong model (Claude) designs …           │
├──────────────────────────────────────────────────────────────────────────────┤
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐                         │
│  │ 8        │ │ 89       │ │ ~14 s    │ │ 0        │   40px serif numerals   │
│  │ tools b… │ │ tests, … │ │ for a f… │ │ bytes u… │                         │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘                         │
├──────────────────────────────────────────────────────────────────────────────┤
│  THE LOOP                                                                    │
│  From spec to shipped tool                                                   │
│  ●1━━━━━━━━━━━━━━●2━━━━━━━━━━━━━━━●3━━━━━━━━━━━━━━●4━━━━━━━━━━━━━━━━━━━━━━━  │
│  CLAUDE           QWEN × 8          VITEST + OXLINT   CLAUDE                  │
│  Architect writes Workers implement Tests and lint    Architect reviews       │
│  specs and tests  in parallel       verify            in a browser            │
│  The shell, the…  Each worker gets… 89 tests and a…   Passing tests is…       │
│                   [json][base64]                                              │
│                   [timestamp][color]                                          │
│                   [uuid][diff]                                                │
│                   [regex][stats]                                              │
│  ┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐    │
│   ↻ A failing test or lint error goes straight back to the worker that …     │
│  └ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘    │
├──────────────────────────────────────────────────────────────────────────────┤
│  THE STORY                                                                   │
│  What actually happened                                                      │
│  01 The architect writes the contract    02 Eight workers type in parallel   │
│     Claude wrote the app shell, …           Each Qwen worker, running …      │
│  03 The loop verifies                    04 The architect reviews            │
│     scripts/dispatch.mjs writes …           Passing tests is necessary, …    │
├──────────────────────────────────────────────────────────────────────────────┤
│  BUILD YOUR OWN                                                              │
│  Add a tool in three commands                                                │
│  Any folder under src/tools/ with an index.js shows up …                     │
│  ●1  SCAFFOLD THE FOLDER                                                     │
│      ┃ npm run new-tool -- my-tool "My Tool" "What it does." "*" myFunction  [Copy] │
│  ●2  DISPATCH A WORKER                                                       │
│      ┃ QWEN_URL=http://localhost:8000/v1 QWEN_MODEL=your-model npm run …     [Copy] │
│  ●3  VERIFY                                                                  │
│      ┃ npm test                                                       [Copy] │
│  dispatch talks to any OpenAI-compatible endpoint: vLLM, Ollama, LM Studio.  │
│  Read the worker guide and the specs on GitHub →                             │
├──────────────────────────────────────────────────────────────────────────────┤
│  footer                                                                      │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Mobile wireframe (375px)

```
┌───────────────────────────┐
│ ✦ TwigKit  Tools How… (◐) │
├───────────────────────────┤
│ HOW IT'S BUILT            │
│ One architect, eight      │ 34px
│ workers, and a test …     │
│ TwigKit is a free test …  │
├───────────────────────────┤
│ ┌─────────┐ ┌─────────┐   │ 2×2 figures
│ │ 8       │ │ 89      │   │
│ └─────────┘ └─────────┘   │
│ ┌─────────┐ ┌─────────┐   │
│ │ ~14 s   │ │ 0       │   │
│ └─────────┘ └─────────┘   │
├───────────────────────────┤
│ THE LOOP                  │
│ From spec to shipped tool │
│ ●1 CLAUDE                 │
│ ┃  Architect writes …     │  vertical 2px line on the left,
│ ┃  The shell, the …       │  dots on the line
│ ●2 QWEN × 8               │
│ ┃  Workers implement …    │
│ ┃  [json][base64][time…]  │
│ ●3 VITEST + OXLINT        │
│ ┃  Tests and lint verify  │
│ ●4 CLAUDE                 │
│    Architect reviews …    │
│ ┌ ─ ↻ A failing test … ┐  │
├───────────────────────────┤
│ THE STORY (1 column)      │
├───────────────────────────┤
│ BUILD YOUR OWN            │
│ ●1 SCAFFOLD THE FOLDER    │
│    ┃ npm run new-tool …   │
│    ┃            [Copy]    │  copy button bottom-right on phones
│ …                         │
├───────────────────────────┤
│ footer                    │
└───────────────────────────┘
```

### Copy (exact)

- Eyebrow `How it's built`. H1 `One architect, eight workers, and a test suite between
  them.` Lead `TwigKit is a free test project. A strong model (Claude) designs the
  structure and writes the contracts; a cheaper local model (Qwen) does the bulk typing,
  in parallel, and is held to those contracts by tests. Every spec, prompt and test the
  workers saw is in the repository.`
- Figures: `8` / `tools built by workers`; `89` / `tests, all passing`; `~14 s` / `for a
  full parallel run`; `0` / `bytes uploaded, ever`.
- Loop section: eyebrow `The loop`; title `From spec to shipped tool`. Stations:
  1 `CLAUDE` / `Architect writes specs and tests` / `The shell, the shared UI, one spec
  and one test file per tool.`; 2 `QWEN × 8` / `Workers implement in parallel` / `Each
  worker gets one spec and returns logic.js and Tool.jsx.` + chips `json base64 timestamp
  color uuid diff regex stats`; 3 `VITEST + OXLINT` / `Tests and lint verify` / `89 tests
  and a lint pass, about 14 seconds for the whole set.`; 4 `CLAUDE` / `Architect reviews
  in a browser` / `Passing tests is necessary, not sufficient.` Caption: `A failing test
  or lint error goes straight back to the worker that wrote it, up to three attempts,
  before anything reaches review.`
- Story: eyebrow `The story`; title `What actually happened`; four entries (full text in
  `work/05-about.md`), the last one carrying the anecdote: `Passing tests is necessary,
  not sufficient. The first pass shipped three tools that showed an error before you
  typed anything, which no test caught. The fix went into the worker guide, and those
  tools were re-dispatched.`
- Build: eyebrow `Build your own`; title `Add a tool in three commands`; body `Any folder
  under src/tools/ with an index.js shows up in the tool list automatically. Scaffold it,
  hand the spec to a model (or write it yourself), and let the tests decide.`; commands
  `Scaffold the folder` → `npm run new-tool -- my-tool "My Tool" "What it does." "*"
  myFunction`; `Dispatch a worker` → `QWEN_URL=http://localhost:8000/v1 QWEN_MODEL=your-model
  npm run dispatch -- my-tool`; `Verify` → `npm test`; note `dispatch talks to any
  OpenAI-compatible endpoint: vLLM, Ollama, LM Studio.`; link `Read the worker guide and
  the specs on GitHub →`.

### Section CSS (summary; verbatim in `work/05-about.md`)

| Part | Values |
| --- | --- |
| `.about-hero` | ruled background as Home; inner padding 72px 32px 48px (48px 16px 36px phone); title `clamp(34px, 5vw, 60px)`/1.05 max 18ch; lead `clamp(16px, 1.5vw, 19px)` `--ink-2` max 62ch |
| `.about-section` | max 1120 centred, padding 48px 32px (36px 16px phone), hairline between sections; `h2` `clamp(26px, 3vw, 34px)` margin-bottom 24px; inline `code` on `--well`, radius 3px, 0.92em |
| `.figures` | 4 columns (2 at ≤899), gap 16 (12 phone); card panel/line/radius 6px, padding 18px 20px; numeral 40px serif tabular (32px phone); label 13px muted |
| `.flow-steps` | 4 columns, gap 0; each step `border-top: 2px solid --line-strong`, padding 24px 24px 0 0; number: 28px moss circle, on-moss 12px mono 600, absolute top -15px left 0; who: eyebrow in moss; title 19px serif; text 14px `--ink-2`; workers 4×2 grid gap 4px, chips 10px mono on well with 1px line |
| `.flow-loop` | dashed 1px `--line-strong`, radius 6px, padding 14px 16px, 14px `--ink-2`, loop icon 18px moss; margin-top 28px |
| ≤899 | steps 1 column; step `border-left: 2px`, margin-left 14px, padding 0 0 28px 28px; number at top -2px left -15px; workers grid max 360px |
| `.story-list` | 2 columns gap 32px 48px (1 column ≤699); counters `01`–`04` 12px mono moss at left; title 20px serif; text 15px `--ink-2` |
| `.cmds` | column gap 16px; `.cmd` grid `28px 1fr`; number circle as in flow; label eyebrow; `.cmd-code` well bg, 1px line, 3px moss left edge, radius 6px, 13px mono, padding 12px 100px 12px 14px; copy `.btn` 28px top-right (bottom-right on phones with 44px bottom padding) |

---

## 6. Inline SVG (complete)

Twig mark (brand; also the favicon on a moss `rx=14` square, stroke `#F5F2EA`):

```html
<svg class="brand-mark" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21.5V9"/><path d="M12 13.5c0-3.3 2.4-5.5 5.5-5.5 0 3.3-2.4 5.5-5.5 5.5z"/><path d="M12 18c0-3.3-2.4-5.5-5.5-5.5 0 3.3 2.4 5.5 5.5 5.5z"/><path d="M12 9c0-2.8 1-5 2.5-6.5"/></svg>
```

Favicon (`public/favicon.svg`):

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#35623A"/><g fill="none" stroke="#F5F2EA" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" transform="translate(8 8) scale(2)"><path d="M12 21.5V9"/><path d="M12 13.5c0-3.3 2.4-5.5 5.5-5.5 0 3.3-2.4 5.5-5.5 5.5z"/><path d="M12 18c0-3.3-2.4-5.5-5.5-5.5 0 3.3 2.4 5.5 5.5 5.5z"/><path d="M12 9c0-2.8 1-5 2.5-6.5"/></g></svg>
```

Arrow (links, 16px):

```html
<svg class="icon-arrow" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4"/></svg>
```

Check (trust list, 16px):

```html
<svg class="icon-check" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3.5 8.5l3 3 6-6.5"/></svg>
```

Search (jump box, rendered 18px):

```html
<svg class="jump-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/></svg>
```

Theme icons (16px rendered, 24 viewBox, stroke 1.75, round caps/joins, `aria-hidden`):

```html
<!-- auto: half-filled circle -->
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="8"/><path d="M12 4a8 8 0 0 1 0 16z" fill="currentColor" stroke="none"/></svg>
<!-- light: sun -->
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2.5V5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8"/></svg>
<!-- dark: moon -->
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/></svg>
```

Retry loop (About caption, 18px):

```html
<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12a8 8 0 0 1 13.7-5.7L20 8.5"/><path d="M20 4v4.5h-4.5"/><path d="M20 12a8 8 0 0 1-13.7 5.7L4 15.5"/><path d="M4 20v-4.5h4.5"/></svg>
```

Select chevron (CSS data URI, 12px, stroke `--muted` baked in per theme): see tokens.

---

## 7. Theme toggle and theming rules

- Three states, one button, cycling Auto → Light → Dark → Auto. The button shows the
  current state's icon and label (label hidden in the mobile workspace bar and in the
  site header below 600px). `aria-label`: `Theme: <Current>. Switch to <Next>`.
- Persisted in `localStorage['twigkit-theme']` as `light` or `dark`; Auto removes the key.
  Applied as `<html data-theme="light|dark">`; an inline script in `index.html` applies
  the stored value before first paint, so there is no flash.
- `color-scheme` is set with the tokens so native controls (checkbox, colour picker,
  scrollbars) follow the theme.

## 8. Accessibility checklist

- All text ≥ 4.5:1, UI edges and focus rings ≥ 3:1 (values above).
- Every interactive element has a `:focus-visible` ring in moss; rail items use an inset
  ring so it is not clipped by the sticky rail.
- Skip link first in DOM; every page has `<main id="main" tabindex="-1">`.
- The jump box has a visually hidden `<label>`; the collection count is `aria-live="polite"`.
- Tool tiles are `aria-hidden`; names are always text. `aria-current="page"` on the
  active rail item, chip and header link.
- Reduced motion disables every transition; `hover: none` devices always see card CTAs.
- Touch targets: chips 36px, buttons 36px, theme toggle 32px tall with 10px padding,
  rail rows 38px, cards ≥ 184px.
