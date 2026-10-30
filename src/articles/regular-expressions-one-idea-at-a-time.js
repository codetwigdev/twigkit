export default {
  slug: 'regular-expressions-one-idea-at-a-time',
  title: 'Regular expressions, one idea at a time',
  summary: 'Build a pattern from literals, classes, quantifiers and groups, then read the result in JavaScript.',
  date: '2026-10-30',
  tags: ['regex', 'text'],
  tool: 'regex-tester',
  blocks: [
    { type: 'p', text: 'By the end of this article you will be able to build a regular expression from small, named parts, test it against inputs that should and should not match, and read the captured values in JavaScript. You will not need to memorise a whole grammar in one sitting. You will learn one idea, use it in a tiny example, and move on to the next.' },
    { type: 'h2', text: 'Literals' },
    { type: 'p', text: 'A literal is the simplest building block. The pattern `cat` matches the text "cat" and nothing else. If you want to match the word "cat" inside a longer string, you will combine literals with the other pieces described below. Keep the pattern small at first. A pattern that is easy to read is easier to debug.' },
    { type: 'h2', text: 'Character classes' },
    { type: 'p', text: 'A character class matches one character from a set. The pattern `[abc]` matches one of a, b, or c. Ranges make the set compact: `[a-z]` matches any lowercase letter, and `[^0-9]` matches any character that is not a digit. JavaScript also provides shorthand classes: `\\d` for a digit, `\\w` for a letter, digit or underscore, `\\s` for whitespace, and `.` for any character except a newline.' },
    { type: 'p', text: 'Use classes when you need a small set of alternatives. They are easier to read than a long alternation and they make it obvious which characters are allowed.' },
    { type: 'h2', text: 'Quantifiers' },
    { type: 'p', text: 'A quantifier says how many times the preceding element may appear. `*` means zero or more, `+` means one or more, `?` means optional, `{n}` means exactly n, and `{n,m}` means at least n and at most m. Quantifiers are greedy by default: they try to match as much as possible. Add a `?` after a quantifier to make it lazy, so it matches as little as possible. For example, `.*?` is the lazy version of `.*`.' },
    { type: 'p', text: 'Greedy and lazy behaviour matters when the pattern can match overlapping regions. Consider the string `\'<b>one</b><b>two</b>\'`. The greedy pattern `/<b>.*<\\/b>/` matches the whole string because `.*` grabs everything up to the last `</b>`. The lazy pattern `/<b>.*?<\\/b>/` stops at the first `</b>` and matches only `<b>one</b>`.' },
    { type: 'code', lang: 'js', text: `const s = '<b>one</b><b>two</b>'
const greedy = /<b>.*<\\/b>/.exec(s)
const lazy = /<b>.*?<\\/b>/.exec(s)
console.log(greedy[0]) // <b>one</b><b>two</b>
console.log(lazy[0])   // <b>one</b>` },
    { type: 'h2', text: 'Anchors' },
    { type: 'p', text: 'Anchors do not match characters. They assert a position. `^` matches the start of the string (or, with the `m` flag, the start of a line), `$` matches the end, and `\\b` matches a word boundary. Use anchors to pin a pattern to the beginning or end of the input, or to ensure that a word is not part of a longer word.' },
    { type: 'h2', text: 'Groups and alternation' },
    { type: 'p', text: 'Parentheses group sub-patterns and capture the matched text. The pattern `(a|b)` matches either a or b and remembers which one matched. A non-capturing group `(?: )` groups without capturing, which is useful when you only need to apply a quantifier to a sequence. Named groups `(?<year>\\d{4})` capture under a label you can read later.' },
    { type: 'p', text: 'A practical example is matching an ISO date such as `2026-10-30`. The pattern `/(?<year>\\d{4})-(?<month>\\d{2})-(?<day>\\d{2})/` uses two named groups for the month and day and one for the year. After a match, you can read the values from the `groups` object.' },
    { type: 'code', lang: 'js', text: `const regex = /(?<year>\\d{4})-(?<month>\\d{2})-(?<day>\\d{2})/
const m = '2026-10-30'.match(regex)
console.log(m.groups.year)   // 2026
console.log(m.groups.month)  // 10
console.log(m.groups.day)    // 30` },
    { type: 'h2', text: 'Flags' },
    { type: 'p', text: 'Flags change how a pattern behaves. `g` makes the engine find all matches instead of stopping at the first, `i` ignores case, and `m` treats the string as multiple lines so that `^` and `$` match at line boundaries. Choose the flags you need and no more. A pattern with `g` that is also used in a replacement will behave differently from one without it.' },
    { type: 'h2', text: 'Keep patterns small' },
    { type: 'p', text: 'A regular expression that matches is not a validator. Do not use one to validate email addresses or HTML. Keep patterns small, test them against inputs that should match and inputs that should not, and prefer a sequence of simple checks over one complex pattern. Very nested quantifiers such as `(a+)+` can backtrack catastrophically on some inputs. If a pattern feels hard to read, it is probably too large.' },
    { type: 'callout', title: 'Remember', text: 'Test a pattern against inputs that should not match, not only inputs that should.' },
    { type: 'p', text: 'You can try these patterns interactively in the [regex tester](#/regex-tester). Start with a literal, add a class, then a quantifier, and watch how the match changes as you go.' },
  ],
}
