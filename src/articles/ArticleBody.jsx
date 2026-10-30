import CopyButton from '../ui/CopyButton.jsx'
import { renderInline } from './inline.js'

function Block({ block }) {
  switch (block.type) {
    case 'p':
      return <p>{renderInline(block.text)}</p>
    case 'h2':
      return <h2>{renderInline(block.text)}</h2>
    case 'h3':
      return <h3>{renderInline(block.text)}</h3>
    case 'ul':
      return (
        <ul>
          {(block.items || []).map((s, i) => (
            <li key={i}>{renderInline(s)}</li>
          ))}
        </ul>
      )
    case 'ol':
      return (
        <ol>
          {(block.items || []).map((s, i) => (
            <li key={i}>{renderInline(s)}</li>
          ))}
        </ol>
      )
    case 'code':
      return (
        <figure className="art-code">
          <div className="art-code-head">
            <span className="art-code-lang">{block.lang || 'code'}</span>
            <CopyButton text={block.text || ''} />
          </div>
          <pre>
            <code>{block.text || ''}</code>
          </pre>
        </figure>
      )
    case 'quote':
      return (
        <blockquote className="art-quote">
          <p>{renderInline(block.text)}</p>
          {block.cite && <cite>{block.cite}</cite>}
        </blockquote>
      )
    case 'callout':
      return (
        <aside className="art-callout">
          {block.title && <p className="art-callout-title">{block.title}</p>}
          <p>{renderInline(block.text)}</p>
        </aside>
      )
    default:
      return null
  }
}

export default function ArticleBody({ blocks = [] }) {
  return (
    <div className="art-body">
      {blocks.map((b, i) => (
        <Block key={i} block={b} />
      ))}
    </div>
  )
}
