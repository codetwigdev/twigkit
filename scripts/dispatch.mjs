// Hand tools to Qwen workers and verify what comes back.
//
//   node scripts/dispatch.mjs [tool-id ...]      (no ids = every tool with a spec)
//
// Env: QWEN_URL   OpenAI-compatible base URL   (default http://localhost:8000/v1)
//      QWEN_MODEL model name                    (default Qwen3.8)
//      WORKERS     max parallel workers         (default 8)
//      ATTEMPTS    tries per tool               (default 3)
//
// For each tool a worker gets: the worker guide, the spec, the tests, the shared UI,
// and a finished reference tool. It replies with logic.js + Tool.jsx. We write them,
// run that tool's tests, and on failure send the test output back for another try.
import { execFile } from 'node:child_process'
import { readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { promisify } from 'node:util'

const run = promisify(execFile)
const URL_BASE = process.env.QWEN_URL ?? 'http://localhost:8000/v1'
const MODEL = process.env.QWEN_MODEL ?? 'Qwen3.8'
const WORKERS = Number(process.env.WORKERS ?? 8)
const ATTEMPTS = Number(process.env.ATTEMPTS ?? 3)
const REFERENCE = 'slugify'
const ALLOWED = ['logic.js', 'Tool.jsx']

const read = (...p) => readFileSync(join(...p), 'utf8')
const toolPath = (id, f) => join('src', 'tools', id, f)

function specIds() {
  return readdirSync(join('docs', 'specs'))
    .filter((f) => f.endsWith('.md'))
    .map((f) => f.replace(/\.md$/, ''))
}

function fence(label, lang, body) {
  return `### ${label}\n\`\`\`${lang}\n${body.trimEnd()}\n\`\`\``
}

function firstPrompt(id) {
  return [
    read('docs', 'WORKER_GUIDE.md'),
    `# Your tool: \`${id}\`\n\n${read('docs', 'specs', `${id}.md`)}`,
    fence(`src/tools/${id}/logic.test.js (must pass)`, 'js', read(toolPath(id, 'logic.test.js'))),
    fence(`src/tools/${id}/logic.js (current stub)`, 'js', read(toolPath(id, 'logic.js'))),
    '# Shared UI you can import',
    fence('src/ui/Field.jsx', 'jsx', read('src', 'ui', 'Field.jsx')),
    fence('src/ui/Output.jsx', 'jsx', read('src', 'ui', 'Output.jsx')),
    fence('src/ui/CopyButton.jsx', 'jsx', read('src', 'ui', 'CopyButton.jsx')),
    `# Reference tool (finished, for style)\n${fence('logic.js', 'js', read(toolPath(REFERENCE, 'logic.js')))}\n${fence('Tool.jsx', 'jsx', read(toolPath(REFERENCE, 'Tool.jsx')))}`,
    `Now write both files for \`${id}\` in the required output format.`,
  ].join('\n\n')
}

async function chat(messages) {
  const res = await fetch(`${URL_BASE}/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: MODEL,
      messages,
      temperature: 0.2,
      max_tokens: 12000,
      chat_template_kwargs: { enable_thinking: false },
    }),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`)
  const data = await res.json()
  return data.choices[0].message.content ?? ''
}

function parseFiles(reply) {
  const files = {}
  const re = /###\s*FILE:\s*([\w.]+)\s*\n```[\w]*\n([\s\S]*?)\n```/g
  for (const m of reply.matchAll(re)) {
    if (ALLOWED.includes(m[1])) files[m[1]] = m[2] + '\n'
  }
  return files
}

async function runTests(id) {
  try {
    const { stdout, stderr } = await run('npx', ['vitest', 'run', `src/tools/${id}`], {
      shell: true,
      maxBuffer: 10 * 1024 * 1024,
    })
    return { pass: true, output: stdout + stderr }
  } catch (e) {
    return { pass: false, output: (e.stdout ?? '') + (e.stderr ?? '') + (e.message ?? '') }
  }
}

async function lint(id) {
  try {
    await run('npx', ['oxlint', `src/tools/${id}`], { shell: true })
    return ''
  } catch (e) {
    return (e.stdout ?? '') + (e.stderr ?? '')
  }
}

async function work(id) {
  const log = (msg) => console.log(`[${id}] ${msg}`)
  const messages = [{ role: 'user', content: firstPrompt(id) }]
  for (let attempt = 1; attempt <= ATTEMPTS; attempt++) {
    log(`attempt ${attempt}: asking Qwen...`)
    const started = Date.now()
    const reply = await chat(messages)
    messages.push({ role: 'assistant', content: reply })
    log(`reply in ${((Date.now() - started) / 1000).toFixed(0)}s`)

    const files = parseFiles(reply)
    const missing = ALLOWED.filter((f) => !files[f])
    if (missing.length) {
      log(`missing ${missing.join(', ')}`)
      messages.push({
        role: 'user',
        content: `Your reply was missing: ${missing.join(', ')}. Resend BOTH files in the exact required format.`,
      })
      continue
    }
    for (const f of ALLOWED) writeFileSync(toolPath(id, f), files[f])

    const tests = await runTests(id)
    const lintOut = tests.pass ? await lint(id) : ''
    if (tests.pass && !/error/i.test(lintOut)) {
      log(`PASS on attempt ${attempt}`)
      return { id, pass: true, attempts: attempt }
    }
    log(tests.pass ? 'tests pass, lint errors' : 'tests failed')
    messages.push({
      role: 'user',
      content: `${tests.pass ? 'Lint errors' : 'Tests failed'}. Fix the problem and resend BOTH complete files.\n\n\`\`\`\n${(tests.pass ? lintOut : tests.output).slice(-6000)}\n\`\`\``,
    })
  }
  log('GAVE UP')
  return { id, pass: false, attempts: ATTEMPTS }
}

// Tiny pool so at most WORKERS requests are in flight.
async function pool(items, size, fn) {
  const results = []
  let next = 0
  await Promise.all(
    Array.from({ length: Math.min(size, items.length) }, async () => {
      while (next < items.length) {
        const item = items[next++]
        results.push(await fn(item).catch((e) => ({ id: item, pass: false, error: e.message })))
      }
    }),
  )
  return results
}

const ids = process.argv.slice(2).length ? process.argv.slice(2) : specIds()
console.log(`Dispatching ${ids.length} tool(s) to ${MODEL} @ ${URL_BASE} (${WORKERS} workers)`)
const results = await pool(ids, WORKERS, work)
console.log('\nSummary')
for (const r of results.sort((a, b) => a.id.localeCompare(b.id))) {
  console.log(`  ${r.pass ? 'PASS' : 'FAIL'}  ${r.id}  ${r.error ?? `(attempts: ${r.attempts})`}`)
}
process.exit(results.every((r) => r.pass) ? 0 : 1)
