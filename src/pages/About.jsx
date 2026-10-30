import SiteHeader from '../ui/chrome/SiteHeader.jsx'
import Footer from '../ui/chrome/Footer.jsx'
import CopyButton from '../ui/CopyButton.jsx'
import FlowDiagram from './FlowDiagram.jsx'
import './About.css'

const REPO_URL = 'https://github.com/codetwigdev/twigkit'

const FIGURES = [
  { value: '8', label: 'tools built by workers' },
  { value: '89', label: 'tests, all passing' },
  { value: '~14 s', label: 'for a full parallel run' },
  { value: '0', label: 'bytes uploaded, ever' },
]

const COMMANDS = [
  {
    label: 'Scaffold the folder',
    cmd: 'npm run new-tool -- my-tool "My Tool" "What it does." "*" myFunction',
  },
  {
    label: 'Dispatch a worker',
    cmd: 'QWEN_URL=http://localhost:8000/v1 QWEN_MODEL=your-model npm run dispatch -- my-tool',
  },
  { label: 'Verify', cmd: 'npm test' },
]

function Arrow() {
  return (
    <svg className="icon-arrow" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  )
}

export default function About() {
  return (
    <div className="about">
      <SiteHeader current="about" />
      <main id="main" tabIndex={-1}>
        <section className="about-hero">
          <div className="about-hero-inner">
            <p className="eyebrow">How it's built</p>
            <h1 className="about-title">One architect, eight workers, and a test suite between them.</h1>
            <p className="about-lead">
              TwigKit is a free test project. A strong model (Claude) designs the structure
              and writes the contracts; a cheaper local model (Qwen) does the bulk typing, in
              parallel, and is held to those contracts by tests. Every spec, prompt and test
              the workers saw is in the repository.
            </p>
          </div>
        </section>

        <section className="about-section" aria-label="Key figures">
          <ul className="figures">
            {FIGURES.map((f) => (
              <li key={f.label} className="figure">
                <b>{f.value}</b>
                <span>{f.label}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="about-section" aria-labelledby="loop-title">
          <p className="eyebrow">The loop</p>
          <h2 className="about-h2" id="loop-title">
            From spec to shipped tool
          </h2>
          <FlowDiagram />
        </section>

        <section className="about-section" aria-labelledby="story-title">
          <p className="eyebrow">The story</p>
          <h2 className="about-h2" id="story-title">
            What actually happened
          </h2>
          <ol className="story-list">
            <li className="story-item">
              <h3>The architect writes the contract</h3>
              <p>
                Claude wrote the app shell, the shared UI, the tool contract, one reference
                tool (Slugify), a spec per tool and a test file per tool. The tests are the
                source of truth for what each function must return.
              </p>
            </li>
            <li className="story-item">
              <h3>Eight workers type in parallel</h3>
              <p>
                Each Qwen worker, running against a local vLLM server, receives one spec and
                one test file and returns two files: <code>logic.js</code> (pure functions)
                and <code>Tool.jsx</code> (UI wiring). It never sees the other tools.
              </p>
            </li>
            <li className="story-item">
              <h3>The loop verifies</h3>
              <p>
                <code>scripts/dispatch.mjs</code> and <code>scripts/team.mjs</code> write the
                files, run the tests, build and lint, and send any failure back to the worker
                that wrote it for another attempt, before anything reaches review.
              </p>
            </li>
            <li className="story-item">
              <h3>The architect reviews</h3>
              <p>
                Passing tests is necessary, not sufficient. The first pass shipped three
                tools that showed an error before you typed anything, which no test caught.
                The fix went into the worker guide, and those tools were re-dispatched.
              </p>
            </li>
          </ol>
          <p className="build-note">
            This site was built the same way. A Fable 5.1 designer wrote the design and seven
            work packages; seven Qwen workers built them in about 40 seconds, and the
            architect reviewed the result in a browser.
          </p>
        </section>

        <section className="about-section" aria-labelledby="build-title">
          <p className="eyebrow">Build your own</p>
          <h2 className="about-h2" id="build-title">
            Add a tool in three commands
          </h2>
          <p className="build-text">
            Any folder under <code>src/tools/</code> with an <code>index.js</code> shows up in
            the tool list automatically. Scaffold it, hand the spec to a model (or write it
            yourself), and let the tests decide.
          </p>
          <ol className="cmds">
            {COMMANDS.map((c, i) => (
              <li key={c.label} className="cmd">
                <span className="cmd-num" aria-hidden="true">{i + 1}</span>
                <span className="cmd-label">{c.label}</span>
                <pre className="cmd-code">
                  {c.cmd}
                  <CopyButton text={c.cmd} />
                </pre>
              </li>
            ))}
          </ol>
          <p className="build-note">
            dispatch talks to any OpenAI-compatible endpoint: vLLM, Ollama, LM Studio.
          </p>
          <a className="build-link" href={REPO_URL}>
            Read the worker guide and the specs on GitHub <Arrow />
          </a>
        </section>
      </main>
      <Footer />
    </div>
  )
}
