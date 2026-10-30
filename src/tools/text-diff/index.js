import { lazy } from 'react'

export default {
  id: "text-diff",
  name: "Text Diff",
  description: "Compare two texts line by line.",
  icon: "+-",
  category: 'text',
  component: lazy(() => import('./Tool.jsx')),
}
