import { useEffect, useState } from 'react'

export const THEME_KEY = 'twigkit-theme'
export const THEMES = ['auto', 'light', 'dark']

export function getTheme() {
  try {
    const v = localStorage.getItem(THEME_KEY)
    return v === 'light' || v === 'dark' ? v : 'auto'
  } catch {
    return 'auto'
  }
}

export function applyTheme(theme) {
  const el = document.documentElement
  if (theme === 'light' || theme === 'dark') el.dataset.theme = theme
  else delete el.dataset.theme
}

export function setTheme(theme) {
  try {
    if (theme === 'auto') localStorage.removeItem(THEME_KEY)
    else localStorage.setItem(THEME_KEY, theme)
  } catch {
    // storage unavailable; the theme still applies for this page view
  }
  applyTheme(theme)
  window.dispatchEvent(new CustomEvent('twigkit:theme', { detail: theme }))
}

export function nextTheme(theme) {
  return theme === 'auto' ? 'light' : theme === 'light' ? 'dark' : 'auto'
}

export function useTheme() {
  const [theme, set] = useState(getTheme)
  useEffect(() => {
    const onChange = (e) => set(e.detail)
    window.addEventListener('twigkit:theme', onChange)
    return () => window.removeEventListener('twigkit:theme', onChange)
  }, [])
  return [theme, setTheme]
}
