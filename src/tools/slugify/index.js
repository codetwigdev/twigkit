import { lazy } from 'react'

export default {
  id: 'slugify',
  name: 'Slugify',
  description: 'Turn a title into a clean URL slug.',
  icon: '/',
  component: lazy(() => import('./Tool.jsx')),
}
