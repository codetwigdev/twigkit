import { lazy } from 'react'

export default {
  id: "text-stats",
  name: "Text Stats",
  description: "Count words and characters, convert text case.",
  icon: "Aa",
  component: lazy(() => import('./Tool.jsx')),
}
