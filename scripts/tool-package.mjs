// Turn a tool's spec and tests into a work package for scripts/team.mjs.
//   node scripts/tool-package.mjs <tool-id> [<tool-id> ...]
// Reads docs/specs/<id>.md and src/tools/<id>/logic.test.js (both must exist) and writes
// docs/work/tools/NN-<id>.md. The package owns logic.js and Tool.jsx and shares the
// worker guide, the shared UI and the reference tool as read-only context.
import { existsSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const OUT = join('docs', 'work', 'tools')
const ids = process.argv.slice(2)
if (!ids.length) {
  console.error('usage: tool-package.mjs <tool-id> [...]')
  process.exit(1)
}
mkdirSync(OUT, { recursive: true })

const existing = readdirSync(OUT).filter((f) => /^\d\d-/.test(f) && !f.startsWith('00-'))
let n = existing.length

for (const id of ids) {
  const spec = `docs/specs/${id}.md`
  const test = `src/tools/${id}/logic.test.js`
  for (const f of [spec, test]) if (!existsSync(f)) throw new Error(`missing ${f}`)
  const previous = existing.find((f) => f.endsWith(`-${id}.md`))
  const name = previous ?? `${String(++n).padStart(2, '0')}-${id}.md`
  const body = `---
files:
  - src/tools/${id}/logic.js
  - src/tools/${id}/Tool.jsx
shared:
  - docs/WORKER_GUIDE.md
  - src/ui/Field.jsx
  - src/ui/Output.jsx
  - src/ui/CopyButton.jsx
  - src/tools/slugify/logic.js
  - src/tools/slugify/Tool.jsx
  - ${spec}
  - ${test}
---
# Tool: \`${id}\`

Implement this tool. \`${test}\` is the contract and must pass; \`${spec}\` says what to
build (logic and UI). The worker guide, the shared UI components and a finished reference
tool (\`slugify\`) are in the shared context above. Write exactly these two files:
\`src/tools/${id}/logic.js\` and \`src/tools/${id}/Tool.jsx\`.
`
  writeFileSync(join(OUT, name), body)
  console.log(`wrote ${join(OUT, name)}`)
}
