import { useEffect } from 'react'
import useRoute from './shell/useRoute.js'
import Workspace from './shell/Workspace.jsx'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'

const HOME_TITLE = 'TwigKit — Tiny tools, done beautifully'

function focusMain(e) {
  e.preventDefault()
  const main = document.getElementById('main')
  if (!main) return
  main.focus()
  if (typeof main.scrollIntoView === 'function') main.scrollIntoView()
}

export default function App() {
  const route = useRoute()

  useEffect(() => {
    document.title =
      route.kind === 'tool'
        ? `${route.tool.name} · TwigKit`
        : route.kind === 'about'
          ? "How it's built · TwigKit"
          : HOME_TITLE
    if (typeof window.scrollTo === 'function') window.scrollTo(0, 0)
  }, [route.kind, route.tool])

  return (
    <>
      <a className="skip-link" href="#/" onClick={focusMain}>
        Skip to content
      </a>
      {route.kind === 'tool' ? (
        <Workspace tool={route.tool} />
      ) : route.kind === 'about' ? (
        <About />
      ) : (
        <Home />
      )}
    </>
  )
}
