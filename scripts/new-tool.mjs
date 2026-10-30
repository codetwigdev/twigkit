// Scaffold a new tool folder with stubs.
//   node scripts/new-tool.mjs <id> "<Name>" "<description>" <icon> <fn1,fn2,...>
// Creates src/tools/<id>/{index.js,logic.js,Tool.jsx}. Never overwrites existing files.
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const [id, name, description, icon, fns = ''] = process.argv.slice(2)
if (!id || !name || !description || !icon) {
  console.error('usage: new-tool.mjs <id> "<Name>" "<description>" <icon> [fn1,fn2]')
  process.exit(1)
}

const dir = join('src', 'tools', id)
mkdirSync(dir, { recursive: true })

function write(file, content) {
  const path = join(dir, file)
  if (existsSync(path)) return console.log(`skip   ${path} (exists)`)
  writeFileSync(path, content)
  console.log(`create ${path}`)
}

write(
  'index.js',
  `import { lazy } from 'react'

export default {
  id: ${JSON.stringify(id)},
  name: ${JSON.stringify(name)},
  description: ${JSON.stringify(description)},
  icon: ${JSON.stringify(icon)},
  component: lazy(() => import('./Tool.jsx')),
}
`,
)

const exportsList = fns.split(',').filter(Boolean)
write(
  'logic.js',
  exportsList
    .map(
      (fn) => `export function ${fn}() {
  throw new Error('not implemented')
}
`,
    )
    .join('\n') || '// TODO\n',
)

write(
  'Tool.jsx',
  `export default function Tool() {
  return <p className="muted">Not implemented yet.</p>
}
`,
)
