import { Suspense, useEffect, useState } from 'react'
import { tools } from './registry.js'

function currentId() {
  return window.location.hash.replace(/^#\/?/, '')
}

export default function App() {
  const [id, setId] = useState(currentId)

  useEffect(() => {
    const onHash = () => setId(currentId())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const active = tools.find((t) => t.id === id) ?? tools[0]
  const Tool = active?.component

  return (
    <div className="app">
      <nav className="sidebar">
        <h1 className="brand">TwigKit</h1>
        <ul>
          {tools.map((t) => (
            <li key={t.id}>
              <a
                href={`#/${t.id}`}
                className={t.id === active?.id ? 'active' : ''}
              >
                <span className="icon">{t.icon}</span>
                {t.name}
              </a>
            </li>
          ))}
        </ul>
        <p className="muted foot">Free and open source. Runs in your browser.</p>
      </nav>
      <main className="main">
        {active ? (
          <>
            <h2>{active.name}</h2>
            <p className="muted">{active.description}</p>
            <Suspense fallback={<p className="muted">Loading...</p>}>
              <Tool />
            </Suspense>
          </>
        ) : (
          <p className="muted">No tools installed.</p>
        )}
      </main>
    </div>
  )
}
