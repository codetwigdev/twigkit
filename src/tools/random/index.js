import { lazy } from 'react'

export default {
  id: "random",
  name: "UUID / Random",
  description: "Generate UUIDs and random strings.",
  icon: "?",
  category: 'pick',
  component: lazy(() => import('./Tool.jsx')),
}
