import './chrome.css'

// A tool's 1-2 character glyph in a small square. size: 'sm' (26px) | 'md' (44px) | 'lg' (56px)
export default function ToolTile({ glyph, size = 'md' }) {
  return (
    <span className={`tile tile-${size}`} aria-hidden="true">
      {glyph}
    </span>
  )
}
