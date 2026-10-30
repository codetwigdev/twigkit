# Design brief: TwigKit

From: project manager. To: lead designer.

## The product

TwigKit is a free, open-source set of small developer utilities (JSON formatter,
Base64/URL, timestamps, color converter, UUIDs, text diff, regex tester, text stats,
slugify) that run entirely in the browser. Nothing is uploaded; there is no backend and
no account. It is published by CodeTwig as a free test project. It is also the showcase
for a workflow: a Claude model architects, a local Qwen model implements.

Audience: developers who open a tab to do a 20-second job and want it to feel
effortless, plus people evaluating the CodeTwig brand from the GitHub link.

## What we want

Really beautiful. A distinctive point of view, not a generic dev-tool template. Avoid the
default tropes: purple-to-blue gradients, glassmorphism, generic bento grids, stock
dark-mode neon. Calm, crafted, confident. "Tiny tools, done beautifully." Pick a clear
concept and commit to it: palette, type, spacing, shape language, motion, and the small
details (focus rings, empty states, hover states, selection color, scrollbars).

## Pages to design

1. **Home** (route `#/`). The first impression. Hero with the promise, a way to jump
   into any tool at once, the tool collection presented as something you want to click,
   a short "how it's built" teaser that links to page 3, and a footer.
2. **Tool workspace** (route `#/<tool-id>`). The chrome around every tool: navigation,
   tool title and description, the content area, and how a tool sits on the page. This
   is where people spend their time, so it must be fast, legible and calm. Includes the
   styling of every shared building block listed below.
3. **How it's built** (route `#/about`). Tells the story: architect writes specs and
   tests, Qwen workers implement in parallel, tests and lint verify, architect reviews.
   Include a visual diagram of that flow made of HTML/CSS or inline SVG (no images, no
   libraries), the real numbers (8 tools, 89 tests, ~14 second parallel run), and a
   "build your own tool" section with the three commands from the README.

All three pages must work as light and dark themes and from 375px phones to wide desktops.

## Hard constraints (implementation team is a mid-size model working from your spec)

- Stack: React 19, plain CSS files. No new npm dependencies, no CSS framework, no icon
  library, no animation library.
- **No external requests of any kind**: no Google Fonts, no CDN, no remote images. Use
  system font stacks (you may choose any stack and get character from weight, size,
  tracking, and a monospace for tool I/O). Icons are inline SVG you specify exactly.
- WCAG AA contrast, visible keyboard focus, respects `prefers-reduced-motion` and
  `prefers-color-scheme` (a manual theme toggle is welcome if you specify it).
- **The nine existing tool components must not be edited.** They already use these
  class names, so you restyle them purely through CSS:
  `.field` (with a `label` or `.label` child), `.row`, `.grid-2`, `.btn`, `.btn.primary`,
  `.out` (a `pre` containing text plus a `.btn` copy button), `.error`, `.stat-grid`,
  `.stat` (contains a `b` for the number), `.diff-line`, `.diff-add`, `.diff-remove`,
  `.swatch`, `.muted`, plus bare `textarea`, `input`, `select`, `mark`, `h2`.
  Native `<input type="checkbox">` and `<input type="color">` also appear.
- Tool metadata available to the UI: `id`, `name`, `description`, `icon` (a 1-2 character
  text glyph such as `64`, `{}`, `.*`, `Aa`, `#`, `+-`, `t`, `?`, `/`). You may style
  the glyph as a tile; you may not rely on any other metadata.
- Routing is hash based (`#/`, `#/about`, `#/<tool-id>`). Unknown hash shows Home.

## Deliverables

Write everything under `docs/design/`. Do **not** edit anything in `src/`.

1. `docs/design/DESIGN.md`: the concept in a paragraph, then exact specs:
   - Design tokens as a complete CSS custom-property block for light and dark.
   - Type scale, spacing scale, radii, shadows, motion durations and easing.
   - For each page: desktop and mobile wireframes in ASCII, the exact copy (real
     headlines and microcopy, not lorem ipsum), and section-by-section CSS values.
   - Every shared building block's states: default, hover, focus, active, disabled,
     error, empty.
   - Inline SVGs written out in full where used.
2. `docs/design/work/NN-name.md`: **work packages** for the implementation team. See below.

## Work packages (this is how the design becomes code)

The implementers are Qwen models working in parallel, up to 8 at once, one package each.
Each package is a standalone instruction sheet written so that someone who has not read
`DESIGN.md` can build it correctly. Rules:

- Each package begins with a front-matter block listing the files it **owns**:

  ```
  ---
  files:
    - src/styles/tokens.css
    - src/styles/base.css
  ---
  ```

- No two packages own the same file. Packages never edit files they do not own.
- Each package contains the exact values it needs (copy the relevant tokens and CSS
  values into it, do not say "see DESIGN.md"), the exact copy text, the component's props
  and structure, and the class names to use.
- Shared contracts (class names, component names, import paths) between packages must be
  stated identically in every package that touches them. Define them once in a
  `docs/design/work/00-contracts.md` that is prepended to every package automatically.
- Suggested split (adjust as the design needs, but keep it to 8 packages or fewer):
  global tokens and base styles; shared tool-building-block styles; app shell and
  navigation (`src/App.jsx` and its CSS and any shell components); Home page; About
  page; footer and theme toggle; and anything else the design demands.
- Prefer many small files over one large one. Each package should be doable in a single
  response of roughly 400 lines or fewer of output.
- State, per package, how to tell it is right (what to look for on screen).

The project manager will review the design, then run the packages. Make the spec so
precise that nothing is left to the implementers' taste.
