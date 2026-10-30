import CopyButton from './CopyButton.jsx'

// Read-only result box with a Copy button. Pass `error` to show a failure
// instead (a Result of { ok: false, error } maps straight onto these props).
export default function Output({ value = '', error = '' }) {
  if (error) return <p className="error" role="alert">{error}</p>
  return (
    <pre className="out" aria-label="Output">
      {value}
      <CopyButton text={value} />
    </pre>
  )
}
