# Outline: Tests are the spec

slug `tests-are-the-spec` · title `Tests are the spec` · tags `testing`, `workflow` · no tool
Summary (use as the base): Why the tests, not the prompt, are what made the worker model reliable.

## Facts you may use (lessons from building TwigKit)

- The architect wrote the tests before any worker wrote code. A test file is a precise
  specification: exact return shapes, exact edge cases, exact error behaviour. A paragraph
  of prose is not.
- Conventions that made tests easy to pass: every function that can fail returns a result
  object, `{ ok: true, ... }` or `{ ok: false, error }`, and never throws; logic is pure
  functions in one file, UI in another.
- Examples of tests that mattered (use these as the story):
  - Base64 had to be UTF-8 safe, accept the URL-safe alphabet and missing padding. Each of
    those is one small test.
  - The cron explainer's tests pinned the next run times for a weekday schedule from a
    known Friday. The first worker version returned a Sunday where Monday was expected: an
    off-by-one in the weekday numbering. The test said so immediately.
  - The same cron version rejected `*/15 * * * *` as invalid. Again the test failed
    right away, with the input and the expected value in the message.
- Known answers are the best tests: the SHA-256 of `abc`, the date for Unix time
  1700000000 (`2023-11-14T22:13:20.000Z`), the example token from the JWT debugger. Take
  expected values from a reference, not from the code under test.
- What tests did not catch: three tools showed an error before you typed anything. The
  tests only checked the functions, not how the screen felt. A person (or a model) has to
  look at the result in a browser.
- Tips: one behaviour per test; name the test for the behaviour; test the edge (empty,
  maximum, malformed) as hard as the happy path; make failure messages show the input.
- Tests also protect revisions: when the project manager asks for a change, the full
  suite shows whether anything else moved.

## Code to include

1. A short `js` test using `describe`/`it`/`expect` for one of the examples (Unix time
   1700000000, which is plain and checkable).
2. The result-object shape as a small `js` block.

## Callout idea

If you cannot write the test, you have not finished writing the spec.

## Do not claim

Coverage percentages; that tests prove correctness; claims about other projects.
