import { useState } from 'react'
import Field from '../../ui/Field.jsx'
import Output from '../../ui/Output.jsx'
import { uuidV4, randomString } from './logic.js'

export default function Tool() {
  const [uuids, setUuids] = useState(() => [uuidV4()])
  const [count, setCount] = useState(1)

  const [length, setLength] = useState(16)
  const [upper, setUpper] = useState(true)
  const [lower, setLower] = useState(true)
  const [digits, setDigits] = useState(true)
  const [symbols, setSymbols] = useState(false)
  const [result, setResult] = useState(() => randomString())

  function generateUuids() {
    setUuids(Array.from({ length: count }, () => uuidV4()))
  }

  function generateRandom() {
    setResult(randomString({ length, upper, lower, digits, symbols }))
  }

  return (
    <>
      <h2>UUID v4</h2>
      <div className="row">
        <Field label="Count">
          {(id) => (
            <select id={id} value={count} onChange={(e) => setCount(Number(e.target.value))}>
              <option value={1}>1</option>
              <option value={5}>5</option>
              <option value={10}>10</option>
            </select>
          )}
        </Field>
        <button type="button" className="btn" onClick={generateUuids}>Generate</button>
      </div>
      <Output value={uuids.join('\n')} />

      <h2>Random string</h2>
      <div className="row">
        <Field label="Length">
          {(id) => (
            <input
              id={id}
              type="number"
              min="1"
              max="1024"
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
            />
          )}
        </Field>
        <label className="field">
          <input type="checkbox" checked={upper} onChange={(e) => setUpper(e.target.checked)} />
          A-Z
        </label>
        <label className="field">
          <input type="checkbox" checked={lower} onChange={(e) => setLower(e.target.checked)} />
          a-z
        </label>
        <label className="field">
          <input type="checkbox" checked={digits} onChange={(e) => setDigits(e.target.checked)} />
          0-9
        </label>
        <label className="field">
          <input type="checkbox" checked={symbols} onChange={(e) => setSymbols(e.target.checked)} />
          Symbols
        </label>
        <button type="button" className="btn" onClick={generateRandom}>Generate</button>
      </div>
      <Output value={result.ok ? result.output : ''} error={result.ok ? '' : result.error} />
    </>
  )
}
