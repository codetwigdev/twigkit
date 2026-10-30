import { useState } from 'react'
import Field from '../../ui/Field.jsx'
import Output from '../../ui/Output.jsx'
import { base64Encode, base64Decode, urlEncode, urlDecode } from './logic.js'

// The component only holds state and wires inputs to logic.js. No real logic here.
export default function Tool() {
  const [mode, setMode] = useState('base64')
  const [action, setAction] = useState('encode')
  const [input, setInput] = useState('')

  const result = (() => {
    if (mode === 'base64') {
      return action === 'encode' ? base64Encode(input) : base64Decode(input)
    }
    return action === 'encode' ? urlEncode(input) : urlDecode(input)
  })()

  return (
    <>
      <Field label="Mode">
        {(id) => (
          <select id={id} value={mode} onChange={(e) => setMode(e.target.value)}>
            <option value="base64">Base64</option>
            <option value="url">URL</option>
          </select>
        )}
      </Field>
      <Field label="Input">
        {(id) => (
          <textarea
            id={id}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type or paste text..."
          />
        )}
      </Field>
      <div className="row">
        <button
          type="button"
          className="btn"
          onClick={() => setAction('encode')}
          aria-pressed={action === 'encode'}
        >
          Encode
        </button>
        <button
          type="button"
          className="btn"
          onClick={() => setAction('decode')}
          aria-pressed={action === 'decode'}
        >
          Decode
        </button>
      </div>
      <Output value={result.ok ? result.output : ''} error={result.ok ? '' : result.error} />
    </>
  )
}
