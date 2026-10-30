# Outline: Unix time and the year 2038

slug `unix-time-and-the-year-2038` · title `Unix time and the year 2038` · tags `time`, `dates` · tool `timestamp`
Summary (use as the base): Seconds versus milliseconds, time zones, and the 32-bit cliff.

## Facts you may use

- Unix time counts the seconds since 1970-01-01T00:00:00Z (the epoch). It has no time
  zone: it is the same number everywhere. A time zone only matters when you display it.
- JavaScript's `Date` and `Date.now()` use **milliseconds**; many APIs, databases and
  command-line tools use **seconds**. The most common bug is mixing them: a 10-digit value
  is seconds, a 13-digit value is milliseconds (for dates in the current era).
- `new Date(1700000000 * 1000).toISOString()` is `'2023-11-14T22:13:20.000Z'`.
  `Math.floor(Date.now() / 1000)` gives the current time in seconds.
- Unix time ignores leap seconds: every day is exactly 86,400 seconds long.
- The year 2038 problem: a signed 32-bit integer tops out at 2,147,483,647. As a Unix
  time that is 2038-01-19T03:14:07Z. One second later a 32-bit signed counter overflows
  and wraps to a large negative number, which would read as December 1901. Systems that
  store time in 64 bits do not have this problem. Modern operating systems and languages
  mostly use 64-bit times, but old file formats, embedded devices and databases with
  32-bit columns may still be affected.
- Habits that help: store and transmit times in UTC (ISO 8601 strings like
  `2026-10-30T12:00:00Z`, or Unix time), convert to local time only for display, and name
  the unit in the field name (`created_at_ms`).

## Code to include

1. The `new Date(...)` conversion above and the seconds-from-`Date.now()` line.
2. A `text` block showing the value 2147483647 and its date.

## Callout idea

Name the unit: a timestamp without its unit is a bug waiting to happen.

## Do not claim

Specific systems that will fail; dates of leap seconds; time zone database details.
