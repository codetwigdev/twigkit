import { useId } from 'react'

// Labelled form control. Pass a function as children to get the generated id:
//   <Field label="Input">{(id) => <textarea id={id} ... />}</Field>
export default function Field({ label, children }) {
  const id = useId()
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      {typeof children === 'function' ? children(id) : children}
    </div>
  )
}
