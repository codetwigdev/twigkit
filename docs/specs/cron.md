# Cron Explainer

Standard 5-field cron: `minute hour day-of-month month day-of-week`.

**Field syntax (all fields):** `*`, a number, a range `a-b`, a list `a,b,c` whose items
may be numbers or ranges, a step `*/n` or `a-b/n`. Ranges: minute 0-59, hour 0-23,
day-of-month 1-31, month 1-12 (also `JAN`..`DEC`, case-insensitive), day-of-week 0-7
(also `SUN`..`SAT`; both 0 and 7 mean Sunday). Reject anything else (wrong field count,
out-of-range values, `a-b` with a > b, step 0, unknown text).

**Exports (`logic.js`):**
- `explainCron(expr)` returns `{ ok: true, summary }` or `{ ok: false, error }`.
- `nextRuns(expr, from, count = 5)` returns `{ ok: true, runs }` (ISO strings, UTC) or
  `{ ok: false, error }`. `from` is a `Date` or a millisecond timestamp.

**Summary wording (follow exactly):**
1. All five fields `*`: `Every minute`.
2. Minute is `*/N` and the other four are `*`: `Every N minutes`.
3. Minute and hour are both single numbers: `At HH:MM` (zero-padded), then a space and a
   date phrase:
   - day-of-month, month and day-of-week all `*`: `every day`
   - day-of-week set, day-of-month and month `*`: `on <days>` where `<days>` is one name
     (`Sunday`), a range (`Monday to Friday`), or a list (`Monday, Wednesday and Friday`)
   - day-of-month a single number, month `*`: `on day N of every month`
   - day-of-month a single number, month a single number: `on day N of <Month>`
4. Anything else: a field-by-field sentence such as
   `At minute 5,35, hour */2, every day-of-month, every month, every day-of-week`
   (any clear, deterministic wording).

**`nextRuns`:** evaluate in UTC. Return the next `count` times strictly **after** `from`
that match, at minute precision. Standard cron rule: if both day-of-month and
day-of-week are restricted (neither is `*`), a day matches when **either** matches;
otherwise both must match. Search at most 8 years ahead, so an impossible date such as
`0 0 30 2 *` returns `{ ok: true, runs: [] }` quickly. Make the search efficient (skip
whole days/hours that cannot match) rather than stepping minute by minute.

**UI:** a text input "Cron expression" (monospace) starting with `0 9 * * 1-5`, then, when
valid: the summary as a prominent sentence (a plain `p`), five `.stat` boxes
(minute, hour, day of month, month, day of week) showing each field's raw text, and
"Next 5 runs (UTC)" as an `Output` with one ISO time per line. A `.muted` note:
`Times are shown in UTC. Check which time zone your scheduler uses.` Show the error only
when the input is not empty.
