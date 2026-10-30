import { useState } from 'react'

export default function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    } catch {
      // clipboard unavailable (insecure context); nothing sensible to do
    }
  }

  return (
    <button type="button" className="btn" onClick={copy} disabled={!text}>
      {copied ? 'Copied' : 'Copy'}
    </button>
  )
}
