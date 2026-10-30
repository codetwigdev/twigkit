import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import ArticleBody from './ArticleBody.jsx'

afterEach(cleanup)

const BLOCKS = [
  { type: 'p', text: 'Plain with `code`, **bold**, *italic* and [a link](#/slugify).' },
  { type: 'h2', text: 'Heading two' },
  { type: 'h3', text: 'Heading three' },
  { type: 'ul', items: ['one', 'two'] },
  { type: 'ol', items: ['first', 'second'] },
  { type: 'code', lang: 'js', text: 'const x = 1' },
  { type: 'quote', text: 'A quotation.', cite: 'Someone' },
  { type: 'callout', title: 'Note', text: 'A short aside.' },
  { type: 'video', src: 'nope' },
]

describe('ArticleBody', () => {
  it('renders every block type into the expected elements', () => {
    const { container } = render(<ArticleBody blocks={BLOCKS} />)
    expect(container.querySelector('.art-body')).not.toBeNull()
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Heading two')
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Heading three')
    expect(container.querySelectorAll('ul > li')).toHaveLength(2)
    expect(container.querySelectorAll('ol > li')).toHaveLength(2)
    const code = container.querySelector('figure.art-code')
    expect(code.querySelector('.art-code-lang')).toHaveTextContent('js')
    expect(code.querySelector('pre > code')).toHaveTextContent('const x = 1')
    expect(code.querySelector('button.btn')).toHaveTextContent('Copy')
    const quote = container.querySelector('blockquote.art-quote')
    expect(quote).toHaveTextContent('A quotation.')
    expect(quote.querySelector('cite')).toHaveTextContent('Someone')
    const callout = container.querySelector('aside.art-callout')
    expect(callout.querySelector('.art-callout-title')).toHaveTextContent('Note')
    expect(callout).toHaveTextContent('A short aside.')
  })

  it('renders inline markup as elements and ignores unknown blocks', () => {
    const { container } = render(<ArticleBody blocks={BLOCKS} />)
    const p = container.querySelector('.art-body > p')
    expect(p.querySelector('code')).toHaveTextContent('code')
    expect(p.querySelector('strong')).toHaveTextContent('bold')
    expect(p.querySelector('em')).toHaveTextContent('italic')
    expect(p.querySelector('a')).toHaveAttribute('href', '#/slugify')
    expect(p.querySelector('a')).not.toHaveAttribute('target')
    expect(container.querySelector('video')).toBeNull()
    expect(container.querySelector('.art-body').children).toHaveLength(BLOCKS.length - 1)
  })

  it('never turns text into markup and never links unsafe hrefs', () => {
    const { container } = render(
      <ArticleBody
        blocks={[
          { type: 'p', text: 'x <b>y</b> [bad](javascript:alert(1)) [ok](https://example.com)' },
        ]}
      />,
    )
    const p = container.querySelector('p')
    expect(p.querySelector('b')).toBeNull()
    expect(p).toHaveTextContent('x <b>y</b> [bad](javascript:alert(1)) ok')
    const links = p.querySelectorAll('a')
    expect(links).toHaveLength(1)
    expect(links[0]).toHaveAttribute('href', 'https://example.com')
    expect(links[0]).toHaveAttribute('target', '_blank')
    expect(links[0]).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('renders an empty body for no blocks', () => {
    const { container } = render(<ArticleBody />)
    expect(container.querySelector('.art-body').children).toHaveLength(0)
  })
})
