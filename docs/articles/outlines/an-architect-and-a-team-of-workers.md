# Outline: An architect and a team of workers

slug `an-architect-and-a-team-of-workers` · title `An architect and a team of workers` · tags `workflow`, `ai` · no tool
Summary (use as the base): How TwigKit is built: a strong model designs, a local model types, tests decide.

## Facts you may use (this is the story of this very project)

- TwigKit is a free set of small browser tools. It is also a test of a workflow: a strong
  model (Claude) is the architect and project manager; a local open-weights model (Qwen,
  served on the author's own GPU machine with vLLM) does most of the typing.
- **Round one:** the architect wrote the app shell, the shared UI, a tool contract, one
  reference tool, a short spec per tool, and a test file per tool. Eight Qwen workers ran
  in parallel, one tool each. Each wrote two files: `logic.js` (pure functions) and
  `Tool.jsx` (UI wiring). A script wrote their files, ran that tool's tests and lint, and
  sent any failure back.
- All eight passed on the first attempt. The architect then opened the real pages in a
  browser and found three tools that showed an error before you typed anything. No test
  caught it. The fix went into the worker guide and those three were re-run.
- **Round two (the redesign):** the architect acted as project manager. A top-tier model
  was commissioned as lead designer and wrote a design spec plus seven self-contained work
  packages, each owning its own files. Seven Qwen workers built them in parallel in under a
  minute; the build, tests and lint passed on the first pass. The architect reviewed it in
  a browser at desktop, dark and phone sizes and sent revision notes.
- **Round three (this expansion):** eight more tools and these articles. On the first
  pass four of the eight failed something (the JWT decoder did not even build). The
  runner sent each failure back to its worker, and three were fixed within two rounds.
  The cron explainer, the hardest, was still failing after two rounds (it rejected steps
  like `*/15` and was off by one on weekdays), so it was re-run with Qwen's thinking mode
  turned on, and one more fix round got it through.
- Lessons (state them as lessons, with the story above as evidence):
  1. Split work so that each worker owns its files; no two workers touch the same file.
  2. Send failures back to the worker that owns the failing files.
  3. Revision notes must be cumulative, because the work package is the baseline each
     time. One revision round undid an earlier fix before this was written down.
  4. Passing tests is necessary, not sufficient: someone has to look at the result.
  5. Match effort to difficulty: fast, no-thinking mode for easy tasks, thinking mode
     for the hard one.
- Everything the workers saw (guides, specs, tests, packages) is in the project's public
  repository.

## Code to include

1. A small `text` block sketching the loop: spec and tests, then workers in parallel,
   then verify, then review.
2. A `text` or `bash` block with the shape of a work package's front matter (a `files:`
   list), as a tiny example.

## Callout idea

The workers are fast and cheap. The judgment is in the brief and the review.

## Do not claim

Exact token counts, costs, or model sizes; any claim that this approach always works or
replaces engineers.
