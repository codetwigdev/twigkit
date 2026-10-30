export default {
  slug: 'base64-is-not-encryption',
  title: 'Base64 is not encryption',
  summary: 'What Base64 is for, why it makes data bigger, and why it keeps leaking into "security".',
  date: '2026-10-30',
  tags: ['encoding', 'security'],
  tool: 'encode-decode',
  blocks: [
    { type: 'p', text: 'By the end of this article you will understand what Base64 actually does, why it exists, and why it is not a substitute for encryption. You will also know how to use it safely in JavaScript and how to spot the common mistake of treating encoded data as protected data.' },
    { type: 'h2', text: 'What Base64 does' },
    { type: 'p', text: 'Base64 is an encoding scheme. It takes binary data and rewrites it as a string of characters drawn from a 64-character alphabet: `A-Z`, `a-z`, `0-9`, `+`, and `/`. Every 3 bytes of input become 4 characters of output. If the input length is not a multiple of 3, `=` padding fills the last group. The result is roughly one third larger than the original.' },
    { type: 'p', text: 'That size increase is the price of making binary data safe for text-only channels. Email bodies, JSON payloads, URLs, HTML attributes, and data URLs all carry text. Base64 lets you slip a PNG, a PDF, or a binary blob through those channels without corruption.' },
    { type: 'h2', text: 'Why it exists' },
    { type: 'p', text: 'The problem Base64 solves is simple: some transport layers only accept text. A binary file sent raw through an email body or a JSON string would break on every byte that is not a printable ASCII character. Base64 sidesteps that by mapping every byte into a safe character range.' },
    { type: 'p', text: 'It is a convenience layer, not a security layer. It uses no key and no secret. Anyone who sees a Base64 string can decode it instantly, with no effort and no guesswork. Encoding is not encryption, hashing, or compression. It is a transliteration.' },
    { type: 'h2', text: 'The URL-safe variant' },
    { type: 'p', text: 'The standard Base64 alphabet includes `+` and `/`, which collide with characters that have meaning in URLs. The URL-safe variant replaces `+` with `-` and `/` with `_`, and often drops the `=` padding as well. You will see this variant in JWT segments, where three Base64url-encoded parts are joined with dots.' },
    { type: 'h2', text: 'Base64 in HTTP Basic authentication' },
    { type: 'p', text: 'HTTP Basic authentication sends `username:password` as a Base64 string in the `Authorization` header. Because Base64 is trivially reversible, that string is readable by anyone who can see the request. This is why Basic auth must only travel over HTTPS. Without TLS, the "encoded" credential is effectively plaintext.' },
    { type: 'h2', text: 'Using Base64 in JavaScript' },
    { type: 'p', text: 'The browser and Node.js both expose `btoa` and `atob`. They handle Latin-1 text directly. Here is the round trip:' },
    { type: 'code', lang: 'js', text: `const encoded = btoa('hello')
// 'aGVsbG8='
const decoded = atob(encoded)
// 'hello'` },
    { type: 'p', text: 'There is a catch: `btoa` only accepts Latin-1 characters. If you pass it a string with characters above U+00FF, it throws. For Unicode text you need to encode to UTF-8 bytes first, then build a binary string from those bytes before calling `btoa`:' },
    { type: 'code', lang: 'js', text: `function encodeUtf8(str) {
  const bytes = new TextEncoder().encode(str)
  let binary = ''
  for (const b of bytes) binary += String.fromCharCode(b)
  return btoa(binary)
}` },
    { type: 'p', text: 'The `TextEncoder` step produces a `Uint8Array` of UTF-8 bytes. You then convert each byte into a single-character string, concatenate them into a binary string, and hand that to `btoa`. Decoding works in reverse: `atob` gives you the binary string, and you map each character back to its byte value before decoding as UTF-8.' },
    { type: 'h2', text: 'The common mistake' },
    { type: 'p', text: 'A long, random-looking string in a config file or an API response is not automatically protected. If it is Base64, anyone can decode it in seconds. If it is a hash, it is one-way but still not encryption. The absence of obvious structure in a string does not imply secrecy. Check the format before you assume protection.' },
    { type: 'callout', title: 'Remember', text: 'If you can decode it without a secret, it is not secret.' },
    { type: 'h2', text: 'Where to go next' },
    { type: 'p', text: 'If you need to encode or decode Base64 strings, or compare them against other encodings, the [Base64 / URL](#/encode-decode) tool on this site converts text both ways, accepts the URL-safe alphabet, and copes with missing padding. It is a quick way to verify what a string actually contains before you decide whether it is safe to share.' },
  ],
}
