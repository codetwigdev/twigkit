# Outline: Regular expressions, one idea at a time

slug `regular-expressions-one-idea-at-a-time` · title `Regular expressions, one idea at a time` · tags `regex`, `text` · tool `regex-tester`
Summary (use as the base): Build a pattern from literals, classes, quantifiers and groups.

## Facts you may use (JavaScript regular expression syntax)

Teach in this order, with one tiny example each:
1. **Literals**: `cat` matches the text "cat".
2. **Character classes**: `[abc]` matches one of a, b, c; ranges `[a-z]`, negation `[^0-9]`.
   Shorthands: `\d` a digit, `\w` a letter, digit or underscore, `\s` whitespace, `.` any
   character except a newline.
3. **Quantifiers**: `*` zero or more, `+` one or more, `?` optional, `{n}`, `{n,m}`.
   Quantifiers are greedy by default; add `?` after one (`.*?`) to make it lazy.
4. **Anchors**: `^` start, `$` end, `\b` word boundary.
5. **Groups and alternation**: `( )` groups and captures; `a|b` alternation;
   non-capturing `(?: )`; named groups `(?<year>\d{4})`.
6. **Flags**: `g` all matches, `i` ignore case, `m` multiline.

Build up one example: matching a date such as `2026-10-30` with
`/(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/`, and read the named groups from a match
in JavaScript: `'2026-10-30'.match(regex).groups.year` is `'2026'`.

Also: a regular expression that matches is not a validator for things like email
addresses or HTML; keep patterns small and test them against both matching and
non-matching examples. Very nested quantifiers such as `(a+)+` can backtrack
catastrophically on some inputs; mention that as a caution without numbers.

## Code to include

1. The date regex with named groups and the `.groups.year` read.
2. A greedy versus lazy example on `'<b>one</b><b>two</b>'` with `/<b>.*<\/b>/` versus
   `/<b>.*?<\/b>/` (greedy matches the whole string; lazy matches `<b>one</b>`).

## Callout idea

Test a pattern against inputs that should not match, not only inputs that should.

## Do not claim

Performance numbers; claims that regular expressions can parse HTML.
