import { tools } from '../registry.js'
import { articles, formatDate, readingTime } from '../articles/registry.js'
import SiteHeader from '../ui/chrome/SiteHeader.jsx'
import Footer from '../ui/chrome/Footer.jsx'
import ToolTile from '../ui/chrome/ToolTile.jsx'
import './Articles.css'

const REPO_URL = 'https://github.com/codetwigdev/twigkit'

export default function Articles() {
  return (
    <div className="arts">
      <SiteHeader current="articles" />
      <main id="main" tabIndex={-1}>
        <section className="arts-hero">
          <div className="arts-hero-inner">
            <p className="eyebrow">Articles</p>
            <h1 className="arts-title">From the notebook.</h1>
            <p className="arts-lead">
              Short, practical notes on the ideas behind the tools: what Base64 actually
              is, how to read a token, why cron has five fields. Each note links to the
              tool it explains, and each tool links back.
            </p>
          </div>
        </section>

        <section className="arts-list-wrap" aria-label="All articles">
          {articles.length > 0 ? (
            <ol className="arts-list">
              {articles.map((a) => {
                const tool = a.tool ? tools.find((t) => t.id === a.tool) : null
                return (
                  <li key={a.slug} className="arts-item">
                    <time className="arts-date" dateTime={a.date}>
                      {formatDate(a.date)}
                    </time>
                    <div className="arts-main">
                      <h2 className="arts-item-title">
                        <a href={`#/articles/${a.slug}`}>{a.title}</a>
                      </h2>
                      <p className="arts-summary">{a.summary}</p>
                      <div className="arts-meta">
                        <span className="arts-time">{readingTime(a)}</span>
                        {(a.tags || []).length > 0 && (
                          <ul className="tags" aria-label="Tags">
                            {a.tags.map((t) => (
                              <li key={t} className="tag">
                                {t}
                              </li>
                            ))}
                          </ul>
                        )}
                        {tool && (
                          <a className="arts-tool" href={`#/${tool.id}`}>
                            <ToolTile glyph={tool.icon} size="sm" />
                            {tool.name}
                          </a>
                        )}
                      </div>
                    </div>
                  </li>
                )
              })}
            </ol>
          ) : (
            <p className="arts-empty">
              No articles yet. The first notes are being written; the tools are{' '}
              <a href="#/">already here</a>.
            </p>
          )}
          <p className="arts-foot">
            Articles are data files in the repository, rendered without any HTML
            injection. <a href={REPO_URL}>Read them on GitHub</a>.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  )
}
