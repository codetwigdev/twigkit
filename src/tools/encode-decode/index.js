import { lazy } from 'react'

export default {
  id: "encode-decode",
  name: "Base64 / URL",
  description: "Encode and decode Base64 and URL strings.",
  icon: "64",
  category: 'encode',
  component: lazy(() => import('./Tool.jsx')),
}
