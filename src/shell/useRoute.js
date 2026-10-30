import { useEffect, useState } from 'react'
import { tools } from '../registry.js'
import { articleBySlug } from '../articles/registry.js'

const HOME = { kind: 'home', tool: null, article: null }

// '#/json-formatter' -> tool, '#/about' -> about, '#/articles' -> articles,
// '#/articles/<slug>' -> article (or articles when the slug is unknown), else home
export function parseHash(hash) {
  const path = (hash || '').replace(/^#\/?/, '').replace(/\/+$/, '')
  if (path === '') return HOME
  if (path === 'about') return { kind: 'about', tool: null, article: null }
  if (path === 'articles') return { kind: 'articles', tool: null, article: null }
  if (path.startsWith('articles/')) {
    const article = articleBySlug(path.slice('articles/'.length))
    return article
      ? { kind: 'article', tool: null, article }
      : { kind: 'articles', tool: null, article: null }
  }
  const tool = tools.find((t) => t.id === path)
  return tool ? { kind: 'tool', tool, article: null } : HOME
}

export default function useRoute() {
  const [route, setRoute] = useState(() => parseHash(window.location.hash))

  useEffect(() => {
    const onHash = () => setRoute(parseHash(window.location.hash))
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  return route
}
