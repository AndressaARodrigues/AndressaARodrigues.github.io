import type { AnchorHTMLAttributes, HTMLAttributes, ReactNode, Ref } from 'react'
import type { LucideIcon } from 'lucide-react'
import type { PillTone } from '../../content/home'
import tones from '../../styles/tones.module.css'
import styles from './Pill.module.css'

interface PillOwnProps {
  tone?: PillTone
  icon?: LucideIcon
  children?: ReactNode
  className?: string
}

type PillSpanProps = PillOwnProps &
  Omit<HTMLAttributes<HTMLSpanElement>, 'children'> & { href?: undefined; ref?: Ref<HTMLSpanElement> }
type PillAnchorProps = PillOwnProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children'> & { href: string; ref?: Ref<HTMLAnchorElement> }

/**
 * Rounded label used by the hero pile and by link groups.
 * Without children it renders as a circle holding only the icon.
 */
export function Pill(props: PillSpanProps | PillAnchorProps) {
  const { tone = 'neutral', icon: Icon, children, className, ...rest } = props
  const classes = [
    styles.pill,
    tones[tone],
    tone === 'neutral' && styles.bordered,
    children ? styles.withLabel : styles.iconOnly,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const content = (
    <>
      {children && <span className={styles.label}>{children}</span>}
      {Icon && <Icon className={styles.icon} aria-hidden="true" strokeWidth={1.75} />}
    </>
  )

  if ('href' in rest && rest.href) {
    return (
      <a className={classes} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {content}
      </a>
    )
  }

  return (
    <span className={classes} {...(rest as HTMLAttributes<HTMLSpanElement>)}>
      {content}
    </span>
  )
}
