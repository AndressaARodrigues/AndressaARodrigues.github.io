import type { ElementType } from 'react'
import { RichText } from '../RichText/RichText'
import styles from './DisplayHeading.module.css'

interface DisplayHeadingProps {
  /** One entry per line on tablet/desktop; lines flow together on phones. */
  lines: string[]
  as?: ElementType
  className?: string
  id?: string
}

/** Large serif heading used by the Home and About heroes. */
export function DisplayHeading({ lines, as: Tag = 'h1', className, id }: DisplayHeadingProps) {
  return (
    <Tag id={id} className={[styles.heading, className].filter(Boolean).join(' ')}>
      {lines.map((line, index) => (
        <span key={index} className={styles.line}>
          <RichText text={line} />{' '}
        </span>
      ))}
    </Tag>
  )
}
