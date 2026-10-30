---
files:
  - src/pages/About.jsx
  - src/pages/About.css
---

# 05 — "How it's built" page

> Changed in v1.1: figures and copy derive every count from the registries; the story has
> six entries and covers the redesign and the second build; `FlowDiagram` moved to
> package 14 (it is imported here, not written here); a short "write an article" note
> joins the "build your own" section.

You own the About page (route `#/about`): a hero, four key figures, the build-loop
diagram (rendered from another package), a six-part story, a "build your own" section
with three commands, and the footer slot.

Other packages provide `SiteHeader`, `Footer` (`src/ui/chrome/*.jsx`), `FlowDiagram`
(`src/pages/FlowDiagram.jsx`), `src/catalog.js` (`WORKER_TOOLS`), the articles registry
(`src/articles/registry.js`, exports `articles`) and global tokens and base styles.
`src/registry.js` exports `tools`. `src/ui/CopyButton.jsx` already exists:
`<CopyButton text="..." />` renders `<button class="btn">Copy</button>`.

Visual idea: warm paper, a serif headline, one green accent ("moss"), hairlines.
**Never write a count or a timing as a literal**; every number on this page is computed.

## File 1: `src/pages/About.jsx`

```jsx
import { tools } from '../registry.js'
import { WORKER_TOOLS } from '../catalog.js'
import { articles } from '../articles/registry.js'
import SiteHeader from '../ui/chrome/SiteHeader.jsx'
import Footer from '../ui/chrome/Footer.jsx'
import CopyButton from '../ui/CopyButton.jsx'
import FlowDiagram from './FlowDiagram.jsx'
import './About.css'

const REPO_URL = 'https://github.com/codetwigdev/twigkit'

const COMMANDS = [
  {
    label: 'Scaffold the folder',
    cmd: 'npm run new-tool -- my-tool "My Tool" "What it does." "*" myFunction',
  },
  {
    label: 'Dispatch a worker',
    cmd: 'QWEN_URL=http://localhost:8000/v1 QWEN_MODEL=your-model npm run dispatch -- my-tool',
  },
  { label: 'Verify', cmd: 'npm test' },
]

function Arrow() {
  return (
    <svg className="icon-arrow" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  )
}

export default function About() {
  const figures = [
    { value: String(tools.length), label: 'tools in the kit' },
    { value: String(WORKER_TOOLS.length), label: 'of them typed by Qwen workers' },
    { value: String(articles.length), label: 'articles, written the same way' },
    { value: '0', label: 'bytes uploaded, ever' },
  ]

  return (
    <div className="about">
      <SiteHeader current="about" />
      <main id="main" tabIndex={-1}>
        <section className="about-hero">
          <div className="about-hero-inner">
            <p className="eyebrow">How it's built</p>
            <h1 className="about-title">One architect, a team of workers, and a test suite between them.</h1>
            <p className="about-lead">
              TwigKit is a free test project. A strong model (Claude) designs the structure
              and writes the contracts; a cheaper local model (Qwen) does the bulk typing, in
              parallel, and is held to those contracts by tests. Every spec, prompt and test
              the workers saw is in the repository.
            </p>
          </div>
        </section>

        <section className="about-section" aria-label="Key figures">
          <ul className="figures">
            {figures.map((f) => (
              <li key={f.label} className="figure">
                <b>{f.value}</b>
                <span>{f.label}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="about-section" aria-labelledby="loop-title">
          <p className="eyebrow">The loop</p>
          <h2 className="about-h2" id="loop-title">
            From spec to shipped tool
          </h2>
          <FlowDiagram />
        </section>

        <section className="about-section" aria-labelledby="story-title">
          <p className="eyebrow">The story</p>
          <h2 className="about-h2" id="story-title">
            What actually happened
          </h2>
          <ol className="story-list">
            <li className="story-item">
              <h3>The architect writes the contract</h3>
              <p>
                Claude wrote the app shell, the shared UI, the tool contract, one reference
                tool (Slugify), a spec per tool and a test file per tool. The tests are the
                source of truth for what each function must return.
              </p>
            </li>
            <li className="story-item">
              <h3>Workers type in parallel</h3>
              <p>
                Each Qwen worker, running against a local vLLM server, receives one spec and
                one test file and returns two files: <code>logic.js</code> (pure functions)
                and <code>Tool.jsx</code> (UI wiring). It never sees the other tools.
              </p>
            </li>
            <li className="story-item">
              <h3>The loop verifies</h3>
              <p>
                <code>scripts/dispatch.mjs</code> and <code>scripts/team.mjs</code> write the
                files, run the tests, build and lint, and send any failure back to the worker
                that wrote it for another attempt, before anything reaches review.
              </p>
            </li>
            <li className="story-item">
              <h3>The architect reviews</h3>
              <p>
                Passing tests is necessary, not sufficient. The first pass shipped three
                tools that showed an error before you typed anything, which no test caught.
                The fix went into the worker guide, and those tools were re-dispatched.
              </p>
            </li>
            <li className="story-item">
              <h3>The site gets a design</h3>
              <p>
                The first version looked like a default template. A designer model wrote a
                design document and split it into work packages, one file set each; a team
                of Qwen workers built the packages in parallel, and the architect reviewed
                the result in a browser. This page is one of those packages.
              </p>
            </li>
            <li className="story-item">
              <h3>The kit grows</h3>
              <p>
                New tools and the articles were added the same way: scaffold a folder, write
                the spec and the tests, dispatch a worker, let the tests decide. Nothing
                about the method changed; only the number of folders did.
              </p>
            </li>
          </ol>
        </section>

        <section className="about-section" aria-labelledby="build-title">
          <p className="eyebrow">Build your own</p>
          <h2 className="about-h2" id="build-title">
            Add a tool in three commands
          </h2>
          <p className="build-text">
            Any folder under <code>src/tools/</code> with an <code>index.js</code> shows up in
            the tool list automatically. Scaffold it, hand the spec to a model (or write it
            yourself), and let the tests decide.
          </p>
          <ol className="cmds">
            {COMMANDS.map((c, i) => (
              <li key={c.label} className="cmd">
                <span className="cmd-num" aria-hidden="true">{i + 1}</span>
                <span className="cmd-label">{c.label}</span>
                <pre className="cmd-code">
                  {c.cmd}
                  <CopyButton text={c.cmd} />
                </pre>
              </li>
            ))}
          </ol>
          <p className="build-note">
            dispatch talks to any OpenAI-compatible endpoint: vLLM, Ollama, LM Studio.
          </p>
          <p className="build-note">
            Articles work the same way: a module under <code>src/articles/</code> with a
            default export is an article. See <a href="#/articles">the notebook</a>.
          </p>
          <a className="build-link" href={REPO_URL}>
            Read the worker guide and the specs on GitHub <Arrow />
          </a>
        </section>
      </main>
      <Footer />
    </div>
  )
}
```

