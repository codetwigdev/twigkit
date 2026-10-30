import { articles, formatDate, readingTime } from '../articles/registry.js'
import './NotebookTeaser.css'

function Arrow() {
  return (
    <svg className="icon-arrow" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  )
}

export default function NotebookTeaser() {
  const recent = articles.slice(0, 3)
  if (recent.length === 0) return null

  return (
    <section className="notebook" aria-labelledby="notebook-title">
      <div className="notebook-inner">
        <div className="notebook-head">
          <div>
            <p className="eyebrow">From the notebook</p>
            <h2 className="notebook-title" id="notebook-title">
              Recent notes.
            </h2>
          </div>
          <a className="notebook-link" href="#/articles">
            All articles <Arrow />
          </a>
        </div>
        <ul className="notes">
          {recent.map((a) => (
            <li key={a.slug}>
              <a className="note" href={`#/articles/${a.slug}`}>
                <time className="note-date" dateTime={a.date}>
                  {formatDate(a.date)}
                </time>
                <h3 className="note-title">{a.title}</h3>
                <p className="note-summary">{a.summary}</p>
                <span className="note-meta">{readingTime(a)}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
