import { useState } from 'react'
import Field from '../../ui/Field.jsx'
import { testRegex } from './logic.js'

// The component only holds state and wires inputs to logic.js. No real logic here.
export default function Tool() {
  const [pattern, setPattern] = useState('')
  const [flags, setFlags] = useState('g')
  const [text, setText] = useState('')

  const result = pattern ? testRegex(pattern, flags, text) : null

  return (
    <>
      <div className="row">
        <Field label="Pattern">
          {(id) => (
            <input
              id={id}
              type="text"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              placeholder="e.g. \d+"
            />
          )}
        </Field>
        <Field label="Flags">
          {(id) => (
            <input
              id={id}
              type="text"
              value={flags}
              onChange={(e) => setFlags(e.target.value)}
              placeholder="g"
            />
          )}
        </Field>
      </div>
      <Field label="Test text">
        {(id) => (
          <textarea
            id={id}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste text to test..."
          />
        )}
      </Field>

      {result && result.ok && (
        <>
          <div className="out">{renderHighlighted(text, result.matches)}</div>
          <p className="muted">
            {result.matches.length} match{result.matches.length === 1 ? '' : 'es'}
            {result.truncated ? ' (truncated)' : ''}
          </p>
          <ul>
            {result.matches.map((m, i) => (
              <li key={i}>
                <span className="muted">
                  [{m.index}] {m.match}
                </span>
                {m.groups.length > 0 && (
                  <span className="muted">
                    {' '}
                    groups: {m.groups.join(', ')}
                  </span>
                )}
                {Object.keys(m.named).length > 0 && (
                  <span className="muted">
                    {' '}
                    named: {Object.entries(m.named).map(([k, v]) => `${k}=${v}`).join(', ')}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </>
      )}

      {result && !result.ok && <p className="error" role="alert">{result.error}</p>}
    </>
  )
}

function renderHighlighted(text, matches) {
  if (!matches.length) return text

  // Build segments from match indexes; skip zero-length matches when highlighting.
  const segments = []
  let pos = 0

  for (const m of matches) {
    const end = m.index + m.match.length
    if (end <= m.index) continue // zero-length match; skip highlighting

    if (m.index > pos) {
      segments.push(text.slice(pos, m.index))
    }
    segments.push(<mark key={m.index}>{text.slice(m.index, end)}</mark>)
    pos = end
  }

  if (pos < text.length) {
    segments.push(text.slice(pos))
  }

  return segments
}
