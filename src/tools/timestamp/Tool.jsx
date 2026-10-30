import { useState } from 'react'
import Field from '../../ui/Field.jsx'
import Output from '../../ui/Output.jsx'
import { fromUnix, toUnix } from './logic.js'

export default function Tool() {
  const [unixInput, setUnixInput] = useState('')
  const [unit, setUnit] = useState('auto')
  const [dateInput, setDateInput] = useState('')

  const unixResult = unixInput.trim() ? fromUnix(unixInput, unit) : null
  const dateResult = dateInput.trim() ? toUnix(dateInput) : null

  function handleNow() {
    setUnixInput(String(Math.floor(Date.now() / 1000)))
  }

  return (
    <div className="grid-2">
      <div>
        <h2>Unix to date</h2>
        <Field label="Unix timestamp">
          {(id) => (
            <input
              id={id}
              type="text"
              value={unixInput}
              onChange={(e) => setUnixInput(e.target.value)}
              placeholder="1700000000"
            />
          )}
        </Field>
        <Field label="Unit">
          {(id) => (
            <select id={id} value={unit} onChange={(e) => setUnit(e.target.value)}>
              <option value="auto">Auto</option>
              <option value="seconds">Seconds</option>
              <option value="milliseconds">Milliseconds</option>
            </select>
          )}
        </Field>
        <div className="row">
          <button type="button" className="btn" onClick={handleNow}>
            Now
          </button>
        </div>
        {unixResult && unixResult.ok ? (
          <Output
            value={`ISO: ${unixResult.iso}\nUTC: ${unixResult.utc}\nLocal: ${new Date(
              unixResult.unit === 'milliseconds'
                ? unixInput.trim() === ''
                  ? 0
                  : Number(unixInput.trim())
                : Number(unixInput.trim()) * 1000
            ).toLocaleString()}`}
          />
        ) : unixResult ? (
          <Output error={unixResult.error} />
        ) : (
          <Output />
        )}
      </div>
      <div>
        <h2>Date to Unix</h2>
        <Field label="Date">
          {(id) => (
            <input
              id={id}
              type="text"
              value={dateInput}
              onChange={(e) => setDateInput(e.target.value)}
              placeholder="2023-11-14T22:13:20Z"
            />
          )}
        </Field>
        {dateResult && dateResult.ok ? (
          <Output
            value={`Seconds: ${dateResult.seconds}\nMilliseconds: ${dateResult.milliseconds}`}
          />
        ) : dateResult ? (
          <Output error={dateResult.error} />
        ) : (
          <Output />
        )}
      </div>
    </div>
  )
}
