import { lazy } from 'react'

export default {
  id: "json-formatter",
  name: "JSON Formatter",
  description: "Format, validate and minify JSON.",
  icon: "{}",
  category: 'data',
  component: lazy(() => import('./Tool.jsx')),
}
