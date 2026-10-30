// Run design work packages with a team of Qwen workers.
//
//   node scripts/team.mjs                    run every package in docs/design/work/
//   node scripts/team.mjs 03 04              run only packages whose file name starts with 03 / 04
//   node scripts/team.mjs 04 --notes n.md    revision round: send review notes with the package
//
// A package is docs/design/work/NN-name.md with front matter:
//   ---
//   files:
//     - src/some/file.css
//   ---
// Each worker sees: the team guide, the shared contracts (00-contracts.md), its package,
// and the current contents of the files it owns. Workers run in parallel, then the whole
// project is verified (build, tests, lint). Errors that mention a package's files go back
// to that package's worker for another try.
//
// Env: QWEN_URL (default http://localhost:8000/v1), QWEN_MODEL (default Qwen3.8),
//      WORKERS (default 8), ROUNDS (fix rounds after the first write, default 2)
import { execFile } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { promisify } from 'node:util'

const run = promisify(execFile)
const URL_BASE = process.env.QWEN_URL ?? 'http://localhost:8000/v1'
const MODEL = process.env.QWEN_MODEL ?? 'Qwen3.8'
const WORKERS = Number(process.env.WORKERS ?? 8)
const ROUNDS = Number(process.env.ROUNDS ?? 2)
const WORK_DIR = join('docs', 'design', 'work')

const args = process.argv.slice(2)
const notesIdx = args.indexOf('--notes')
const notes = notesIdx >= 0 ? readFileSync(args[notesIdx + 1], 'utf8') : ''
const wanted = args.filter((a, i) => i !== notesIdx && i !== notesIdx + 1)

const norm = (s) => s.replace(/\r\n/g, '\n')
const read = (p) => norm(readFileSync(p, 'utf8'))

function loadPackages() {
  return readdirSync(WORK_DIR)
    .filter((f) => /^\d\d-.+\.md$/.test(f) && !f.startsWith('00-'))
    .filter((f) => !wanted.length || wanted.some((w) => f.startsWith(w)))
    .sort()
    .map((f) => {
      const text = read(join(WORK_DIR, f))
      const m = text.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
      if (!m) throw new Error(`${f}: missing front matter`)
      const files = [...m[1].matchAll(/^\s*-\s+(\S+)\s*$/gm)].map((x) => x[1])
      if (!files.length) throw new Error(`${f}: no files listed`)
      return { name: f.replace(/\.md$/, ''), files, body: m[2].trim() }
    })
}

function checkOwnership(pkgs) {
  const seen = new Map()
  for (const p of pkgs) {
    for (const f of p.files) {
      if (seen.has(f)) throw new Error(`${f} is owned by both ${seen.get(f)} and ${p.name}`)
      seen.set(f, p.name)
    }
  }
}

function langOf(file) {
  return file.endsWith('.css') ? 'css' : file.endsWith('.jsx') ? 'jsx' : 'js'
}

function currentFiles(p) {
  return p.files
    .filter((f) => existsSync(f))
    .map((f) => `### CURRENT ${f}\n\`\`\`${langOf(f)}\n${read(f).trimEnd()}\n\`\`\``)
    .join('\n\n')
}

function firstPrompt(p) {
  const contractsPath = join(WORK_DIR, '00-contracts.md')
  return [
    read(join('docs', 'TEAM_GUIDE.md')),
    existsSync(contractsPath) ? `# Shared contracts\n\n${read(contractsPath)}` : '',
    `# Your work package: ${p.name}\n\nYou own exactly these files:\n${p.files.map((f) => `- ${f}`).join('\n')}\n\n${p.body}`,
    currentFiles(p) && `# Current state of your files (replace them)\n\n${currentFiles(p)}`,
    notes && `# Project manager's review notes (address every point)\n\n${notes}`,
    `Now output every file you own, in full, in the required format.`,
  ]
    .filter(Boolean)
    .join('\n\n')
}

async function chat(messages) {
  const res = await fetch(`${URL_BASE}/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: MODEL,
      messages,
      temperature: 0.2,
      max_tokens: 16000,
      chat_template_kwargs: { enable_thinking: false },
    }),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`)
  return (await res.json()).choices[0].message.content ?? ''
}

function parseFiles(reply, owned) {
  const out = {}
  const re = /###\s*FILE:\s*([\w./-]+)\s*\n```[\w]*\n([\s\S]*?)\n```/g
  for (const m of reply.matchAll(re)) {
    const path = m[1].replace(/\\/g, '/')
    if (owned.includes(path)) out[path] = m[2] + '\n'
  }
  return out
}