## File 2: `src/pages/About.css`

Write exactly:

```css
.about main:focus {
  outline: none;
}

/* ----- hero ----- */
.about-hero {
  border-bottom: 1px solid var(--line);
  background-image: repeating-linear-gradient(to bottom, transparent 0 31px, var(--rule) 31px 32px);
}
.about-hero-inner {
  max-width: var(--page-max);
  margin: 0 auto;
  padding: 72px 32px 48px;
}
.about-hero .eyebrow {
  color: var(--moss);
  margin: 0 0 16px;
}
.about-title {
  font-size: clamp(34px, 5vw, 60px);
  line-height: 1.05;
  letter-spacing: -0.02em;
  max-width: 20ch;
  margin: 0 0 20px;
}
.about-lead {
  font-size: clamp(16px, 1.5vw, 19px);
  line-height: 1.5;
  color: var(--ink-2);
  max-width: 62ch;
  margin: 0;
}

/* ----- sections ----- */
.about-section {
  max-width: var(--page-max);
  margin: 0 auto;
  padding: 48px 32px;
}
.about-section + .about-section {
  border-top: 1px solid var(--line);
}
.about-section .eyebrow {
  margin: 0 0 8px;
}
.about-h2 {
  font-size: clamp(26px, 3vw, 34px);
  line-height: 1.15;
  margin: 0 0 24px;
}
.about code {
  font-size: 0.92em;
  padding: 1px 5px;
  border-radius: var(--r-1);
  background: var(--well);
  color: var(--ink);
}

/* ----- figures ----- */
.figures {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}
.figure {
  padding: 18px 20px;
  border: 1px solid var(--line);
  border-radius: var(--r-2);
  background: var(--panel);
}
.figure b {
  display: block;
  margin: 0 0 8px;
  font: 400 40px/1 var(--font-display);
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.02em;
  color: var(--ink);
}
.figure span {
  font-size: 13px;
  color: var(--muted);
}

/* ----- story ----- */
.story-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px 48px;
  counter-reset: story;
}
.story-item {
  position: relative;
  padding-left: 44px;
}
.story-item::before {
  counter-increment: story;
  content: counter(story, decimal-leading-zero);
  position: absolute;
  left: 0;
  top: 5px;
  font: 500 12px/1 var(--font-mono);
  letter-spacing: 0.08em;
  color: var(--moss);
}
.story-item h3 {
  font-size: 20px;
  line-height: 1.2;
  margin: 0 0 8px;
}
.story-item p {
  margin: 0;
  font-size: 15px;
  line-height: 1.55;
  color: var(--ink-2);
}

/* ----- build your own ----- */
.build-text {
  font-size: 16px;
  line-height: 1.55;
  color: var(--ink-2);
  max-width: 60ch;
  margin: 0 0 24px;
}
.cmds {
  list-style: none;
  margin: 0 0 20px;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.cmd {
  display: grid;
  grid-template-columns: 28px 1fr;
  grid-template-rows: auto auto;
  gap: 6px 16px;
  align-items: start;
}
.cmd-num {
  grid-row: 1 / 3;
  grid-column: 1;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--moss);
  color: var(--on-moss);
  font: 600 12px/28px var(--font-mono);
  text-align: center;
}
.cmd-label {
  grid-row: 1;
  grid-column: 2;
  font: 500 11px/1 var(--font-mono);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--muted);
  padding-top: 2px;
}
.cmd-code {
  grid-row: 2;
  grid-column: 2;
  position: relative;
  margin: 0;
  padding: 12px 100px 12px 14px;
  border: 1px solid var(--line);
  border-left: 3px solid var(--moss);
  border-radius: var(--r-2);
  background: var(--well);
  color: var(--ink);
  font: 13px/1.6 var(--font-mono);
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}
.cmd-code .btn {
  position: absolute;
  top: 8px;
  right: 8px;
  min-height: 28px;
  padding: 3px 10px;
  font-size: 12px;
}
.build-note {
  margin: 0 0 12px;
  font-size: 14px;
  line-height: 1.5;
  color: var(--muted);
  max-width: 62ch;
}
.build-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 8px;
  font-size: 15px;
  font-weight: 500;
  color: var(--moss-ink);
  text-decoration: none;
}
.build-link .icon-arrow {
  transition: transform var(--t-fast) var(--ease-out);
}
.build-link:hover .icon-arrow {
  transform: translateX(3px);
}

/* ----- responsive ----- */
@media (max-width: 899px) {
  .figures {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 699px) {
  .story-list {
    grid-template-columns: 1fr;
    gap: 28px;
  }
}
@media (max-width: 599px) {
  .about-hero-inner {
    padding: 48px 16px 36px;
  }
  .about-section {
    padding: 36px 16px;
  }
  .figures {
    gap: 12px;
  }
  .figure b {
    font-size: 32px;
  }
  .cmd-code {
    padding-right: 14px;
    padding-bottom: 44px;
  }
  .cmd-code .btn {
    top: auto;
    bottom: 8px;
  }
}
```

