import './About.css'

const WORKERS = ['json', 'base64', 'timestamp', 'color', 'uuid', 'diff', 'regex', 'stats']

export default function FlowDiagram() {
  return (
    <figure className="flow">
      <ol className="flow-steps">
        <li className="flow-step">
          <span className="flow-num" aria-hidden="true">1</span>
          <span className="flow-who">Claude</span>
          <h3 className="flow-title">Architect writes specs and tests</h3>
          <p className="flow-text">The shell, the shared UI, one spec and one test file per tool.</p>
        </li>
        <li className="flow-step">
          <span className="flow-num" aria-hidden="true">2</span>
          <span className="flow-who">Qwen × 8</span>
          <h3 className="flow-title">Workers implement in parallel</h3>
          <p className="flow-text">Each worker gets one spec and returns logic.js and Tool.jsx.</p>
          <ul className="flow-workers" aria-label="Eight workers, one tool each">
            {WORKERS.map((w) => (
              <li key={w}>{w === 'timestamp' ? 'time' : w}</li>
            ))}
          </ul>
        </li>
        <li className="flow-step">
          <span className="flow-num" aria-hidden="true">3</span>
          <span className="flow-who">vitest + oxlint</span>
          <h3 className="flow-title">Tests and lint verify</h3>
          <p className="flow-text">89 tests and a lint pass, about 14 seconds for the whole set.</p>
        </li>
        <li className="flow-step">
          <span className="flow-num" aria-hidden="true">4</span>
          <span className="flow-who">Claude</span>
          <h3 className="flow-title">Architect reviews in a browser</h3>
          <p className="flow-text">Passing tests is necessary, not sufficient.</p>
        </li>
      </ol>
      <figcaption className="flow-loop">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M4 12a8 8 0 0 1 13.7-5.7L20 8.5" />
          <path d="M20 4v4.5h-4.5" />
          <path d="M20 12a8 8 0 0 1-13.7 5.7L4 15.5" />
          <path d="M4 20v-4.5h4.5" />
        </svg>
        <span>
          A failing test or lint error goes straight back to the worker that wrote it, up to
          three attempts, before anything reaches review.
        </span>
      </figcaption>
    </figure>
  )
}
