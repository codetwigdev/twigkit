import { useEffect } from 'react'
import useRoute from './shell/useRoute.js'
import Workspace from './shell/Workspace.jsx'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Articles from './pages/Articles.jsx'
import Article from './pages/Article.jsx'

const HOME_TITLE = 'TwigKit — Tiny tools, done beautifully'

function titleFor(route) {
  if (route.kind === 'tool') return `${route.tool.name} · TwigKit`
  if (route.kind === 'about') return "How it's built · TwigKit"
  if (route.kind === 'articles') return 'Articles · TwigKit'
  if (route.kind === 'article') return `${route.article.title} · TwigKit`
  return HOME_TITLE
}

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
    document.title = titleFor(route)
    if (typeof window.scrollTo === 'function') window.scrollTo(0, 0)
  }, [route])

  let page
  if (route.kind === 'tool') page = <Workspace tool={route.tool} />
  else if (route.kind === 'about') page = <About />
  else if (route.kind === 'articles') page = <Articles />
  else if (route.kind === 'article') page = <Article article={route.article} />
  else page = <Home />

  return (
    <>
      <a className="skip-link" href="#/" onClick={focusMain}>
        Skip to content
      </a>
      {page}
    </>
  )
}
