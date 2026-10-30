---
files:
  - src/pages/FlowDiagram.jsx
  - src/pages/FlowDiagram.css
---

# 14 — Build-loop diagram

You own the diagram on the "How it's built" page: four stations on one continuous 2px
rule with numbered green dots, which becomes a vertical timeline on phones. The About
page (another package) renders `<FlowDiagram />` inside a section headed "From spec to
shipped tool".

Other packages provide `ToolTile` (`src/ui/chrome/ToolTile.jsx`) and `src/catalog.js`
(`WORKER_TOOLS`: every tool except the architect-written Slugify). Import them by path
even if they do not exist yet. No count is written as a literal: the number of workers is
`WORKER_TOOLS.length`, and station 2 shows one small glyph tile per worker tool.

Visual idea: warm paper, serif titles, one green accent ("moss"), a 2px beige rule,
tiny uppercase "who" labels.

## File 1: `src/pages/FlowDiagram.jsx`

```jsx
import { WORKER_TOOLS } from '../catalog.js'
import ToolTile from '../ui/chrome/ToolTile.jsx'
import './FlowDiagram.css'

export default function FlowDiagram() {
  return (
    <figure className="flow">
      <ol className="flow-steps">
        <li className="flow-step">
          <span className="flow-num" aria-hidden="true">1</span>
          <span className="flow-who">Claude</span>
          <h3 className="flow-title">Architect writes specs and tests</h3>
          <p className="flow-text">The shell, the shared UI, one spec and one test file per tool.</p>
        </li>
        <li className="flow-step">
          <span className="flow-num" aria-hidden="true">2</span>
          <span className="flow-who">Qwen × {WORKER_TOOLS.length}</span>
          <h3 className="flow-title">Workers implement in parallel</h3>
          <p className="flow-text">Each worker gets one spec and returns logic.js and Tool.jsx.</p>
          <ul className="flow-workers" aria-label={`${WORKER_TOOLS.length} tools, one worker each`}>
            {WORKER_TOOLS.map((t) => (
              <li key={t.id} title={t.name}>
                <ToolTile glyph={t.icon} size="sm" />
                <span className="visually-hidden">{t.name}</span>
              </li>
            ))}
          </ul>
        </li>
        <li className="flow-step">
          <span className="flow-num" aria-hidden="true">3</span>
          <span className="flow-who">vitest + oxlint</span>
          <h3 className="flow-title">Tests and lint verify</h3>
          <p className="flow-text">One test file per tool, plus lint and a build. A failure goes back to the worker.</p>
        </li>
        <li className="flow-step">
          <span className="flow-num" aria-hidden="true">4</span>
          <span className="flow-who">Claude</span>
          <h3 className="flow-title">Architect reviews in a browser</h3>
          <p className="flow-text">Passing tests is necessary, not sufficient.</p>
        </li>
      </ol>
      <figcaption className="flow-loop">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M4 12a8 8 0 0 1 13.7-5.7L20 8.5" />
          <path d="M20 4v4.5h-4.5" />
          <path d="M20 12a8 8 0 0 1-13.7 5.7L4 15.5" />
          <path d="M4 20v-4.5h4.5" />
        </svg>
        <span>
          A failing test or lint error goes straight back to the worker that wrote it, up to
          three attempts, before anything reaches review.
        </span>
      </figcaption>
    </figure>
  )
}
```

## File 2: `src/pages/FlowDiagram.css`

Write exactly:

```css
.flow {
  margin: 0;
}
.flow-steps {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0;
}
.flow-step {
  position: relative;
  padding: 24px 24px 0 0;
  border-top: 2px solid var(--line-strong);
}
.flow-num {
  position: absolute;
  top: -15px;
  left: 0;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--moss);
  color: var(--on-moss);
  font: 600 12px/28px var(--font-mono);
  text-align: center;
}
.flow-who {
  display: inline-block;
  margin: 0 0 8px;
  font: 500 11px/1 var(--font-mono);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--moss);
}
.flow-title {
  font-size: 19px;
  line-height: 1.2;
  margin: 0 0 6px;
}
.flow-text {
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
  color: var(--ink-2);
}
.flow-workers {
  list-style: none;
  margin: 12px 0 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  max-width: 240px;
}
.flow-workers li {
  display: inline-flex;
}
.flow-loop {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin: 28px 0 0;
  padding: 14px 16px;
  border: 1px dashed var(--line-strong);
  border-radius: var(--r-2);
  font-size: 14px;
  line-height: 1.5;
  color: var(--ink-2);
}
.flow-loop svg {
  flex: 0 0 18px;
  margin-top: 2px;
  color: var(--moss);
}

@media (max-width: 899px) {
  .flow-steps {
    grid-template-columns: 1fr;
  }
  .flow-step {
    margin-left: 14px;
    padding: 0 0 28px 28px;
    border-top: 0;
    border-left: 2px solid var(--line-strong);
  }
  .flow-step:last-child {
    padding-bottom: 4px;
  }
  .flow-num {
    top: -2px;
    left: -15px;
  }
  .flow-workers {
    max-width: 360px;
  }
}
```

## How to tell it is right

- `#/about` at 1280px, under "THE LOOP / From spec to shipped tool": four columns sharing
  one continuous 2px line along the top with green numbered dots 1–4 sitting on it.
  Column 2 is labelled `QWEN × 16` (the number of tools minus Slugify, derived) and holds
  a wrapped row of 16 small square glyph tiles (`64`, `##`, `&;` …), each with the tool
  name as a tooltip; below, a dashed box with a green loop icon and the retry sentence.
- Add a tool folder: the label becomes `QWEN × 17` and a tile appears, with no edit here.
- At 375px the diagram is a vertical timeline: a 2px line on the left, dots on the line,
  the steps stacked beneath each other with no horizontal scroll.
- `npm test` passes.
