import { useState } from 'react'
import Field from '../../ui/Field.jsx'
import Output from '../../ui/Output.jsx'
import { formatJson, minifyJson } from './logic.js'

// The component only holds state and wires inputs to logic.js. No real logic here.
export default function Tool() {
  const [text, setText] = useState('')
  const [indent, setIndent] = useState(2)
  const [sortKeys, setSortKeys] = useState(false)
  const [action, setAction] = useState('format')

  const hasInput = text.trim() !== ''
  const result = hasInput
    ? action === 'minify'
      ? minifyJson(text)
      : formatJson(text, { indent, sortKeys })
    : null

  return (
    <>
      <Field label="JSON">
        {(id) => (
          <textarea
            id={id}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder='Paste JSON here...'
            rows={10}
          />
        )}
      </Field>
      <div className="row">
        <Field label="Indent">
          {(id) => (
            <select id={id} value={indent} onChange={(e) => setIndent(Number(e.target.value))}>
              <option value={2}>2 spaces</option>
              <option value={4}>4 spaces</option>
            </select>
          )}
        </Field>
        <label>
          <input
            type="checkbox"
            checked={sortKeys}
            onChange={(e) => setSortKeys(e.target.checked)}
          />{' '}
          Sort keys
        </label>
      </div>
      <div className="row">
        <button type="button" className="btn" onClick={() => setAction('format')}>
          Format
        </button>
        <button type="button" className="btn" onClick={() => setAction('minify')}>
          Minify
        </button>
      </div>
      {result && <Output value={result.output} error={result.error} />}
    </>
  )
}
