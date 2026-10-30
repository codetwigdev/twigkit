import { useState } from 'react'
import Field from '../../ui/Field.jsx'
import Output from '../../ui/Output.jsx'
import { escapeHtml, unescapeHtml } from './logic.js'

export default function Tool() {
  const [text, setText] = useState('')
  const [action, setAction] = useState('escape')

  const result = text === '' ? { ok: true, output: '' } : action === 'escape' ? escapeHtml(text) : unescapeHtml(text)

  return (
    <>
      <Field label="Text">
        {(id) => (
          <textarea
            id={id}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste HTML..."
          />
        )}
      </Field>
      <div className="row">
        <button
          type="button"
          className="btn primary"
          aria-pressed={action === 'escape'}
          onClick={() => setAction('escape')}
        >
          Escape
        </button>
        <button
          type="button"
          className="btn"
          aria-pressed={action === 'unescape'}
          onClick={() => setAction('unescape')}
        >
          Unescape
        </button>
      </div>
      <Output value={result.output} error={result.error} />
    </>
  )
}
