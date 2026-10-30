# Outline: Cron in plain English

slug `cron-in-plain-english` · title `Cron in plain English` · tags `cron`, `scheduling` · tool `cron`
Summary (use as the base): The five fields, the three traps, and how to read any schedule.

## Facts you may use

- A standard cron expression has five space-separated fields, in this order:
  minute (0-59), hour (0-23), day of month (1-31), month (1-12), day of week (0-7, where
  both 0 and 7 mean Sunday; names such as `MON` are commonly accepted).
- Symbols: `*` any value, `,` a list (`1,3,5`), `-` a range (`1-5`), `/` a step (`*/15`).
- Examples and their meaning:
  `*/15 * * * *` every 15 minutes; `0 9 * * 1-5` at 09:00 on Monday to Friday;
  `0 0 1 * *` at midnight on the first of every month; `30 14 * * 0` at 14:30 on Sundays.
- Read left to right and say it aloud: "at minute 30 past hour 14, on any day of the
  month, in any month, on day-of-week 0".
- Trap 1, **day of month and day of week are combined with OR** when both are restricted.
  `0 0 13 * 5` runs at midnight on the 13th of every month **and** on every Friday, not
  only on Friday the 13th.
- Trap 2, **time zones**: cron runs on the clock of the machine or service that executes
  it, often UTC on servers and cloud schedulers. GitHub Actions schedules use UTC. Check
  which zone your scheduler uses before trusting "9am".
- Trap 3, **steps restart at the start of the field**: `*/45 * * * *` runs at minute 0 and
  minute 45 of every hour, not every 45 minutes. For intervals that do not divide 60
  evenly the gaps are uneven.
- Some schedulers extend the format (a seconds field, a year field, special strings like
  `@daily`); check your scheduler's documentation.

## Code to include

1. A `text` block that labels the five fields above an example expression.
2. A `text` block listing three example expressions and their meanings.

## Callout idea

When in doubt, list the next few run times and read them, not the expression.

## Do not claim

Behaviour of specific products other than the GitHub Actions UTC fact above.
