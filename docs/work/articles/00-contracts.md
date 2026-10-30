These packages each write one TwigKit article as a data module in `src/articles/`. The
voice, facts policy and data format are in `docs/articles/STYLE.md`, which is part of your
shared context. Output format: a short summary, then a line `File: src/articles/<slug>.js`
followed by the complete module in one fenced `js` block.

An automated test (`src/articles/content.test.js`) checks the structure. A person checks
every fact, so do not invent anything the outline does not give you.
