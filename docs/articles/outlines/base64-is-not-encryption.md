# Outline: Base64 is not encryption

slug `base64-is-not-encryption` · title `Base64 is not encryption` · tags `encoding`, `security` · tool `encode-decode`
Summary (use as the base): What Base64 is for, why it makes data bigger, and why it keeps leaking into "security".

## Facts you may use

- Base64 maps every 3 bytes of input to 4 characters from a 64-character alphabet:
  `A-Z`, `a-z`, `0-9`, `+`, `/`. If the input is not a multiple of 3 bytes, `=` padding
  fills the last group. The output is about one third larger than the input.
- Why it exists: some channels only carry text (email bodies, JSON, URLs, HTML attributes,
  data URLs). Base64 lets binary data travel through them intact.
- It uses no key and no secret. Anyone can decode it, instantly. Encoding is not
  encryption, hashing, or compression.
- The URL-safe variant replaces `+` with `-` and `/` with `_` (and often drops padding).
  JWT segments use it.
- HTTP Basic authentication sends `username:password` as Base64 in a header. That is
  readable by anyone who can see the request, which is why it must only go over HTTPS.
- In JavaScript, `btoa('hello')` is `'aGVsbG8='` and `atob('aGVsbG8=')` is `'hello'`.
  `btoa` only accepts Latin-1 characters; for Unicode text, encode to UTF-8 bytes first
  (with `TextEncoder`) and build the binary string from those bytes.
- Common mistake: seeing a long random-looking string in a config file or API response
  and assuming it is protected.

## Code to include (keep each short)

1. `btoa` / `atob` round trip with `'hello'`.
2. A Unicode-safe encode helper using `TextEncoder` and `btoa` (a few lines).

## Callout idea

If you can decode it without a secret, it is not secret.

## Do not claim

Any specific size numbers beyond "about a third larger"; any statistics about breaches.
