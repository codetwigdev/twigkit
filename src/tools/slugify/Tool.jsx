import { useState } from 'react'
import Field from '../../ui/Field.jsx'
import Output from '../../ui/Output.jsx'
import { slugify } from './logic.js'

// The component only holds state and wires inputs to logic.js. No real logic here.
export default function Tool() {
  const [text, setText] = useState('')
  const [separator, setSeparator] = useState('-')

  return (
    <>
      <Field label="Text">
        {(id) => (
          <textarea
            id={id}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste a title..."
          />
        )}
      </Field>
      <Field label="Separator">
        {(id) => (
          <select id={id} value={separator} onChange={(e) => setSeparator(e.target.value)}>
            <option value="-">dash (-)</option>
            <option value="_">underscore (_)</option>
          </select>
        )}
      </Field>
      <Output value={slugify(text, { separator })} />
    </>
  )
}
