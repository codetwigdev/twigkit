import { lazy } from 'react'

export default {
  id: "cron",
  name: "Cron Explainer",
  description: "Read a cron expression in plain English and see the next runs.",
  icon: "*/",
  component: lazy(() => import('./Tool.jsx')),
}
