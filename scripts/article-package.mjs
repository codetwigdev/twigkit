// Turn article outlines into work packages for scripts/team.mjs.
//   node scripts/article-package.mjs <slug> [<slug> ...]
// Reads docs/articles/outlines/<slug>.md and writes docs/work/articles/NN-<slug>.md. The package
// owns src/articles/<slug>.js; the style guide and the outline are its shared context.
import { existsSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const OUT = join('docs', 'work', 'articles')
const slugs = process.argv.slice(2)
if (!slugs.length) {
  console.error('usage: article-package.mjs <slug> [...]')
  process.exit(1)
}
mkdirSync(OUT, { recursive: true })
const existing = readdirSync(OUT).filter((f) => /^\d\d-/.test(f) && !f.startsWith('00-'))
let n = existing.length

for (const slug of slugs) {
  const outline = `docs/articles/outlines/${slug}.md`
  if (!existsSync(outline)) throw new Error(`missing ${outline}`)
  const name = existing.find((f) => f.endsWith(`-${slug}.md`)) ?? `${String(++n).padStart(2, '0')}-${slug}.md`
  const body = `---
files:
  - src/articles/${slug}.js
shared:
  - docs/articles/STYLE.md
  - ${outline}
---
# Article: \`${slug}\`

Write this article as the module \`src/articles/${slug}.js\`. The style guide (voice,
facts policy, data format) and the outline with the facts you may use are in the shared
context above. Follow the outline's facts and examples; do not add claims it does not
contain. The module must satisfy the structure test (4 to 8 \`h2\` headings, at least one
code block, exactly one callout, 550 to 1,100 words of prose, internal links only, and a
closing link to the related tool when the outline names one).
`
  writeFileSync(join(OUT, name), body)
  console.log(`wrote ${join(OUT, name)}`)
}
