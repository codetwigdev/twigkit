export default {
  slug: 'unix-time-and-the-year-2038',
  title: 'Unix time and the year 2038',
  summary:
    'Seconds versus milliseconds, time zones, and the 32-bit cliff.',
  date: '2026-10-30',
  tags: ['time', 'dates'],
  tool: 'timestamp',
  blocks: [
    {
      type: 'p',
      text: 'By the end of this article you will know how Unix time works, why JavaScript and most other tools disagree about the unit, and what happens when a 32-bit counter runs out of room. You will also pick up a few habits that keep timestamps from quietly going wrong.',
    },
    {
      type: 'h2',
      text: 'What Unix time is',
    },
    {
      type: 'p',
      text: 'Unix time counts the seconds since 1970-01-01T00:00:00Z, a moment called the epoch. The number is the same everywhere on Earth. A time zone only matters when you display the value, not when you store or send it. If two people in different time zones read the same Unix time, they are reading the same instant; they just format it differently.',
    },
    {
      type: 'p',
      text: 'That is why you convert to local time only for display. The stored number is a single, unambiguous point on the timeline. Adding a time zone before you store it would bake one location into the value and make it wrong for everyone else. Keep the number in UTC and let the reader\'s device do the conversion at the last moment.',
    },
    {
      type: 'p',
      text: 'Unix time also ignores leap seconds. Every day is exactly 86,400 seconds long, whether or not a leap second was inserted. That makes the arithmetic simple and predictable: a week is always 604,800 seconds, and you can add or subtract without special cases.',
    },
    {
      type: 'h2',
      text: 'Seconds versus milliseconds',
    },
    {
      type: 'p',
      text: 'JavaScript is the odd one out. `Date.now()` returns milliseconds, and `new Date()` expects milliseconds. Many APIs, databases, and command-line tools use seconds. The most common bug is mixing the two: a 10-digit value is seconds, a 13-digit value is milliseconds for dates in the current era.',
    },
    {
      type: 'p',
      text: 'Here is the bug in miniature. Take the same instant expressed two ways: `1700000000` (seconds) and `1700000000000` (milliseconds). Feed each straight into `new Date()` and you get two very different dates, because JavaScript always treats the argument as milliseconds.',
    },
    {
      type: 'code',
      lang: 'js',
      text: `// 10-digit value is seconds, so scale it up first
new Date(1700000000 * 1000).toISOString()
// '2023-11-14T22:13:20.000Z'

// 13-digit value is already milliseconds
new Date(1700000000000).toISOString()
// '2023-11-14T22:13:20.000Z'

// Go the other way: milliseconds to seconds
Math.floor(Date.now() / 1000)
// current time in seconds`,
    },
    {
      type: 'p',
      text: 'If you forget to scale, the seconds value lands in the 1970s and the milliseconds value lands in 2023. If you see a value that looks like it is in the wrong range, check the digit count before you debug the rest of the pipeline.',
    },
    {
      type: 'h2',
      text: 'The 32-bit cliff',
    },
    {
      type: 'p',
      text: 'Now the part that has a date on it. A signed 32-bit integer can hold values from -2,147,483,648 to 2,147,483,647. That top value is the ceiling for a 32-bit Unix time, and it is not far away: it is 2038-01-19T03:14:07Z.',
    },
    {
      type: 'code',
      lang: 'text',
      text: `2147483647
2038-01-19T03:14:07Z`,
    },
    {
      type: 'p',
      text: 'Here is what happens one second later. The counter tries to tick from 2,147,483,647 to 2,147,483,648, but that value does not fit in a signed 32-bit integer. The counter overflows and wraps around to the most negative value, -2,147,483,648. Interpreted as a Unix time, that negative number is a moment in December 1901. A clock that was just about to show 2038 suddenly shows 1901.',
    },
    {
      type: 'p',
      text: 'Systems that store time in 64 bits do not have this problem. Modern operating systems and languages mostly use 64-bit times, but old file formats, embedded devices, and databases with 32-bit columns may still be affected. If one of those is in your stack, the 2038 date is a real deadline, not a curiosity.',
    },
    {
      type: 'h2',
      text: 'Habits that help',
    },
    {
      type: 'ul',
      items: [
        'Store and transmit times in UTC: ISO 8601 strings like `2026-10-30T12:00:00Z`, or Unix time. A single, unambiguous instant means no one has to guess which time zone a value was meant in.',
        'Convert to local time only for display, never for storage. The moment you store a local time, you have tied the value to one place and made it wrong for everyone else.',
        'Name the unit in the field name, such as `created_at_ms`. When the unit is in the name, a 10-digit versus 13-digit mistake is obvious at a glance instead of a mystery a week later.',
      ],
    },
    {
      type: 'callout',
      title: 'Remember',
      text: 'Name the unit. A timestamp without its unit is a bug waiting to happen.',
    },
    {
      type: 'h2',
      text: 'Where to go next',
    },
    {
      type: 'p',
      text: 'If you need to convert between seconds, milliseconds, and human-readable dates, the [timestamp tool](#/timestamp) converts a Unix time to a date and back, in seconds or milliseconds, so you can check a value before you ship it.',
    },
  ],
}
