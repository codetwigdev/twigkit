# Text Stats

**Exports (`logic.js`):**
- `countText(text)` returns
  `{ characters, charactersNoSpaces, words, lines, readingMinutes }`.
  `words` are runs of non-whitespace. `lines` is the number of lines, 0 for an empty
  string. `readingMinutes` is `Math.ceil(words / 200)`.
- `convertCase(text, mode)` returns a string. Modes: `upper`, `lower`, `title`,
  `camel`, `pascal`, `snake`, `kebab`. Unknown mode throws an `Error`.
  For camel/pascal/snake/kebab first split the text into words on whitespace,
  `-`, `_` and lower-to-upper camel boundaries (`helloWorld` -> hello, World),
  then re-join. Title case: first letter of each whitespace-separated word upper,
  the rest lower.

**UI:** one big textarea. A `stat-grid` of `stat` boxes (Characters, Without spaces,
Words, Lines, Reading time) that updates live. Below it, a row of buttons for each
case mode (label them "UPPER", "lower", "Title Case", "camelCase", "PascalCase",
"snake_case", "kebab-case"); clicking one replaces the textarea text with the
converted text.
