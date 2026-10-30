import Brand from './Brand.jsx'
import ThemeToggle from './ThemeToggle.jsx'
import './chrome.css'

export default function SiteHeader({ current }) {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Brand />
        <nav className="site-nav" aria-label="Site">
          <a href="#/" aria-current={current === 'home' ? 'page' : undefined}>
            Tools
          </a>
          <a href="#/articles" aria-current={current === 'articles' ? 'page' : undefined}>
            Articles
          </a>
          <a href="#/about" aria-current={current === 'about' ? 'page' : undefined}>
            How it's built
          </a>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}
