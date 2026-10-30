import { useState } from 'react'
import Field from '../../ui/Field.jsx'
import { diffLines, diffStats } from './logic.js'

// The component only holds state and wires inputs to logic.js. No real logic here.
export default function Tool() {
  const [original, setOriginal] = useState('')
  const [changed, setChanged] = useState('')

  const bothEmpty = original === '' && changed === ''
  const diff = bothEmpty ? [] : diffLines(original, changed)
  const stats = diffStats(diff)
  const noChanges = diff.length > 0 && stats.added === 0 && stats.removed === 0

  return (
    <>
      <div className="grid-2">
        <Field label="Original">
          {(id) => (
            <textarea
              id={id}
              value={original}
              onChange={(e) => setOriginal(e.target.value)}
              placeholder="Paste original text..."
            />
          )}
        </Field>
        <Field label="Changed">
          {(id) => (
            <textarea
              id={id}
              value={changed}
              onChange={(e) => setChanged(e.target.value)}
              placeholder="Paste changed text..."
            />
          )}
        </Field>
      </div>
      {!bothEmpty && (
        <p className="muted">
          {noChanges ? 'No differences' : `${stats.added} added, ${stats.removed} removed`}
        </p>
      )}
      {diff.map((entry, i) => (
        <div
          key={i}
          className={`diff-line${entry.type === 'add' ? ' diff-add' : entry.type === 'remove' ? ' diff-remove' : ''}`}
        >
          {entry.type === 'add' ? '+ ' : entry.type === 'remove' ? '- ' : '  '}
          {entry.text}
        </div>
      ))}
    </>
  )
}
