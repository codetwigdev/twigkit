import { useState } from 'react'
import Field from '../../ui/Field.jsx'
import { convertCase, countText } from './logic.js'

const MODES = [
  { mode: 'upper', label: 'UPPER' },
  { mode: 'lower', label: 'lower' },
  { mode: 'title', label: 'Title Case' },
  { mode: 'camel', label: 'camelCase' },
  { mode: 'pascal', label: 'PascalCase' },
  { mode: 'snake', label: 'snake_case' },
  { mode: 'kebab', label: 'kebab-case' },
]

export default function Tool() {
  const [text, setText] = useState('')
  const stats = countText(text)

  return (
    <>
      <Field label="Text">
        {(id) => (
          <textarea
            id={id}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste some text..."
          />
        )}
      </Field>
      <div className="stat-grid">
        <div className="stat">
          <span className="muted">Characters</span>
          <strong>{stats.characters}</strong>
        </div>
        <div className="stat">
          <span className="muted">Without spaces</span>
          <strong>{stats.charactersNoSpaces}</strong>
        </div>
        <div className="stat">
          <span className="muted">Words</span>
          <strong>{stats.words}</strong>
        </div>
        <div className="stat">
          <span className="muted">Lines</span>
          <strong>{stats.lines}</strong>
        </div>
        <div className="stat">
          <span className="muted">Reading time</span>
          <strong>{stats.readingMinutes} min</strong>
        </div>
      </div>
      <div className="row">
        {MODES.map(({ mode, label }) => (
          <button
            key={mode}
            type="button"
            className="btn"
            onClick={() => setText(convertCase(text, mode))}
          >
            {label}
          </button>
        ))}
      </div>
    </>
  )
}
