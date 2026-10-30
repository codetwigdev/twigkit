# Outline: Reading a JWT without panic

slug `reading-a-jwt-without-panic` · title `Reading a JWT without panic` · tags `auth`, `jwt` · tool `jwt-decoder`
Summary (use as the base): Three dot-separated parts, what each one holds, and what decoding does not prove.

## Facts you may use

- A JSON Web Token (JWT) is three parts separated by dots: `header.payload.signature`.
- The header and payload are JSON objects encoded as base64url (the URL-safe Base64
  variant). The signature is raw bytes, also base64url encoded.
- The well-known example token from the JWT debugger has the header
  `{"alg":"HS256","typ":"JWT"}` and the payload
  `{"sub":"1234567890","name":"John Doe","iat":1516239022}`. You may quote these two JSON
  objects. `iat` means "issued at", in seconds since 1970-01-01 UTC (that value is
  2018-01-18T01:30:22Z).
- Registered claims worth knowing: `iss` (issuer), `sub` (subject), `aud` (audience),
  `exp` (expiry), `nbf` (not before), `iat` (issued at), `jti` (token id). `exp`, `nbf` and
  `iat` are seconds since the Unix epoch, not milliseconds.
- For HS256 the signature is an HMAC-SHA256 of `header.payload` using a shared secret.
- **Decoding is not verifying.** Anyone can read a JWT's header and payload; the payload is
  not encrypted. Only checking the signature (on the server, with the right key) shows the
  token was not altered. Never put secrets in the payload.
- A server must also check the claims: the signature algorithm it expects (do not trust
  the `alg` header blindly; the historic `alg: none` problem), `exp`, `aud`, `iss`.
- Prefer short-lived tokens.
- In Node.js you can read a part with
  `JSON.parse(Buffer.from(part, 'base64url').toString('utf8'))`.

## Code to include

1. The three-part structure as a `text` block (made-up placeholders are fine).
2. The Node.js snippet decoding the payload.

## Callout idea

A decoded token tells you what it claims, not whether to believe it.

## Do not claim

Any specific attack statistics; claims about particular libraries or products.