function writeOut(path, content) {
  mkdirSync(dirname(path), { recursive: true })
  writeFileSync(path, content)
}

// One worker turn: send messages, write whatever owned files came back.
async function turn(p, messages, why) {
  const t0 = Date.now()
  const reply = await chat(messages)
  messages.push({ role: 'assistant', content: reply })
  const files = parseFiles(reply, p.files)
  for (const [path, content] of Object.entries(files)) writeOut(path, content)
  const missing = p.files.filter((f) => !files[f])
  console.log(
    `[${p.name}] ${why}: ${((Date.now() - t0) / 1000).toFixed(0)}s, wrote ${Object.keys(files).length}/${p.files.length}` +
      (missing.length ? `, MISSING ${missing.join(', ')}` : ''),
  )
  return missing
}

async function sh(cmd, cmdArgs) {
  try {
    const { stdout, stderr } = await run(cmd, cmdArgs, { shell: true, maxBuffer: 20 * 1024 * 1024 })
    return { ok: true, out: norm(stdout + stderr) }
  } catch (e) {
    return { ok: false, out: norm((e.stdout ?? '') + (e.stderr ?? '') + (e.message ?? '')) }
  }
}

async function verify() {
  const steps = [
    ['build', ['npx', ['vite', 'build']]],
    ['tests', ['npx', ['vitest', 'run']]],
    ['lint', ['npx', ['oxlint']]],
  ]
  const failures = []
  for (const [label, [cmd, a]] of steps) {
    const r = await sh(cmd, a)
    if (!r.ok) failures.push({ label, out: r.out.replace(/\\/g, '/') })
  }
  return failures
}

async function pool(items, size, fn) {
  let next = 0
  const results = []
  await Promise.all(
    Array.from({ length: Math.min(size, items.length) }, async () => {
      while (next < items.length) {
        const item = items[next++]
        results.push(await fn(item))
      }
    }),
  )
  return results
}

const pkgs = loadPackages()
if (!pkgs.length) {
  console.error('No packages matched.')
  process.exit(1)
}
checkOwnership(pkgs)
console.log(`Team of ${Math.min(WORKERS, pkgs.length)} on ${pkgs.length} package(s): ${pkgs.map((p) => p.name).join(', ')}`)

const convo = new Map(pkgs.map((p) => [p.name, [{ role: 'user', content: firstPrompt(p) }]]))

await pool(pkgs, WORKERS, async (p) => {
  try {
    const messages = convo.get(p.name)
    let missing = await turn(p, messages, 'first pass')
    for (let i = 0; missing.length && i < 2; i++) {
      messages.push({ role: 'user', content: `You did not output: ${missing.join(', ')}. Output every owned file in full in the required format.` })
      missing = await turn(p, messages, 'resend')
    }
  } catch (e) {
    console.log(`[${p.name}] ERROR ${e.message}`)
  }
})

let failures = []
for (let round = 0; round <= ROUNDS; round++) {
  console.log(`\nVerifying (round ${round})...`)
  failures = await verify()
  if (!failures.length) {
    console.log('Build, tests and lint all pass.')
    break
  }
  const all = failures.map((f) => `## ${f.label}\n${f.out.slice(-5000)}`).join('\n\n')
  const blamed = pkgs.filter((p) => p.files.some((f) => all.includes(f)))
  console.log(`Failed: ${failures.map((f) => f.label).join(', ')}. Blamed: ${blamed.map((p) => p.name).join(', ') || 'nobody (needs the PM)'}`)
  if (round === ROUNDS || !blamed.length) break
  await pool(blamed, WORKERS, async (p) => {
    const mine = failures
      .map((f) => ({ label: f.label, lines: f.out.split('\n') }))
      .map(({ label, lines }) => `## ${label}\n${lines.join('\n').slice(-4000)}`)
      .join('\n\n')
    const messages = convo.get(p.name)
    messages.push({
      role: 'user',
      content: `Verification failed. Errors that mention your files are below. Fix them and output every owned file in full again.\n\n\`\`\`\n${mine}\n\`\`\``,
    })
    try {
      await turn(p, messages, `fix round ${round + 1}`)
    } catch (e) {
      console.log(`[${p.name}] ERROR ${e.message}`)
    }
  })
}

console.log(failures.length ? '\nStill failing: hand back to the project manager.' : '\nDone.')
process.exit(failures.length ? 1 : 0)
