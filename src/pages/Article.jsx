import { tools } from '../registry.js'
import { articles, formatDate, readingTime } from '../articles/registry.js'
import ArticleBody from '../articles/ArticleBody.jsx'
import SiteHeader from '../ui/chrome/SiteHeader.jsx'
import Footer from '../ui/chrome/Footer.jsx'
import ToolTile from '../ui/chrome/ToolTile.jsx'
import './Article.css'

function Arrow() {
  return (
    <svg className="icon-arrow" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  )
}

function ArrowLeft() {
  return (
    <svg className="icon-arrow-left" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M13 8H3M7 4L3 8l4 4" />
    </svg>
  )
}

export default function Article({ article }) {
  const index = articles.findIndex((a) => a.slug === article.slug)
  const prev = index > 0 ? articles[index - 1] : null
  const next = index >= 0 && index < articles.length - 1 ? articles[index + 1] : null
  const tool = article.tool ? tools.find((t) => t.id === article.tool) : null
  const tags = article.tags || []

  return (
    <div className="art">
      <SiteHeader current="articles" />
      <main id="main" tabIndex={-1}>
        <article className="art-inner">
          <a className="art-back" href="#/articles">
            <ArrowLeft /> All articles
          </a>
          <header className="art-head">
            <p className="art-meta">
              <time dateTime={article.date}>{formatDate(article.date)}</time>
              <span aria-hidden="true"> · </span>
              <span>{readingTime(article)}</span>
            </p>
            <h1 className="art-title">{article.title}</h1>
            <p className="art-summary">{article.summary}</p>
            {tags.length > 0 && (
              <ul className="tags" aria-label="Tags">
                {tags.map((t) => (
                  <li key={t} className="tag">
                    {t}
                  </li>
                ))}
              </ul>
            )}
          </header>

          <ArticleBody blocks={article.blocks} />

          {tool && (
            <aside className="art-try" aria-label="Try the tool">
              <ToolTile glyph={tool.icon} size="md" />
              <div className="art-try-text">
                <p className="eyebrow">Try the tool</p>
                <p className="art-try-name">{tool.name}</p>
                <p className="art-try-desc">{tool.description}</p>
              </div>
              <a className="btn primary art-try-btn" href={`#/${tool.id}`}>
                Open {tool.name} <Arrow />
              </a>
            </aside>
          )}

          {(prev || next) && (
            <nav className="art-nav" aria-label="More articles">
              {prev ? (
                <a className="art-nav-link art-nav-prev" href={`#/articles/${prev.slug}`}>
                  <span className="eyebrow">Previous</span>
                  <span className="art-nav-title">{prev.title}</span>
                </a>
              ) : (
                <span />
              )}
              {next ? (
                <a className="art-nav-link art-nav-next" href={`#/articles/${next.slug}`}>
                  <span className="eyebrow">Next</span>
                  <span className="art-nav-title">{next.title}</span>
                </a>
              ) : (
                <span />
              )}
            </nav>
          )}
        </article>
      </main>
      <Footer />
    </div>
  )
}
