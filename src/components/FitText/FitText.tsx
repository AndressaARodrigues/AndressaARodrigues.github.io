import { useLayoutEffect, useRef, type RefObject } from 'react'
import styles from './FitText.module.css'

interface FitTextProps {
  /** Shown on one line, or stacked when the stylesheet sets lines to block. */
  lines: string[]
  /** Use 'span' inside interactive elements such as buttons. */
  as?: 'p' | 'span'
  className?: string
  lineClassName?: string
}

const REFERENCE_SIZE = 100

/** Sets the font size so the text spans exactly the width of its container. */
export function FitText({ lines, as: Tag = 'p', className, lineClassName }: FitTextProps) {
  const outerRef = useRef<HTMLElement>(null)
  const innerRef = useRef<HTMLSpanElement>(null)
  const key = lines.join('\n')

  useLayoutEffect(() => {
    const outer = outerRef.current
    const inner = innerRef.current
    if (!outer || !inner) return

    let lastWidth = -1
    const fit = (force = false) => {
      const available = outer.clientWidth
      if (!available || (!force && available === lastWidth)) return
      lastWidth = available
      outer.style.fontSize = `${REFERENCE_SIZE}px`
      const natural = inner.getBoundingClientRect().width
      if (natural) outer.style.fontSize = `${(REFERENCE_SIZE * available) / natural}px`
    }

    fit(true)
    document.fonts.ready.then(() => fit(true))
    const observer = new ResizeObserver(() => fit())
    observer.observe(outer)
    return () => observer.disconnect()
  }, [key])

  return (
    <Tag
      ref={outerRef as RefObject<HTMLParagraphElement & HTMLSpanElement>}
      className={[styles.fit, className].filter(Boolean).join(' ')}
    >
      <span ref={innerRef} className={styles.inner}>
        {lines.map((line, index) => (
          <span key={index} className={lineClassName}>
            {line}
            {index < lines.length - 1 ? ' ' : ''}
          </span>
        ))}
      </span>
    </Tag>
  )
}
