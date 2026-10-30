import { useState } from 'react'
import Field from '../../ui/Field.jsx'
import Output from '../../ui/Output.jsx'
import { convertBase } from './logic.js'

export default function Tool() {
  const [input, setInput] = useState('')
  const [base, setBase] = useState(10)

  const result = input.trim() === '' ? null : convertBase(input, base)
  const error = result && !result.ok ? result.error : ''

  return (
    <>
      <Field label="Number">
        {(id) => (
          <input
            id={id}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type or paste a number..."
          />
        )}
      </Field>
      <Field label="Base">
        {(id) => (
          <select id={id} value={base} onChange={(e) => setBase(Number(e.target.value))}>
            <option value={2}>Binary 2</option>
            <option value={8}>Octal 8</option>
            <option value={10}>Decimal 10</option>
            <option value={16}>Hexadecimal 16</option>
          </select>
        )}
      </Field>
      {error && <p className="error" role="alert">{error}</p>}
      <div className="grid-2">
        <div className="row">
          <label className="muted">Binary</label>
          <Output value={result ? result.bin : ''} />
        </div>
        <div className="row">
          <label className="muted">Octal</label>
          <Output value={result ? result.oct : ''} />
        </div>
        <div className="row">
          <label className="muted">Decimal</label>
          <Output value={result ? result.dec : ''} />
        </div>
        <div className="row">
          <label className="muted">Hexadecimal</label>
          <Output value={result ? result.hex : ''} />
        </div>
      </div>
    </>
  )
}
