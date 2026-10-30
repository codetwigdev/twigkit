export default {
  slug: 'hashes-are-not-passwords',
  title: 'Hashes are not passwords',
  summary: 'What SHA-256 is good for, and why storing passwords needs something slower.',
  date: '2026-10-30',
  tags: ['hashing', 'security'],
  tool: 'hash',
  blocks: [
    {
      type: 'p',
      text: 'By the end of this article you will understand what a hash function actually does, where SHA-256 is the right tool, and why using it to store passwords leaves you exposed. You will also see the browser API that computes a SHA-256 digest, and the reason a purpose-built password function is a different animal.',
    },
    {
      type: 'h2',
      text: 'What a hash function gives you',
    },
    {
      type: 'p',
      text: 'A hash function turns input of any size into a fixed-size fingerprint. SHA-256 always produces 256 bits, shown as 64 hexadecimal characters. The same input always gives the same output, and a tiny change in the input changes the output completely. That last property is what makes a hash useful as a fingerprint: it is stable for identical data and unpredictable for anything else.',
    },
    {
      type: 'p',
      text: 'A hash is one-way. You cannot compute the input from the output. You can only guess inputs and compare their hashes against the value you have. This is the core reason a hash is a fingerprint and not a lock: it tells you whether two things match, not what they are.',
    },
    {
      type: 'h2',
      text: 'Where SHA-256 is the right tool',
    },
    {
      type: 'p',
      text: 'SHA-256 is a good fit when you need a fast, stable fingerprint. Common uses include checking that a download has not changed, detecting duplicate files, content addressing, and building other primitives such as HMAC. In each of these cases you are asking "has this changed?" or "do these match?", and a fast hash answers that quickly.',
    },
    {
      type: 'code',
      lang: 'text',
      text: 'SHA-256("abc") = ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad',
    },
    {
      type: 'p',
      text: 'The test vector above is a standard reference. If your implementation produces a different value for the text `abc`, something is wrong. The same input always gives the same output, so this is a reliable way to verify a hash function is working.',
    },
    {
      type: 'h2',
      text: 'Computing a hash in the browser',
    },
    {
      type: 'p',
      text: `In the browser, \`crypto.subtle.digest('SHA-256', bytes)\` computes a hash. It returns an \`ArrayBuffer\`, which you typically convert to a hexadecimal string. The snippet below hashes a string to hex using \`TextEncoder\` and a small conversion helper.`,
    },
    {
      type: 'code',
      lang: 'js',
      text: `async function sha256Hex(text) {
  const bytes = new TextEncoder().encode(text)
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return [...new Uint8Array(digest)]
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

console.log(await sha256Hex('abc'))
// ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad`,
    },
    {
      type: 'h2',
      text: 'Why a fast hash is the wrong tool for passwords',
    },
    {
      type: 'p',
      text: 'A plain fast hash is the wrong choice for passwords. It is designed to be fast, so an attacker who steals a database of hashes can try enormous numbers of guesses per second. People also choose guessable passwords, which makes the search space small. Identical passwords give identical hashes unless a unique **salt** (a random value stored with each hash) is added. Without a salt, two users with the same password produce the same hash, and a precomputed table of common passwords can be matched against the whole database at once.',
    },
    {
      type: 'p',
      text: 'The fix is to use a purpose-built password hashing function: Argon2, scrypt or bcrypt. These are deliberately slow and memory-hungry, include a salt, and have a cost setting you can raise as hardware gets faster. Slowness is the point: it makes each guess expensive, so an attacker cannot try enormous numbers of them.',
    },
    {
      type: 'callout',
      title: 'Remember',
      text: 'A fast hash answers "has this changed?". A password hash answers "is this guess right?" slowly, on purpose.',
    },
    {
      type: 'h2',
      text: 'MD5 and SHA-1 are not for security',
    },
    {
      type: 'p',
      text: 'MD5 and SHA-1 are broken for collision resistance. Practical SHA-1 collisions were demonstrated in 2017, and MD5 has been broken for much longer. Do not use them for security. They are still fine for non-security checksums such as cache keys, where an attacker cannot control the inputs.',
    },
    {
      type: 'p',
      text: 'When you need a cryptographic fingerprint, use SHA-256. When you need to store a password, use Argon2, scrypt or bcrypt. The two jobs are different, and the tools are different. You can try the [hash tool](#/hash) to see SHA-256 in action.',
    },
  ],
}
