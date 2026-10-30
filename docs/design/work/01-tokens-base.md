---
files:
  - src/index.css
  - src/styles/tokens.css
  - src/styles/base.css
---

# 01 — Design tokens and base styles

You own the global foundation: the colour/type/spacing tokens for light and dark, the
reset, typography defaults, selection colour, scrollbars, focus rings, reduced motion.
Everything else in the app is built on these variable names, so copy them exactly.

The visual idea: a warm sheet of paper with ink-black text, one accent ("moss" green),
hairline rules, a serif for headings and a monospace for anything a developer reads or
types. Dark mode is the same sheet at night: green-black paper, warm off-white ink.

## File 1: `src/index.css`

Replace the whole file with exactly:

```css
@import './styles/tokens.css';
@import './styles/base.css';
@import './styles/blocks.css';
```

(`blocks.css` is written by another package. It is fine if it does not exist yet.)

## File 2: `src/styles/tokens.css`

Write exactly this file:

```css
/* TwigKit design tokens. Light is the default; dark applies when the system prefers it
   (unless <html data-theme="light">) or when <html data-theme="dark"> is set. */
:root {
  color-scheme: light;

  /* surfaces */
  --paper: #F5F2EA;
  --panel: #FDFBF6;
  --well: #ECE8DC;

  /* ink */
  --ink: #1C1B17;
  --ink-2: #4A4840;
  --muted: #625F55;

  /* lines */
  --line: #D8D2C4;
  --line-strong: #B4AD9C;
  --rule: rgba(28, 27, 23, 0.07);

  /* moss: the one accent */
  --moss: #35623A;
  --moss-ink: #24472A;
  --moss-soft: #DCE7D6;
  --on-moss: #FFFFFF;

  /* clay: errors */
  --clay: #A1402B;
  --clay-soft: #F3DCD4;

  /* highlights */
  --marker: #F3E27A;
  --diff-add: #DCEBD2;
  --diff-remove: #F3D9D2;
  --selection: #CFE0C6;

  /* select chevron (data URI, stroke = --muted) */
  --chevron: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12' fill='none' stroke='%23625F55' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M2.5 4.5 6 8l3.5-3.5'/%3E%3C/svg%3E");

  /* type */
  --font-display: 'Iowan Old Style', 'Palatino Linotype', Palatino, 'Book Antiqua', Georgia, 'Times New Roman', serif;
  --font-body: system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  --font-mono: ui-monospace, 'Cascadia Mono', 'SF Mono', Menlo, Consolas, 'DejaVu Sans Mono', monospace;

  /* radii */
  --r-1: 3px;
  --r-2: 6px;
  --r-3: 10px;
  --r-pill: 999px;

  /* shadows (used sparingly: cards on hover, the mobile sheet) */
  --shadow-card: 0 1px 2px rgba(28, 27, 23, 0.06);
  --shadow-sheet: 0 12px 32px rgba(28, 27, 23, 0.18);

  /* motion */
  --t-fast: 120ms;
  --t-base: 180ms;
  --t-slow: 320ms;
  --ease-out: cubic-bezier(0.2, 0.7, 0.2, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);

  /* layout */
  --rail-w: 248px;
  --content-max: 880px;
  --page-max: 1120px;
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme='light']) {
    color-scheme: dark;
    --paper: #141613;
    --panel: #1C1F1B;
    --well: #0E100E;
    --ink: #ECE8DC;
    --ink-2: #C6C1B3;
    --muted: #9A978B;
    --line: #2E322C;
    --line-strong: #4A4F47;
    --rule: rgba(236, 232, 220, 0.06);
    --moss: #8FC78B;
    --moss-ink: #B5DDB1;
    --moss-soft: #1F2E20;
    --on-moss: #0D1A0F;
    --clay: #E59A86;
    --clay-soft: #3A1F19;
    --marker: #6E5A14;
    --diff-add: #1E3320;
    --diff-remove: #3B211C;
    --selection: #2F4A31;
    --chevron: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12' fill='none' stroke='%239A978B' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M2.5 4.5 6 8l3.5-3.5'/%3E%3C/svg%3E");
    --shadow-card: 0 1px 2px rgba(0, 0, 0, 0.4);
    --shadow-sheet: 0 12px 32px rgba(0, 0, 0, 0.6);
  }
}

:root[data-theme='dark'] {
  color-scheme: dark;
  --paper: #141613;
  --panel: #1C1F1B;
  --well: #0E100E;
  --ink: #ECE8DC;
  --ink-2: #C6C1B3;
  --muted: #9A978B;
  --line: #2E322C;
  --line-strong: #4A4F47;
  --rule: rgba(236, 232, 220, 0.06);
  --moss: #8FC78B;
  --moss-ink: #B5DDB1;
  --moss-soft: #1F2E20;
  --on-moss: #0D1A0F;
  --clay: #E59A86;
  --clay-soft: #3A1F19;
  --marker: #6E5A14;
  --diff-add: #1E3320;
  --diff-remove: #3B211C;
  --selection: #2F4A31;
  --chevron: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12' fill='none' stroke='%239A978B' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M2.5 4.5 6 8l3.5-3.5'/%3E%3C/svg%3E");
  --shadow-card: 0 1px 2px rgba(0, 0, 0, 0.4);
  --shadow-sheet: 0 12px 32px rgba(0, 0, 0, 0.6);
}
```

