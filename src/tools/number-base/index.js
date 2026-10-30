import { lazy } from 'react'

export default {
  id: "number-base",
  name: "Number Base",
  description: "Convert numbers between binary, octal, decimal and hex.",
  icon: "0x",
  category: 'numbers',
  component: lazy(() => import('./Tool.jsx')),
}
