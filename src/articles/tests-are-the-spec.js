export default {
  slug: 'tests-are-the-spec',
  title: 'Tests are the spec',
  summary: 'Why the tests, not the prompt, are what made the worker model reliable.',
  date: '2026-10-30',
  tags: ['testing', 'workflow'],
  blocks: [
    {
      type: 'p',
      text: 'By the end of this article, you will understand why writing tests before code turned a vague prompt into a precise specification, and how that habit caught real bugs the moment the generated code ran.',
    },
    { type: 'h2', text: 'A test file is a specification' },
    {
      type: 'p',
      text: 'The architect wrote the tests before any worker wrote code. A test file is a precise specification: exact return shapes, exact edge cases, exact error behaviour. A paragraph of prose is not. When the worker model read the test file, it knew the contract down to the property name.',
    },
    {
      type: 'p',
      text: 'Conventions made the tests easy to pass. Every function that can fail returns a result object, `{ ok: true, ... }` or `{ ok: false, error }`, and never throws. Logic lives in pure functions in one file; UI lives in another. The worker did not have to guess whether to throw or return an error.',
    },
    { type: 'h2', text: 'The shape of a result' },
    {
      type: 'p',
      text: 'The result-object convention is small but it removes a whole class of ambiguity. A function in this style looks like this (a simplified sketch):',
    },
    {
      type: 'code',
      lang: 'js',
      text: `function parseNumber(input) {
  const value = Number(input)
  if (input.trim() === '' || Number.isNaN(value)) {
    return { ok: false, error: 'Not a number' }
  }
  return { ok: true, value }
}`,
    },
    {
      type: 'p',
      text: 'Because the function never throws, the test only has to check the shape. The UI file calls the function, looks at `ok`, and renders either the value or the error. No try/catch in the view layer.',
    },
    { type: 'h2', text: 'Tests that caught real bugs' },
    {
      type: 'p',
      text: 'Base64 had to be UTF-8 safe, accept the URL-safe alphabet, and tolerate missing padding. Each of those is one small test. The worker passed all three on the first run, but only because the tests said exactly what "accept" meant.',
    },
    {
      type: 'p',
      text: 'The cron explainer had a sharper story. The tests pinned the next run times for a weekday schedule from a known Friday. The first worker version returned a Sunday where Monday was expected: an off-by-one in the weekday numbering. The test said so immediately, with the input and the expected value in the message.',
    },
    {
      type: 'p',
      text: 'The same cron version rejected `*/15 * * * *` as invalid. Again the test failed right away. This was the one tool the worker could not fix in its first two rounds with thinking mode off; it passed after a re-run with thinking mode on. The tests made the gap obvious, and the same tests told us when it was closed.',
    },
    { type: 'h2', text: 'Known answers are the best tests' },
    {
      type: 'p',
      text: 'Take expected values from a reference, not from the code under test. The SHA-256 of `abc`, the date for Unix time 1700000000 (`2023-11-14T22:13:20.000Z`), the example token from the JWT debugger: these are fixed points you can check by hand. Here is a short test for the Unix-time case:',
    },
    {
      type: 'code',
      lang: 'js',
      text: `describe('fromUnix', () => {
  it('converts 1700000000 to the known ISO string', () => {
    const result = fromUnix(1700000000)
    expect(result.ok).toBe(true)
    expect(result.iso).toBe('2023-11-14T22:13:20.000Z')
  })
})`,
    },
    {
      type: 'p',
      text: 'One behaviour per test. Name the test for the behaviour. Test the edge case (empty, maximum, malformed) as hard as the happy path. Make failure messages show the input so the next person, or the next model, can act on them.',
    },
    { type: 'h2', text: 'What tests do not catch' },
    {
      type: 'p',
      text: 'Three tools showed an error before you typed anything. The tests only checked the functions, not how the screen felt. A person, or a model, has to look at the result in a browser. Tests protect the logic; they do not protect the feel.',
    },
    { type: 'h2', text: 'Tests protect revisions' },
    {
      type: 'p',
      text: 'When the project manager asks for a change, the full suite shows whether anything else moved. The worker can change one tool and run the suite without fear that a neighbouring tool broke. That safety net is what made it practical to ask for revisions at all.',
    },
    {
      type: 'callout',
      title: 'Remember',
      text: 'If you cannot write the test, you have not finished writing the spec.',
    },
    { type: 'h2', text: 'Where to go next' },
    {
      type: 'p',
      text: 'The [About](#/about) page covers how TwigKit is built and why the test-first workflow mattered for the whole project.',
    },
  ],
}
