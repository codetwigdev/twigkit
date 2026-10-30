import { lazy } from 'react'

export default {
  id: "timestamp",
  name: "Timestamp",
  description: "Convert between Unix timestamps and dates.",
  icon: "t",
  category: 'numbers',
  component: lazy(() => import('./Tool.jsx')),
}
