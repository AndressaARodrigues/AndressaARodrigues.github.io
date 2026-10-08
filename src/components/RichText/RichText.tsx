import { Fragment } from 'react'

/**
 * Renders a string with a tiny markup subset:
 *   **text** → <strong>, *text* → <em>
 * Keeps copy in the content files readable without writing JSX there.
 */
export function RichText({ text }: { text: string }) {
  const tokens = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).filter(Boolean)

  return (
    <>
      {tokens.map((token, index) => {
        if (token.startsWith('**') && token.endsWith('**')) {
          return <strong key={index}>{token.slice(2, -2)}</strong>
        }
        if (token.startsWith('*') && token.endsWith('*')) {
          return <em key={index}>{token.slice(1, -1)}</em>
        }
        return <Fragment key={index}>{token}</Fragment>
      })}
    </>
  )
}
