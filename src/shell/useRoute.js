import { useEffect, useState } from 'react'
import { tools } from '../registry.js'

// '#/json-formatter' -> { kind: 'tool', tool }, '#/about' -> about, anything else -> home
export function parseHash(hash) {
  const path = (hash || '').replace(/^#\/?/, '').replace(/\/+$/, '')
  if (path === '') return { kind: 'home', tool: null }
  if (path === 'about') return { kind: 'about', tool: null }
  const tool = tools.find((t) => t.id === path)
  return tool ? { kind: 'tool', tool } : { kind: 'home', tool: null }
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
