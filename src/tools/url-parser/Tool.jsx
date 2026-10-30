import { useState } from 'react'
import Field from '../../ui/Field.jsx'
import Output from '../../ui/Output.jsx'
import { parseUrl } from './logic.js'

// The component only holds state and wires inputs to logic.js. No real logic here.
export default function Tool() {
  const [text, setText] = useState('')

  const result = text ? parseUrl(text) : null

  return (
    <>
      <Field label="URL">
        {(id) => (
          <input
            id={id}
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="https://example.com/path?x=1#top"
            style={{ fontFamily: 'monospace' }}
          />
        )}
      </Field>
      {result && !result.ok && <Output error={result.error} />}
      {result && result.ok && (
        <>
          <div className="row"><span>Protocol</span><Output value={result.protocol} /></div>
          <div className="row"><span>Host name</span><Output value={result.hostname} /></div>
          <div className="row"><span>Port</span><Output value={result.port} /></div>
          <div className="row"><span>Path</span><Output value={result.pathname} /></div>
          <div className="row"><span>Query</span><Output value={result.search} /></div>
          <div className="row"><span>Fragment</span><Output value={result.hash} /></div>
          <div className="row"><span>Origin</span><Output value={result.origin} /></div>
          {result.username && (
            <div className="row"><span>User</span><Output value={result.username} /></div>
          )}
          {result.password && (
            <div className="row"><span>Password</span><Output value={result.password} /></div>
          )}
          <h2>Query parameters</h2>
          {result.params.length === 0 ? (
            <p className="muted">No query parameters</p>
          ) : (
            result.params.map((p, i) => (
              <Output key={i} value={`${p.key} = ${p.value}`} />
            ))
          )}
        </>
      )}
    </>
  )
}
