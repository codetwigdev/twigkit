import { useState } from 'react'
import Field from '../../ui/Field.jsx'
import Output from '../../ui/Output.jsx'
import { decodeJwt } from './logic.js'

const SAMPLE =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'

export default function Tool() {
  const [token, setToken] = useState('')

  const result = token ? decodeJwt(token) : null

  return (
    <>
      <Field label="Token">
        {(id) => (
          <textarea
            id={id}
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Paste a JWT..."
          />
        )}
      </Field>
      <button type="button" className="btn" onClick={() => setToken(SAMPLE)}>
        Use an example
      </button>

      {result && result.ok && (
        <>
          <div className="row">
            {result.expired === true && (
              <p className="error">Expired on {result.expiresAt}</p>
            )}
            {result.expired === false && (
              <p className="muted">Expires {result.expiresAt}</p>
            )}
            {result.issuedAt && (
              <p className="muted">Issued {result.issuedAt}</p>
            )}
          </div>
          <Field label="Header">
            <Output value={JSON.stringify(result.header, null, 2)} />
          </Field>
          <Field label="Payload">
            <Output value={JSON.stringify(result.payload, null, 2)} />
          </Field>
          <Field label="Signature">
            <Output value={result.signature} />
          </Field>
        </>
      )}

      {result && !result.ok && (
        <Output error={result.error} />
      )}

      <p className="muted">
        Decoding does not verify the signature. Never trust a token you have not verified.
      </p>
    </>
  )
}
