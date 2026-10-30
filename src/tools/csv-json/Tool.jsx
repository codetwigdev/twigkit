import { useState } from 'react'
import Field from '../../ui/Field.jsx'
import Output from '../../ui/Output.jsx'
import { csvToJson, jsonToCsv } from './logic.js'

const DELIMITERS = [
  { value: ',', label: 'Comma (,)' },
  { value: ';', label: 'Semicolon (;)' },
  { value: '\t', label: 'Tab' },
  { value: '|', label: 'Pipe (|)' },
]

export default function Tool() {
  const [mode, setMode] = useState('csvToJson')
  const [delimiter, setDelimiter] = useState(',')
  const [header, setHeader] = useState(true)
  const [input, setInput] = useState('')

  const empty = input.trim() === ''
  const result =
    mode === 'csvToJson'
      ? csvToJson(input, { delimiter, header })
      : jsonToCsv(input, { delimiter })

  const showOutput = !empty && result.ok
  const showError = !empty && !result.ok

  return (
    <>
      <Field label="Mode">
        {(id) => (
          <select id={id} value={mode} onChange={(e) => setMode(e.target.value)}>
            <option value="csvToJson">CSV to JSON</option>
            <option value="jsonToCsv">JSON to CSV</option>
          </select>
        )}
      </Field>
      <Field label="Delimiter">
        {(id) => (
          <select id={id} value={delimiter} onChange={(e) => setDelimiter(e.target.value)}>
            {DELIMITERS.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </select>
        )}
      </Field>
      {mode === 'csvToJson' && (
        <div className="row">
          <label>
            <input
              type="checkbox"
              checked={header}
              onChange={(e) => setHeader(e.target.checked)}
            />{' '}
            First row is a header
          </label>
        </div>
      )}
      <Field label="Input">
        {(id) => (
          <textarea
            id={id}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your data here..."
          />
        )}
      </Field>
      {showOutput && <Output value={result.output} />}
      {showError && <Output error={result.error} />}
    </>
  )
}
