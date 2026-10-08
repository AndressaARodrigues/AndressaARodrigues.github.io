import type { HTMLAttributes, ReactNode } from 'react'
import styles from './Panel.module.css'

interface PanelProps extends HTMLAttributes<HTMLElement> {
  as?: 'section' | 'div'
  /** Square top edge, for pages where the panel starts at the top of the page. */
  flushTop?: boolean
  children: ReactNode
}

/**
 * White rounded surface that holds a page's main content. It sits above the
 * hero's pill pile at the top and above the dark footer at the bottom.
 */
export function Panel({ as: Tag = 'section', flushTop = false, className, children, ...rest }: PanelProps) {
  return (
    <Tag className={[styles.panel, flushTop && styles.flushTop, className].filter(Boolean).join(' ')} {...rest}>
      {children}
    </Tag>
  )
}
