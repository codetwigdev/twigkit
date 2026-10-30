import { lazy } from 'react'

export default {
  id: "regex-tester",
  name: "Regex Tester",
  description: "Test regular expressions against sample text.",
  icon: ".*",
  component: lazy(() => import('./Tool.jsx')),
}
