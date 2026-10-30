import { lazy } from 'react'

export default {
  id: "color",
  name: "Color Converter",
  description: "Convert colors between hex, rgb and hsl.",
  icon: "#",
  category: 'pick',
  component: lazy(() => import('./Tool.jsx')),
}
