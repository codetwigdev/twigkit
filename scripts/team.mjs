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
// to that package's worker in a fresh call (single-shot, no chat history).
//
// Two ways to reach Qwen:
//   ASK_QWEN_HOST=claude-box   sync the repo to that host over ssh and run its `ask-qwen`
//                              command there (the prefix-cache-friendly path; recommended)
//   (unset)                    call an OpenAI-compatible endpoint directly (QWEN_URL, QWEN_MODEL)
//
// Env: ASK_QWEN_HOST, ASK_QWEN_DIR (remote work dir, default twigkit-work), ASK_QWEN_THINK=1
//      (leave thinking on; off by default), QWEN_URL (default http://localhost:8000/v1),
//      QWEN_MODEL (default Qwen3.8), WORKERS (default 8), ROUNDS (fix rounds, default 2)
import { execFile, spawn } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { promisify } from 'node:util'

const run = promisify(execFile)
const HOST = process.env.ASK_QWEN_HOST
const REMOTE_DIR = process.env.ASK_QWEN_DIR ?? 'twigkit-work'
const THINK = process.env.ASK_QWEN_THINK === '1'
const URL_BASE = process.env.QWEN_URL ?? 'http://localhost:8000/v1'
const MODEL = process.env.QWEN_MODEL ?? 'Qwen3.8'
const WORKERS = Number(process.env.WORKERS ?? 8)
const ROUNDS = Number(process.env.ROUNDS ?? 2)
const WORK_DIR = (process.env.WORK_DIR ?? join('docs', 'design', 'work')).replace(/\\/g, '/')
const TASK_DIR = '.tasks'
const GUIDE = 'docs/TEAM_GUIDE.md'
const CONTRACTS = `${WORK_DIR}/00-contracts.md`

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

const langOf = (file) => (file.endsWith('.css') ? 'css' : file.endsWith('.jsx') ? 'jsx' : 'js')

// The task text: package + notes + errors + output reminder. Context files travel separately.
function taskText(p, errors) {
  return [
    `# Your work package: ${p.name}`,
    `You own exactly these files (output every one in full, nothing else):\n${p.files.map((f) => `- ${f}`).join('\n')}`,
    p.body,
    notes && `# Project manager's review notes (address every point)\n\n${notes}`,
    errors && `# Verification failed after your last attempt. Fix these. The current files are included in full.\n\n\`\`\`\n${errors}\n\`\`\``,
    `For each owned file give a line \`File: <path>\` followed by the complete file in one fenced code block. The team guide and shared contracts are in the shared context above.`,
  ]
    .filter(Boolean)
    .join('\n\n')
}

const existingOwned = (p) => p.files.filter((f) => existsSync(f))

// ---- backend: ask-qwen over ssh -------------------------------------------------

function syncUp() {
  return new Promise((resolve, reject) => {
    const tar = spawn('tar', ['czf', '-', '--exclude=node_modules', '--exclude=dist', '--exclude=.git', '.'])
    const ssh = spawn('ssh', ['-o', 'BatchMode=yes', HOST, `mkdir -p ${REMOTE_DIR} && tar xzf - -C ${REMOTE_DIR}`])
    let err = ''
    ssh.stderr.on('data', (d) => (err += d))
    tar.stdout.pipe(ssh.stdin)
    tar.on('error', reject)
    ssh.on('error', reject)
    ssh.on('close', (code) => (code === 0 ? resolve() : reject(new Error(`sync failed (${code}): ${err}`))))
  })
}

async function viaAskQwen(p, errors) {
  mkdirSync(TASK_DIR, { recursive: true })
  const taskFile = `${TASK_DIR}/${p.name}.txt`
  writeFileSync(taskFile, taskText(p, errors))
  // The task file and current owned files must be on the remote before ask-qwen reads them.
  await syncUp()
  const shared = [GUIDE, existsSync(CONTRACTS) && CONTRACTS].filter(Boolean)
  const files = existingOwned(p)
  const cmd = [
    `cd ${REMOTE_DIR} &&`,
    `ask-qwen "$(cat ${taskFile})"`,
    THINK ? '' : '--no-think',
    `--shared ${shared.join(' ')}`,
    files.length ? `--files ${files.join(' ')}` : '',
  ].join(' ')
  const { stdout, stderr } = await run('ssh', ['-o', 'BatchMode=yes', HOST, cmd], { maxBuffer: 50 * 1024 * 1024 })
  const timing = stderr.split('\n').find((l) => l.startsWith('[qwen]'))
  return { reply: stdout, timing: timing ?? '' }
}

