import { useState, useEffect } from 'react'
import Field from '../../ui/Field.jsx'
import Output from '../../ui/Output.jsx'
import { ALGORITHMS, hashText } from './logic.js'

// Holds state and wires inputs to logic.js. Hashes are computed asynchronously.
export default function Tool() {
  const [text, setText] = useState('')
  const [uppercase, setUppercase] = useState(false)
  const [results, setResults] = useState({})

  useEffect(() => {
    let cancelled = false
    async function run() {
      if (!text) {
        if (!cancelled) setResults({})
        return
      }
      const settled = await Promise.all(
        ALGORITHMS.map(async (alg) => [alg, await hashText(text, alg)]),
      )
      if (cancelled) return
      const map = {}
      for (const [alg, r] of settled) {
        map[alg] = r
      }
      setResults(map)
    }
    run()
    return () => {
      cancelled = true
    }
  }, [text])

  return (
    <>
      <Field label="Text">
        {(id) => (
          <textarea
            id={id}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste text to hash..."
          />
        )}
      </Field>
      <div className="row">
        <label>
          <input
            type="checkbox"
            checked={uppercase}
            onChange={(e) => setUppercase(e.target.checked)}
          />
          Uppercase
        </label>
      </div>
      {ALGORITHMS.map((alg) => {
        const r = results[alg]
        const raw = r && r.ok ? r.output : ''
        const value = uppercase ? raw.toUpperCase() : raw
        return (
          <div className="row" key={alg}>
            <Field label={alg}>
              <Output value={value} error={r && !r.ok ? r.error : ''} />
            </Field>
          </div>
        )
      })}
      <p className="muted">
        Hashing happens in your browser with the Web Crypto API. A fast hash is not a safe
        way to store passwords.
      </p>
    </>
  )
}
