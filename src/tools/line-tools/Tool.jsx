import { useState } from 'react'
import Field from '../../ui/Field.jsx'
import Output from '../../ui/Output.jsx'
import { processLines } from './logic.js'

export default function Tool() {
  const [text, setText] = useState('')
  const [sort, setSort] = useState('none')
  const [dedupe, setDedupe] = useState(false)
  const [trim, setTrim] = useState(false)
  const [removeEmpty, setRemoveEmpty] = useState(false)
  const [reverse, setReverse] = useState(false)
  const [ignoreCase, setIgnoreCase] = useState(false)

  const result = processLines(text, { sort, dedupe, trim, removeEmpty, reverse, ignoreCase })

  return (
    <>
      <Field label="Lines">
        {(id) => (
          <textarea
            id={id}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste lines..."
          />
        )}
      </Field>
      <Field label="Sort">
        {(id) => (
          <select id={id} value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="none">None</option>
            <option value="asc">A to Z</option>
            <option value="desc">Z to A</option>
            <option value="length">By length</option>
          </select>
        )}
      </Field>
      <div className="row">
        <label>
          <input
            type="checkbox"
            checked={dedupe}
            onChange={(e) => setDedupe(e.target.checked)}
          />{' '}
          Remove duplicates
        </label>
        <label>
          <input
            type="checkbox"
            checked={trim}
            onChange={(e) => setTrim(e.target.checked)}
          />{' '}
          Trim whitespace
        </label>
        <label>
          <input
            type="checkbox"
            checked={removeEmpty}
            onChange={(e) => setRemoveEmpty(e.target.checked)}
          />{' '}
          Remove empty lines
        </label>
        <label>
          <input
            type="checkbox"
            checked={reverse}
            onChange={(e) => setReverse(e.target.checked)}
          />{' '}
          Reverse order
        </label>
        <label>
          <input
            type="checkbox"
            checked={ignoreCase}
            onChange={(e) => setIgnoreCase(e.target.checked)}
          />{' '}
          Ignore case
        </label>
      </div>
      <p className="muted">
        {result.before} lines to {result.after} lines
      </p>
      <Output value={result.output} />
    </>
  )
}
