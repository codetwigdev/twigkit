import Brand from './Brand.jsx'
import './chrome.css'

const REPO_URL = 'https://github.com/codetwigdev/twigkit'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="site-footer-brand">
          <Brand />
          <p className="site-footer-tag">Tiny tools, done beautifully.</p>
        </div>
        <nav className="site-footer-nav" aria-label="Footer">
          <a href="#/">Tools</a>
          <a href="#/articles">Articles</a>
          <a href="#/about">How it's built</a>
          <a href={REPO_URL}>Source on GitHub</a>
        </nav>
        <p className="site-footer-note">
          A free, open-source test project by CodeTwig. MIT licensed. Nothing you type
          leaves this tab: there is no server to send it to.
        </p>
      </div>
    </footer>
  )
}
