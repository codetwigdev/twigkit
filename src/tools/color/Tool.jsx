import { useState } from 'react'
import Field from '../../ui/Field.jsx'
import Output from '../../ui/Output.jsx'
import { convertColor } from './logic.js'

export default function Tool() {
  const [color, setColor] = useState('#ff8000')
  const result = convertColor(color)

  return (
    <>
      <div className="row">
        <Field label="Color">
          {(id) => (
            <input
              id={id}
              type="text"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              placeholder="#ff8000"
            />
          )}
        </Field>
        <Field label="Pick">
          {(id) => (
            <input
              id={id}
              type="color"
              value={result.ok ? result.hex : '#000000'}
              onChange={(e) => setColor(e.target.value)}
            />
          )}
        </Field>
      </div>
      {result.ok && (
        <div className="row">
          <div className="swatch" style={{ background: result.hex }} />
        </div>
      )}
      <div className="grid-2">
        <div>
          <p className="muted">HEX</p>
          <Output value={result.ok ? result.hex : ''} error={result.ok ? '' : result.error} />
        </div>
        <div>
          <p className="muted">RGB</p>
          <Output value={result.ok ? result.rgb : ''} error={result.ok ? '' : result.error} />
        </div>
        <div>
          <p className="muted">HSL</p>
          <Output value={result.ok ? result.hsl : ''} error={result.ok ? '' : result.error} />
        </div>
      </div>
    </>
  )
}
