import { lazy } from 'react'

export default {
  id: "jwt-decoder",
  name: "JWT Decoder",
  description: "Decode a JSON Web Token and inspect its claims.",
  icon: "jw",
  component: lazy(() => import('./Tool.jsx')),
}
