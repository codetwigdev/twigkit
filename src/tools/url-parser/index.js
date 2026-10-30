import { lazy } from 'react'

export default {
  id: "url-parser",
  name: "URL Parser",
  description: "Break a URL into its parts and query parameters.",
  icon: "?=",
  category: 'data',
  component: lazy(() => import('./Tool.jsx')),
}
