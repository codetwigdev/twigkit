export default {
  slug: 'an-architect-and-a-team-of-workers',
  title: 'An architect and a team of workers',
  summary: 'How TwigKit is built: a strong model designs, a local model types, tests decide.',
  date: '2026-10-30',
  tags: ['workflow', 'ai'],
  blocks: [
    { type: 'p', text: 'By the end of this article, you will understand how a small team of AI models builds a working website, what goes wrong when you try, and the rules that keep the process reliable. The story is real: it is how this very site was made.' },
    { type: 'p', text: 'TwigKit is a free set of small browser tools. It is also a test of a workflow. A strong model, Claude, acts as the architect and project manager. A local open-weights model, Qwen, served on the author\'s own GPU machine with vLLM, does most of the typing. The architect designs; the workers build; tests decide.' },
    { type: 'h2', text: 'Round one: the first eight tools' },
    { type: 'p', text: 'The architect wrote the app shell, the shared UI, a tool contract, one reference tool, a short spec per tool, and a test file per tool. Eight Qwen workers ran in parallel, one tool each. Each worker wrote two files: `logic.js` (pure functions) and `Tool.jsx` (UI wiring). A script wrote their files, ran that tool\'s tests and lint, and sent any failure back.' },
    { type: 'p', text: 'All eight passed on the first attempt. The architect then opened the real pages in a browser and found three tools that showed an error before you typed anything. No test caught it. The fix went into the worker guide, and those three were re-run.' },
    { type: 'h2', text: 'Round two: the redesign' },
    { type: 'p', text: 'The architect acted as project manager. A top-tier model was commissioned as lead designer and wrote a design spec plus seven self-contained work packages, each owning its own files. Seven Qwen workers built them in parallel in under a minute; the build, tests and lint passed on the first pass. The architect reviewed it in a browser at desktop, dark and phone sizes and sent revision notes.' },
    { type: 'h2', text: 'Round three: eight more tools and these articles' },
    { type: 'p', text: 'On the first pass four of the eight failed something. The JWT decoder did not even build. The runner sent each failure back to its worker, and three were fixed within two rounds. The cron explainer, the hardest, was still failing after two rounds. It rejected steps like `*/15` and was off by one on weekdays. It was re-run with Qwen\'s thinking mode turned on, and one more fix round got it through.' },
    { type: 'h2', text: 'The loop' },
    { type: 'p', text: 'The process is a loop. The architect writes the spec and the tests. Workers run in parallel, each owning its files. A runner verifies the build, tests and lint. Failures go back to the worker that owns the failing files. The architect reviews the result in a browser. The loop repeats until it passes.' },
    { type: 'code', lang: 'text', text: `spec + tests
  |
  v
workers (parallel, each owns its files)
  |
  v
verify (build, tests, lint)
  |
  +-- failures -> back to the owning worker
  |
  v
architect reviews in a browser
  |
  +-- revision notes -> back to the workers` },
    { type: 'h2', text: 'Work packages and file ownership' },
    { type: 'p', text: 'Each worker gets a work package. The package names the files the worker owns. No two workers touch the same file. The front matter of a package looks like this:' },
    { type: 'code', lang: 'text', text: `files:
  - src/tools/cron/logic.js
  - src/tools/cron/Tool.jsx` },
    { type: 'p', text: 'When a test fails, the runner sends the failure back to the worker that owns the failing files. That worker fixes them and the runner checks again. As a rule the architect does not patch the worker\'s code by hand: the failure goes back to the worker, so what is being tested is the worker\'s own output.' },
    { type: 'h2', text: 'Lessons' },
    { type: 'ol', items: [
      'Split work so that each worker owns its files. No two workers touch the same file.',
      'Send failures back to the worker that owns the failing files.',
      'Revision notes must be cumulative, because the work package is the baseline each time. One revision round undid an earlier fix before this was written down.',
      'Passing tests is necessary, not sufficient. Someone has to look at the result.',
      'Match effort to difficulty: fast, no-thinking mode for easy tasks, thinking mode for the hard one.',
    ] },
    { type: 'p', text: 'Everything the workers saw, guides, specs, tests, packages, is in the project\'s public repository. You can read the exact briefs, specs and tests. The workflow is not a black box.' },
    { type: 'callout', title: 'Remember', text: 'The workers are fast and cheap. The judgment is in the brief and the review.' },
    { type: 'h2', text: 'What this is not' },
    { type: 'p', text: 'This workflow does not replace engineers. It does not always work. The architect still has to review the result in a browser. The tests still have to be written by someone who understands the tool. The workflow is a way to scale the typing, not a way to skip the thinking.' },
  ],
}
