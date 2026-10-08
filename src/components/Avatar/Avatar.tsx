import { site } from '../../content/site'
import styles from './Avatar.module.css'

interface AvatarProps {
  className?: string
}

/** Round profile photo; falls back to initials until a photo is configured. */
export function Avatar({ className }: AvatarProps) {
  const classes = [styles.avatar, className].filter(Boolean).join(' ')

  if (site.avatarSrc) {
    return <img className={classes} src={site.avatarSrc} alt="" width={88} height={88} decoding="async" />
  }

  return (
    <span className={`${classes} ${styles.initials}`} aria-hidden="true">
      {site.initials}
    </span>
  )
}
