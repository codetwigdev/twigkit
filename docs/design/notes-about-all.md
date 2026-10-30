These notes are cumulative: apply ALL of them together on top of the package text, which is the baseline.

Review notes for the About page (package 05). Change only what is listed; keep everything else exactly as it is.

1. Flow diagram worker chips: one chip shows a truncated label, "timesta…". In
   `FlowDiagram.jsx`, shorten that chip's label to `time` so it fits. Do not change the
   chip CSS and do not change the other chips.

2. The "What actually happened" story is out of date: it only describes the first build.
   - In story item 03 ("The loop verifies"), change the body to:
     `scripts/dispatch.mjs` and `scripts/team.mjs` write the files, run the tests, build and lint, and send any failure back to the worker that wrote it for another attempt, before anything reaches review.
     (keep `scripts/dispatch.mjs` and `scripts/team.mjs` in `<code>` as the existing item does for the script name).
   - Directly below the story grid, add one short paragraph (class `note`, if `About.css`
     already defines a note style; otherwise reuse the caption style used by the
     "dispatch talks to any OpenAI-compatible endpoint" line) with this exact text:
     `This site was built the same way. A Fable 5.1 designer wrote the design and seven work packages; seven Qwen workers built them in about 40 seconds, and the architect reviewed the result in a browser.`
   Keep the story grid itself at four items.

---

Review notes for the About page (package 05). Change only the `.build-note` paragraph's styling in `About.css`; keep everything else exactly as it is.

The "This site was built the same way..." paragraph (class `build-note`) sits tight against the story grid above it and reads like a stray caption. Style it as a quiet closing remark:
- `margin: 40px 0 0;`
- `padding-top: 20px;`
- `border-top: 1px solid var(--line);`
- `font-size: 15px; line-height: 1.55; color: var(--ink-2); max-width: 62ch;`
Use only these properties for `.build-note` (replace whatever is there now). No other changes.
