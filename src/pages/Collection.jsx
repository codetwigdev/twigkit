import { useState } from 'react'
import { groups, matchTools, numberOf, pad, total } from '../catalog.js'
import ToolTile from '../ui/chrome/ToolTile.jsx'
import './Collection.css'

function Arrow() {
  return (
    <svg className="icon-arrow" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  )
}

export default function Collection({ query = '' }) {
  const [cat, setCat] = useState('all')
  const q = query.trim()
  const matched = new Set(matchTools(q).map((t) => t.id))

  const shown = groups
    .filter((g) => cat === 'all' || g.category.id === cat)
    .map((g) => ({ ...g, tools: g.tools.filter((t) => matched.has(t.id)) }))
    .filter((g) => g.tools.length > 0)
  const count = shown.reduce((n, g) => n + g.tools.length, 0)
  const filtering = q !== '' || cat !== 'all'

  const pills = [{ id: 'all', name: 'All', n: matchTools('').length }].concat(
    groups.map((g) => ({ id: g.category.id, name: g.category.name, n: g.tools.length })),
  )

  return (
    <section className="collection" aria-labelledby="collection-title">
      <div className="section-head">
        <div>
          <p className="eyebrow">The collection</p>
          <h2 className="section-title" id="collection-title">
            Pick a tool.
          </h2>
        </div>
        <p className="section-count" aria-live="polite">
          {filtering ? `${pad(count)} of ` : ''}
          {total}
        </p>
      </div>

      <div className="filters" role="group" aria-label="Filter by category">
        {pills.map((p) => (
          <button
            key={p.id}
            type="button"
            className={p.id === cat ? 'filter is-active' : 'filter'}
            aria-pressed={p.id === cat}
            onClick={() => setCat(p.id)}
          >
            {p.name} <span className="filter-n">{p.n}</span>
          </button>
        ))}
      </div>

      {shown.length > 0 ? (
        shown.map((g) => (
          <div key={g.category.id} className="group">
            <div className="group-head">
              <h3 className="group-name">{g.category.name}</h3>
              {g.category.blurb && <p className="group-blurb">{g.category.blurb}</p>}
              <span className="group-count">{pad(g.tools.length)}</span>
            </div>
            <ul className="cards">
              {g.tools.map((t) => (
                <li key={t.id}>
                  <a className="card" href={`#/${t.id}`}>
                    <div className="card-top">
                      <ToolTile glyph={t.icon} size="md" />
                      <span className="card-num">No. {numberOf(t)}</span>
                    </div>
                    <h4 className="card-name">{t.name}</h4>
                    <p className="card-desc">{t.description}</p>
                    <span className="card-cta">
                      Open <Arrow />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))
      ) : (
        <p className="collection-empty">
          No tool matches “{q}”{cat !== 'all' ? ' in this category' : ''}.{' '}
          <a href="#/about">Build your own</a>
        </p>
      )}
    </section>
  )
}
