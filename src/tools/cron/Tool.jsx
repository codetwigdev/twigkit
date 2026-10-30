import { useState } from 'react'
import Field from '../../ui/Field.jsx'
import Output from '../../ui/Output.jsx'
import { explainCron, nextRuns } from './logic.js'

const FIELD_LABELS = ['minute', 'hour', 'day of month', 'month', 'day of week']

export default function Tool() {
  const [expr, setExpr] = useState('0 9 * * 1-5')

  const trimmed = expr.trim()
  const explain = trimmed ? explainCron(trimmed) : null
  const runs = explain && explain.ok ? nextRuns(trimmed, new Date()) : null
  const parts = trimmed ? trimmed.split(/\s+/) : []

  return (
    <>
      <Field label="Cron expression">
        {(id) => (
          <input
            id={id}
            type="text"
            value={expr}
            onChange={(e) => setExpr(e.target.value)}
            placeholder="0 9 * * 1-5"
            style={{ fontFamily: 'monospace' }}
          />
        )}
      </Field>
      {explain && explain.ok && (
        <>
          <p>{explain.summary}</p>
          <div className="stat-grid">
            {parts.map((p, i) => (
              <div className="stat" key={i}>
                <span className="muted">{FIELD_LABELS[i]}</span>
                <span>{p}</span>
              </div>
            ))}
          </div>
          <p className="muted">Next 5 runs (UTC)</p>
          <Output value={runs.runs.join('\n')} />
          <p className="muted">Times are shown in UTC. Check which time zone your scheduler uses.</p>
        </>
      )}
      {explain && !explain.ok && <Output error={explain.error} />}
    </>
  )
}
