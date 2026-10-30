import { lazy } from 'react'

export default {
  id: "hash",
  name: "Hash Generator",
  description: "SHA-1, SHA-256, SHA-384 and SHA-512 of any text.",
  icon: "##",
  component: lazy(() => import('./Tool.jsx')),
}