The dark block appears twice on purpose (once for system preference, once for the manual
override). Keep both identical.

## File 3: `src/styles/base.css`

Write exactly this file:

```css
*,
*::before,
*::after {
  box-sizing: border-box;
}

html {
  -webkit-text-size-adjust: 100%;
  scroll-behavior: smooth;
  scrollbar-width: thin;
  scrollbar-color: var(--line-strong) transparent;
}

body {
  margin: 0;
  background: var(--paper);
  color: var(--ink);
  font: 15px/1.55 var(--font-body);
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

::selection {
  background: var(--selection);
  color: var(--ink);
}

::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: var(--line-strong);
  border: 3px solid transparent;
  border-radius: var(--r-pill);
  background-clip: padding-box;
}

h1,
h2,
h3,
h4 {
  margin: 0;
  font-family: var(--font-display);
  font-weight: 400;
  color: var(--ink);
  letter-spacing: -0.01em;
}

/* Bare h2 is the section heading inside a tool ("Unix to date", "UUID v4") and in prose. */
h2 {
  font-size: 20px;
  line-height: 1.2;
  margin: 28px 0 10px;
}
h2:first-child {
  margin-top: 0;
}
h3 {
  font-size: 17px;
  line-height: 1.25;
}

p {
  margin: 0 0 12px;
}

a {
  color: var(--moss-ink);
  text-decoration: underline;
  text-decoration-color: var(--line-strong);
  text-decoration-thickness: 1px;
  text-underline-offset: 3px;
  transition: text-decoration-color var(--t-fast) var(--ease-out);
}
a:hover {
  text-decoration-color: currentColor;
}

:focus-visible {
  outline: 2px solid var(--moss);
  outline-offset: 2px;
}
:focus:not(:focus-visible) {
  outline: none;
}

button,
input,
select,
textarea {
  font: inherit;
  color: inherit;
}

code,
kbd,
pre {
  font-family: var(--font-mono);
}

.muted {
  color: var(--muted);
}

/* Small uppercase monospace label: "THE COLLECTION", "TOOL 03 OF 09". */
.eyebrow {
  font: 500 11px/1 var(--font-mono);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--muted);
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
  border: 0;
}

.skip-link {
  position: absolute;
  left: 16px;
  top: -56px;
  z-index: 100;
  padding: 8px 12px;
  background: var(--moss);
  color: var(--on-moss);
  border-radius: var(--r-1);
  font-size: 14px;
  text-decoration: none;
}
.skip-link:focus {
  top: 16px;
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## How to tell it is right

- `npm run dev` starts and the page background is warm off-white `#F5F2EA` (not pure
  white) with near-black text; with the OS in dark mode it is green-black `#141613`
  with warm off-white text.
- Selecting text shows a pale green selection, not the browser blue.
- Tabbing to any link shows a 2px green outline offset 2px from the element.
- Headings render in a serif (Palatino/Georgia family), body in the system sans.
- Scrollbars are thin and grey-beige, no track colour.
- `npm test` still passes (no tool files were touched).
