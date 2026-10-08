import type { CSSProperties } from 'react'
import type { LucideIcon } from 'lucide-react'
import type { PillTone } from '../../content/home'
import tones from '../../styles/tones.module.css'
import styles from './MediaTile.module.css'

type MediaTileProps =
  | { kind: 'image' | 'video'; src: string; alt: string; aspectRatio: number }
  | { kind: 'placeholder'; icon: LucideIcon; tone: PillTone; aspectRatio: number; variant?: number }

/** How much of the project color each placeholder tile gets. */
const PLACEHOLDER_MIX = ['22%', '38%', '14%', '30%']

/** One tile of a project strip: an image, a muted looping video or a neutral placeholder. */
export function MediaTile(props: MediaTileProps) {
  const style = { '--tile-ratio': props.aspectRatio } as CSSProperties

  if (props.kind !== 'placeholder') {
    if (props.kind === 'image') {
      return <img className={styles.tile} style={style} src={props.src} alt={props.alt} loading="lazy" decoding="async" />
    }
    return (
      <video
        className={styles.tile}
        style={style}
        src={props.src}
        aria-label={props.alt}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      />
    )
  }

  const { icon: Icon, tone, variant = 0 } = props
  const placeholderStyle = { ...style, '--tile-mix': PLACEHOLDER_MIX[variant % PLACEHOLDER_MIX.length] } as CSSProperties

  return (
    <div className={`${styles.tile} ${styles.placeholder} ${tones[tone]}`} style={placeholderStyle} aria-hidden="true">
      <Icon className={styles.icon} strokeWidth={1.5} />
    </div>
  )
}
