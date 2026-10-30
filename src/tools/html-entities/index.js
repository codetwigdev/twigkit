import { lazy } from 'react'

export default {
  id: "html-entities",
  name: "HTML Entities",
  description: "Escape and unescape HTML special characters.",
  icon: "&;",
  component: lazy(() => import('./Tool.jsx')),
}
