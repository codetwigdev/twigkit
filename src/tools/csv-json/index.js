import { lazy } from 'react'

export default {
  id: "csv-json",
  name: "CSV / JSON",
  description: "Convert between CSV and JSON.",
  icon: "[]",
  category: 'data',
  component: lazy(() => import('./Tool.jsx')),
}
