import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import { ImageIcon } from 'lucide-react'
import type { AboutPhoto } from '../../content/about'
import type { PillTone } from '../../content/home'
import { useI18n } from '../../i18n/useI18n'
import tones from '../../styles/tones.module.css'
import styles from './PhotoFan.module.css'

const STAGE_HEIGHT = 420
/** Half the width of the widest slot (outer photo + its tilt), in stage px. */
const CARD_REACH = 149
/** Below this width the photos overlap more, like a hand of cards. */
const COMPACT_BELOW = 810
const COMPACT_SPREAD = 0.5
/** Largest scale, ~10% under the reference size. */
const MAX_SCALE = 0.92
/** Share of the viewport height the fan may take. */
const MAX_HEIGHT_SHARE = 0.41
/** Captions never render smaller than this share of their design size. */
const MIN_TAG_SCALE = 0.8

/**
 * Seven slots measured on the reference recording (centers relative to the
 * middle of the stage, rotation in degrees, stacking order). The middle photo
 * sits on top of its neighbours; the right-hand ones overlap leftwards.
 */
const SLOTS = [
  { x: -536, y: 235, r: -12, z: 1 },
  { x: -384, y: 225, r: -8, z: 2 },
  { x: -211, y: 168, r: -4, z: 3 },
  { x: 0, y: 181, r: 0, z: 7 },
  { x: 191, y: 163, r: 5, z: 4 },
  { x: 316, y: 220, r: 10, z: 5 },
  { x: 496, y: 230, r: 12, z: 6 },
]

/** Placeholder tints, cycling, until real photos are added. */
const PLACEHOLDER_TONES: PillTone[] = ['blue', 'lavender', 'mint', 'pink', 'yellow', 'lime', 'orange']

/**
 * Fan of tilted photos. On first view the photos spread out from a stack in
 * the middle and the captions pop in (reference recording); with reduced
 * motion they are shown in place.
 */
export function PhotoFan({ photos }: { photos: AboutPhoto[] }) {
  const { t } = useI18n()
  const rootRef = useRef<HTMLDivElement>(null)
  const [fit, setFit] = useState({ scale: 1, spread: 1 })
  // With reduced motion the fan starts open; otherwise it opens when seen.
  const [open, setOpen] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  const shown = photos.slice(0, SLOTS.length)
  const firstSlot = Math.floor((SLOTS.length - shown.length) / 2)

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return
    const update = () => {
      const width = root.clientWidth
      const spread = width < COMPACT_BELOW ? COMPACT_SPREAD : 1
      const reach = Math.max(...SLOTS.map((slot) => Math.abs(slot.x))) * spread + CARD_REACH
      const byWidth = (width / 2 - 12) / reach
      // Never taller than about 41% of the screen, so it fits with the headline.
      const byHeight = (window.innerHeight * MAX_HEIGHT_SHARE) / STAGE_HEIGHT
      setFit({ scale: Math.min(MAX_SCALE, byWidth, byHeight), spread })
    }
    update()
    const observer = new ResizeObserver(update)
    observer.observe(root)
    window.addEventListener('resize', update)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', update)
    }
  }, [])

  useEffect(() => {
    const root = rootRef.current
    if (!root || open) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        // Next frame, so the stacked start position is painted first.
        requestAnimationFrame(() => setOpen(true))
        observer.disconnect()
      },
      { threshold: 0.25 },
    )
    observer.observe(root)
    return () => observer.disconnect()
  }, [open])

  const rootStyle = {
    '--fan-scale': fit.scale,
    '--fan-spread': fit.spread,
    '--tag-scale': Math.max(1, MIN_TAG_SCALE / fit.scale),
    height: STAGE_HEIGHT * fit.scale,
  } as CSSProperties
  const middle = Math.floor(SLOTS.length / 2)

  return (
    <div ref={rootRef} className={styles.fan} style={rootStyle} data-open={open}>
      <div className={styles.stage}>
        {shown.map((photo, index) => {
          const slotIndex = firstSlot + index
          const slot = SLOTS[slotIndex]
          const side = Math.sign(slot.x)
          const cardStyle = {
            '--x': `${slot.x}px`,
            '--y': `${slot.y}px`,
            '--r': `${slot.r}deg`,
            '--delay': `${Math.abs(slotIndex - middle) * 45}ms`,
            zIndex: slot.z,
          } as CSSProperties
          const tagStyle = {
            '--x': `${slot.x + side * 40}px`,
            '--y': `${slot.y - 192}px`,
            '--r': `${slot.r}deg`,
          } as CSSProperties

          return (
            <div key={index} className={styles.slot}>
              {photo.src ? (
                <img
                  className={styles.card}
                  style={cardStyle}
                  src={photo.src}
                  alt={t(photo.alt)}
                  width={228}
                  height={288}
                  decoding="async"
                />
              ) : (
                <div
                  className={`${styles.card} ${styles.placeholder} ${tones[PLACEHOLDER_TONES[slotIndex % PLACEHOLDER_TONES.length]]}`}
                  style={cardStyle}
                  aria-hidden="true"
                >
                  <ImageIcon className={styles.placeholderIcon} strokeWidth={1.5} />
                </div>
              )}
              {photo.tag && (
                <span
                  className={`${styles.tag} ${photo.tag.tone === 'yellow' ? styles.tagYellow : styles.tagNeutral}`}
                  style={tagStyle}
                  aria-hidden={photo.src ? undefined : true}
                >
                  {t(photo.tag.label)}
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