// ---- backend: direct OpenAI-compatible endpoint ---------------------------------

async function viaApi(p, errors) {
  const files = existingOwned(p)
    .map((f) => `### CURRENT ${f}\n\`\`\`${langOf(f)}\n${read(f).trimEnd()}\n\`\`\``)
    .join('\n\n')
  const prompt = [
    read(GUIDE),
    existsSync(CONTRACTS) && `# Shared contracts\n\n${read(CONTRACTS)}`,
    files && `# Current state of your files\n\n${files}`,
    taskText(p, errors),
  ]
    .filter(Boolean)
    .join('\n\n')
  const res = await fetch(`${URL_BASE}/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: MODEL,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.2,
      max_tokens: 16000,
      chat_template_kwargs: { enable_thinking: THINK },
    }),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`)
  return { reply: (await res.json()).choices[0].message.content ?? '', timing: '' }
}

// ---- shared ---------------------------------------------------------------------

// Accepts both "File: path" (ask-qwen) and "### FILE: path" blocks. Only owned paths are kept.
function parseFiles(reply, owned) {
  const out = {}
  const re = /^(?:#{1,6}\s*)?FILE:\s*`?([\w./-]+?)`?\s*\n+```[^\n]*\n([\s\S]*?)^```/gim
  for (const m of reply.matchAll(re)) {
    const path = m[1].replace(/\\/g, '/')
    if (owned.includes(path)) out[path] = m[2]
  }
  return out
}

function writeOut(path, content) {
  mkdirSync(dirname(path), { recursive: true })
  writeFileSync(path, content.endsWith('\n') ? content : content + '\n')
}

async function turn(p, errors, why) {
  const t0 = Date.now()
  const { reply, timing } = await (HOST ? viaAskQwen(p, errors) : viaApi(p, errors))
  const files = parseFiles(reply, p.files)
  for (const [path, content] of Object.entries(files)) writeOut(path, content)
  const missing = p.files.filter((f) => !files[f])
  console.log(
    `[${p.name}] ${why}: ${((Date.now() - t0) / 1000).toFixed(0)}s, wrote ${Object.keys(files).length}/${p.files.length}` +
      (missing.length ? `, MISSING ${missing.join(', ')}` : '') +
      (timing ? `  ${timing}` : ''),
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
    ['build', 'npx', ['vite', 'build']],
    ['tests', 'npx', ['vitest', 'run']],
    ['lint', 'npx', ['oxlint']],
  ]
  const failures = []
  for (const [label, cmd, a] of steps) {
    const r = await sh(cmd, a)
    if (!r.ok) failures.push({ label, out: r.out.replace(/\\/g, '/') })
  }
  return failures
}

async function pool(items, size, fn) {
  let next = 0
  await Promise.all(
    Array.from({ length: Math.min(size, items.length) }, async () => {
      while (next < items.length) await fn(items[next++])
    }),
  )
}

const pkgs = loadPackages()
if (!pkgs.length) {
  console.error('No packages matched.')
  process.exit(1)
}
checkOwnership(pkgs)
console.log(
  `Team of ${Math.min(WORKERS, pkgs.length)} on ${pkgs.length} package(s): ${pkgs.map((p) => p.name).join(', ')}\n` +
    (HOST ? `Backend: ask-qwen on ${HOST}:${REMOTE_DIR}` : `Backend: ${MODEL} @ ${URL_BASE}`),
)

async function attempt(p, errors, why) {
  try {
    let missing = await turn(p, errors, why)
    for (let i = 0; missing.length && i < 1; i++) missing = await turn(p, errors, 'resend')
  } catch (e) {
    console.log(`[${p.name}] ERROR ${e.message.slice(0, 400)}`)
  }
}

await pool(pkgs, WORKERS, (p) => attempt(p, '', 'first pass'))

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
  await pool(blamed, WORKERS, (p) => attempt(p, all, `fix round ${round + 1}`))
}

console.log(failures.length ? '\nStill failing: hand back to the project manager.' : '\nDone.')
process.exit(failures.length ? 1 : 0)