## How to tell it is right

- `#/about` at 1280px: header with "How it's built" underlined green; a hero on faintly
  ruled paper: green "HOW IT'S BUILT", serif headline "One architect, a team of workers,
  and a test suite between them.", grey lead.
- Four figure cards in a row: big serif `17`, `16`, the number of article modules (for
  example `8`, or `0` before the articles are written), `0`; small grey labels `tools in
  the kit`, `of them typed by Qwen workers`, `articles, written the same way`, `bytes
  uploaded, ever`. Add a tool folder and the first two numbers go up by one without
  touching this file.
- "THE LOOP / From spec to shipped tool": the diagram from package 14.
- "THE STORY": six numbered (`01`–`06`, green monospace) entries in two columns (three
  rows), one column on phones; `logic.js` etc. render as inline code on a darker beige
  chip.
- "BUILD YOUR OWN": three command blocks with green numbered dots, uppercase labels, a
  green left edge and a Copy button that reads "Copied" for a second after clicking
  (`npm test` copies exactly `npm test`); two grey notes below, the second linking "the
  notebook" to `#/articles`. On phones the Copy button moves to the bottom right of the
  block.
- `grep -n "[0-9]" src/pages/About.jsx` shows no count or timing written as a literal
  (only `'0'` for bytes uploaded, the vLLM port in the command, and `i + 1`).
- Footer at the bottom. Dark mode shows green-black paper and pale green accents.
