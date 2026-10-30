# Outline: Hashes are not passwords

slug `hashes-are-not-passwords` · title `Hashes are not passwords` · tags `hashing`, `security` · tool `hash`
Summary (use as the base): What SHA-256 is good for, and why storing passwords needs something slower.

## Facts you may use

- A hash function turns input of any size into a fixed-size fingerprint. SHA-256 always
  produces 256 bits, shown as 64 hexadecimal characters. The same input always gives the
  same output; a tiny change in the input changes the output completely.
- Test vector: the SHA-256 of the text `abc` is
  `ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad`.
- It is one-way: you cannot compute the input from the output. You can only guess inputs
  and compare.
- Good uses: checking a download has not changed, detecting duplicate files, content
  addresses, building other primitives (such as HMAC).
- Why a plain fast hash is wrong for passwords: it is designed to be fast, so an attacker
  who steals a database of hashes can try enormous numbers of guesses per second, and
  people choose guessable passwords. Identical passwords give identical hashes unless a
  unique **salt** (random value stored with each hash) is added.
- Use a purpose-built password hashing function: Argon2, scrypt or bcrypt. They are
  deliberately slow and memory-hungry, include a salt, and have a cost setting you can
  raise as hardware gets faster.
- MD5 and SHA-1 are broken for collision resistance (practical SHA-1 collisions were
  demonstrated in 2017); do not use them for security. They are still fine for non-security
  checksums such as cache keys.
- In the browser, `crypto.subtle.digest('SHA-256', bytes)` computes a hash; it returns an
  `ArrayBuffer` (an example converts it to hex).

## Code to include

1. A browser/Node snippet hashing text to hex with `crypto.subtle.digest`, `TextEncoder`
   and a hex conversion.
2. A `text` block with the `abc` test vector.

## Callout idea

A fast hash answers "has this changed?". A password hash answers "is this guess right?"
slowly, on purpose.

## Do not claim

Guess-per-second numbers; cost parameters; any claim that one of Argon2, scrypt or bcrypt
is "the best".
