import './chrome.css'

export default function Brand() {
  return (
    <a className="brand" href="#/" aria-label="TwigKit home">
      <svg className="brand-mark" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 21.5V9" />
        <path d="M12 13.5c0-3.3 2.4-5.5 5.5-5.5 0 3.3-2.4 5.5-5.5 5.5z" />
        <path d="M12 18c0-3.3-2.4-5.5-5.5-5.5 0 3.3 2.4 5.5 5.5 5.5z" />
        <path d="M12 9c0-2.8 1-5 2.5-6.5" />
      </svg>
      <span className="brand-name">TwigKit</span>
    </a>
  )
}
