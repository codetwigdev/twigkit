import { Suspense } from 'react'
import { categoryOf, numberOf, total } from '../catalog.js'
import { articlesForTool, readingTime } from '../articles/registry.js'
import Rail from './Rail.jsx'
import './Workspace.css'

function Arrow() {
  return (
    <svg className="icon-arrow" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  )
}

export default function Workspace({ tool }) {
  const Tool = tool.component
  const related = articlesForTool(tool.id)[0]

  return (
    <div className="ws">
      <Rail tool={tool} />

      <main id="main" tabIndex={-1} className="ws-main">
        <header className="tool-head">
          <p className="eyebrow">
            Tool {numberOf(tool)} of {total} · {categoryOf(tool).name}
          </p>
          <h1 className="tool-title">{tool.name}</h1>
          <p className="tool-desc">{tool.description}</p>
        </header>
        <div className="tool-body">
          <Suspense fallback={<p className="tool-loading">Loading…</p>}>
            <Tool key={tool.id} />
          </Suspense>
        </div>
        {related && (
          <aside className="tool-related" aria-label="Related article">
            <p className="eyebrow">From the notebook</p>
            <a className="tool-related-link" href={`#/articles/${related.slug}`}>
              {related.title} <Arrow />
            </a>
            <p className="tool-related-meta">
              {related.summary} <span className="tool-related-time">{readingTime(related)}</span>
            </p>
          </aside>
        )}
        <p className="ws-foot">
          Nothing you type leaves this tab. <a href="#/">All tools</a> ·{' '}
          <a href="#/articles">Articles</a> · <a href="#/about">How it's built</a>
        </p>
      </main>
    </div>
  )
}
