import { lazy } from 'react'

export default {
  id: "line-tools",
  name: "Line Tools",
  description: "Sort, deduplicate, trim and reverse lines of text.",
  icon: "ln",
  component: lazy(() => import('./Tool.jsx')),
}
