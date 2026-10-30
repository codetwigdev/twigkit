# TwigKit

Tiny developer utilities that run entirely in your browser. No backend, no accounts,
nothing leaves your machine.

| Tool | What it does |
| --- | --- |
| JSON Formatter | Format, validate, minify, sort keys |
| Base64 / URL | Encode and decode (UTF-8 safe, URL-safe alphabet) |
| Timestamp | Unix seconds/milliseconds to dates and back |
| Color Converter | hex, rgb and hsl |
| UUID / Random | UUID v4 and random strings from `crypto` |
| Text Diff | Line-by-line diff |
| Regex Tester | Live match highlighting, capture groups |
| Text Stats | Counts, reading time, case conversion |
| Slugify | Title to URL slug |

```bash
npm install
npm run dev      # http://localhost:5173
npm test
npm run build
```

## Why this repo exists

TwigKit is a free test project for a **Claude-as-architect, Qwen-as-workers** workflow.
A strong model designs the structure and the contracts; a cheaper local model does the
bulk typing, in parallel, and is held to those contracts by tests.

1. **The architect** (Claude) wrote the shell, the shared UI, the tool contract, a
   reference tool, a spec per tool, and the tests.
2. **The workers** (Qwen, 8 in parallel against a local vLLM server) each implemented one
   tool: `logic.js` and `Tool.jsx`.
3. **The loop** (`scripts/dispatch.mjs`) writes the files, runs that tool's tests and
   lint, and feeds failures back to the worker for another try.
4. **The architect reviews** the integrated result in a real browser. Passing tests is
   necessary, not sufficient: the first pass shipped three tools that showed an error
   before you typed anything, which no test caught. The fix went into the
   [worker guide](docs/WORKER_GUIDE.md), then those tools were re-dispatched.

Everything the workers saw is in this repo: [`docs/WORKER_GUIDE.md`](docs/WORKER_GUIDE.md),
[`docs/specs/`](docs/specs), and each tool's `logic.test.js`.

### The redesign: a project-manager round

The site you are looking at (the "Field notes" look, the home page, the workspace shell
and the About page) was made with a second pass of the same idea, with the architect
acting as **project manager**:

1. The PM wrote a [design brief](docs/design/BRIEF.md) with hard constraints: no new
   dependencies, no external requests, and the nine tool components untouched.
2. A top-tier model (Claude Fable 5.1) was commissioned as **lead designer**. It wrote the
   [design spec](docs/design/DESIGN.md) and seven self-contained
   [work packages](docs/design/work), each owning its own files, plus a shared contracts
   file.
3. Seven Qwen workers built the packages in parallel (about 40 seconds for all of them).
   `scripts/team.mjs` runs them, then verifies the whole project (build, tests, lint) and
   sends failures back to the worker whose files they mention.
4. The PM reviewed the result in a browser at desktop, dark and phone widths, and sent
   revision notes. One lesson is written into the [team guide](docs/TEAM_GUIDE.md):
   packages are the baseline each round, so revision notes must be cumulative.

## Anatomy of a tool

```
src/tools/<id>/
  index.js        metadata + lazy component (architect)
  logic.js        pure functions, no React (worker)
  logic.test.js   the contract (architect)
  Tool.jsx        UI wiring only (worker)
```

Any folder under `src/tools/` with an `index.js` shows up in the sidebar automatically.

## Add your own tool

```bash
npm run new-tool -- my-tool "My Tool" "What it does." "*" myFunction
```

That creates the stubs. Write `logic.test.js` first, then fill in `logic.js` and
`Tool.jsx` yourself, or write `docs/specs/my-tool.md` and let a model do it:

```bash
QWEN_URL=http://localhost:8000/v1 QWEN_MODEL=your-model npm run dispatch -- my-tool
```

`dispatch` talks to any OpenAI-compatible endpoint (vLLM, Ollama, LM Studio...).
Defaults: `QWEN_URL=http://localhost:8000/v1`, `QWEN_MODEL=Qwen3.8`, `WORKERS=8`,
`ATTEMPTS=3`.

## Build pages with a team

For larger work than a single tool, write work packages in `docs/design/work/` (each a
Markdown file with a `files:` front matter listing the files it owns) and run them:

```bash
npm run team                       # every package
npm run team -- 04 05              # only packages starting with 04 and 05
npm run team -- 05 --notes n.md    # revision round (notes must be cumulative)
```

`team` uses the same endpoint settings as `dispatch`. Set `ASK_QWEN_HOST=<ssh-host>` to
sync the repo to a machine that has an `ask-qwen` command and run the workers there
instead. Packages must not share files; the runner refuses to start if two do.

## License

MIT
